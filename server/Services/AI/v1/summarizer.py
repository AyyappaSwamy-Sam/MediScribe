from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import AutoTokenizer, AutoModelForCausalLM, BitsAndBytesConfig
import torch
import re
import json
 
# Initialize FastAPI app
app = FastAPI()
 
# Load the LLaMA model and tokenizer with quantization
quantization_config = BitsAndBytesConfig(
    load_in_4bit=False,
    bnb_8bit_compute_dtype=torch.float16,
    bnb_8bit_use_double_quant=True,
    bnb_8bit_quant_type="nf4"
)
 
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.2-3B-Instruct",
    device_map="auto",
    quantization_config=quantization_config,
    torch_dtype=torch.float16,
    low_cpu_mem_usage=True
)
 
tokenizer = AutoTokenizer.from_pretrained(
    "meta-llama/Llama-3.2-3B-Instruct",
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
    # structured_output: dict
 
# Define the chat prompt for generating summary
system_prompt = """You are a medical documentation specialist.
Please analyze the following doctor-patient conversation and create a detailed SOAP note summary.
Include only information that was explicitly discussed in the conversation.
If any section lacks information from the conversation, indicate "Not discussed" rather than making assumptions."""
 
structured_prompt = """You are a medical documentation specialist.
Please analyze the following doctor-patient conversation and create a detailed summary.
Include only information that was explicitly discussed in the conversation.
If any section lacks information from the conversation, indicate "Not discussed" rather than making assumptions.
                   
Output in JSON format with the following structure:
results = {
    "Symptoms": "",
    "Diseases": "",
    "Medication": "",
    "Diet": {
        "Foods to eat": "",
        "Foods to avoid": ""
    },
    "Healthy Habits": "",
    "Diagnosis": ""
}
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
        summary_prompt = f"{tokenizer.eos_token} {system_prompt} {tokenizer.eos_token} {request.conversation} {tokenizer.eos_token}"
        summary = generate_response(summary_prompt)
       
        # Generate structured output
        # structured_prompt_text = f"{tokenizer.eos_token} {structured_prompt} {tokenizer.eos_token} {request.json()['conversation']} {tokenizer.eos_token}"
        # structured_response_text = generate_response(structured_prompt_text)
       
        # Extract JSON content from structured response
        # json_content = re.search(r"{(.*)}", structured_response_text, re.DOTALL)
        # if json_content:
        #     json_str = "{" + json_content.group(1) + "}"
        #     structured_output = json.loads(json_str)
        # else:
        #     raise ValueError("Failed to parse JSON response")
 
        # Return summary and structured output'
        print('hello world ::  ::  ',summary)
        return SummaryResponse(summary=summary)
   
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
 
# Run FastAPI app on port 5007
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5007)
 