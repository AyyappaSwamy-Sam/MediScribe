import Faq from "react-faq-component";
import React from 'react';

// Define FAQ questions and answers
const data = {
    title: "Frequently Asked Questions (FAQ)",
    rows: [
        {
            title: "What problem does Mediscribe solve?",
            content: `Mediscribe eliminates time-consuming manual documentation by recording, transcribing, and summarizing doctor-patient conversations. This allows healthcare providers to focus more on patient care while ensuring accurate and complete documentation.`,
        },
        {
            title: "How does AI improve the workflow for healthcare providers?",
            content:
                "AI streamlines documentation by automatically transcribing notes, reducing the administrative burden on healthcare providers, and allowing them to serve more patients with improved workflow efficiency.",
        },
        {
            title: "Is Mediscribe secure and compliant with healthcare regulations?",
            content: `Yes, Mediscribe prioritizes patient privacy and data security. It complies with healthcare regulations like HIPAA to ensure all patient information is securely handled.`,
        },
        {
            title: "How does Mediscribe integrate with EMR systems?",
            content: `Once doctors validate the notes transcribed by Mediscribe, they can seamlessly push the data to EMR systems, ensuring efficient record-keeping and easy access to patient information.`,
        },
    ],
};

// Customize styles with Tailwind CSS and transitions
const styles = {
    titleTextColor: "black",      // Customize the title color (blue)
    rowTitleColor: "black",       // Customize the question color (blue)
    rowContentColor: "#333333",     // Customize the answer text color (dark gray)
    bgColor: "white",               // Background color for the FAQ
    rowTitleTextSize: '1.2rem',     // Font size for the questions
    rowContentTextSize: '1rem',     // Font size for the answers
    fontFamily: 'font-mono',        // Use monospaced font
    arrowColor: "#0d6efd", 
    width:"100%",         // Customize the dropdown arrow color (blue)
    
};

// Smooth transition and animation settings
const config = {
    animate: true,              // Enable animations
    arrowIcon: "▼",             // Customize the dropdown arrow icon
    openOnStart: 0,             // Open the first FAQ on page load
    transitionDuration: "0.4s", // Smooth transition for dropdown
    timingFunc: "ease-in-out",  // Use ease-in-out for smooth opening and closing
};

export default function Faq1() {
    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-blue-600 mb-8 font-mono">
                Mediscribe FAQ
            </h1>
            <Faq
                data={data}
                styles={styles}
                config={config}
            />
        </div>
    );
}
