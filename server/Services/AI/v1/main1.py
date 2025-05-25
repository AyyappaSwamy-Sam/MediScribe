from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import torch
import re
import json

# Initialize FastAPI app
app = FastAPI()

#Load the LLaMA model and tokenizer with quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=False,
    bnb_8bit_compute_dtype=torch.float16,
    bnb_8bit_use_double_quant=True,
    bnb_8bit_quant_type="nf4"
)
 
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
   
    device_map="auto",
    quantization_config=quantization_config,
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True
)
 
tokenizer = AutoTokenizer.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
    padding_side="left",
    add_eos_token=True
)

if tokenizer.pad_token is None:
    tokenizer.pad_token = tokenizer.eos_token
    model.config.pad_token_id = tokenizer.pad_token_id
 
# Define request and response models
class SummaryRequest(BaseModel):
    conversation: str
 
class SummaryResponse(BaseModel):
    summary: str
    structured: str
    # structured_output: dict

def clean_assistant_prefix(text):
    # Remove "Assistant: " from the beginning of the text
   
    # Remove any "Assistant:" (without space) if present
    if text.startswith("assistant"):
        return text[9:]  # 10 is the length of "Assistant:"

    # If there's no assistant prefix, return original text
    return text

# Define the chat prompt for generating summary
system_prompt = """ Create a Medical SOAP note summary from the dialogue, following these guidelines: S (Subjective): 
                        Summarize the patient's reported symptoms, including chief complaint and relevant history. Rely on the patient's statements as the primary source and 
                        ensure standardized terminology. O (Objective): Highlight critical findings such as vital signs, lab results, and imaging, emphasizing important 
                        details like the side of the body affected and specific dosages. Include normal ranges where relevant. 
                        A (Assessment): Offer a concise assessment combining subjective and objective data. 
                        State the primary diagnosis and any differential diagnoses, noting potential complications and the prognostic outlook. 
                        P (Plan): Outline the management plan, covering medication, diet, consultations, and education.
                        Ensure to mention necessary referrals to other specialties and address compliance challenges. 
                        Considerations: Compile the report based solely on the transcript provided. Maintain confidentiality and document sensitively.
                        Use concise medical jargon and abbreviations for effective doctor communication. 
                        Please format the summary in a clean, simple list format without using markdown or bullet points. Use 'S:', 'O:', 'A:', 'P:' directly followed by the text. 
                        Avoid any styling or special characters.
                    Given Context :
"""
 
structured_prompt = """You are a medical documentation specialist. Please analyze the provided doctor-patient conversation and create a structured clinical summary.

Guidelines:
1. Extract ONLY information explicitly stated in the conversation
2. Do not make assumptions or infer information
3. Never break the JSON format regardless of input quality
4. Use exactly "None" (not null, not "Not discussed", not empty string) for any missing/unclear information
5. Mark any ambiguous statements as "Unclear"
6. Include direct quotes where relevant
7. Always return a consistent JSON response.Never include comments or explanations within JSON


Please output the analysis in the following JSON format:

{
   
    "Chief_Complaint": "",
    "Symptoms": "",
    "Physical_Examination": "",
    "Diagnosis": "",
    "Medications":"",
    "Treatment_Plan": "",
    "Lifestyle_Modifications": {
        "Diet": {
            "Recommended": "",
            "Restricted": ""
        },
        "Exercise": "",
        "Other_Recommendations": ""
    },
    "Follow_up": {
        "Timing": "",
        "Special_Instructions": ""
    },
    
    "Additional_Notes": ""
}

Given Context : \n
"""
 
def generate_response(prompt):
    input_ids = tokenizer.encode(prompt, return_tensors="pt").to(model.device)
    attention_mask = torch.ones_like(input_ids)
    outputs = model.generate(
        input_ids,
        attention_mask=attention_mask,
        max_new_tokens=512,
        eos_token_id=tokenizer.eos_token_id,
        temperature=0.6,
        top_p=0.9
    )
    response = outputs[0][input_ids.shape[-1]:]
    response_text = tokenizer.decode(response, skip_special_tokens=True)
    return response_text


@app.post("/get-summary", response_model=SummaryResponse)
async def get_summary(request: SummaryRequest):
    try:
        # Generate summary
        print('Hello hi',request.conversation)

        
        summary_prompt = f"{tokenizer.eos_token} {system_prompt+request.conversation} {tokenizer.eos_token}"
        summary = generate_response(summary_prompt)

      
       
        # Generate structured output
        structured_prompt_text = f"{tokenizer.eos_token} {structured_prompt+request.conversation} {tokenizer.eos_token}"
        structured_response_text = generate_response(structured_prompt_text)


       
       
        
        # json_content = re.search(r"{(.*)}", structured_response_text, re.DOTALL)
        # if json_content:
        #     json_str = "{" + json_content.group(1) + "}"
        #     structured_output = json.loads(json_str)
        # else:
        #     raise ValueError("Failed to parse JSON response")
 
        # Return summary and structured output'
        summary = clean_assistant_prefix(summary)
        structured_response_text = clean_assistant_prefix(structured_response_text)
        summary = summary.replace('*', '')
        print('hello world ::  ::  ',summary)
        print("HI HI:", structured_response_text)
        return {"summary":summary, "structured":structured_response_text}
   
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
# Run FastAPI app on port 5007
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5007)
 