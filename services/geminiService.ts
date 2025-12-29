
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client according to the latest SDK guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePropertyDescription = async (details: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Write a compelling real estate marketing description for this property: ${details}. Keep it professional and inviting.`,
    });
    // Use the .text property to extract generated content.
    return response.text || "Failed to generate description.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error connecting to AI service.";
  }
};

export const generateCommunicationDraft = async (
  type: 'whatsapp' | 'sms',
  leadName: string,
  propertyName: string,
  context: string = "following up on interest"
): Promise<string> => {
  const limit = type === 'sms' ? "160 characters" : "a few friendly sentences";
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Draft a ${type} message for a client named ${leadName} about the property "${propertyName}". The context is: ${context}. Keep it under ${limit}. Use emojis if appropriate for WhatsApp.`,
    });
    // Use the .text property to extract generated content.
    return response.text || "Failed to generate draft.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return `Hi ${leadName}, I'm reaching out about ${propertyName}. Are you still interested?`;
  }
};
