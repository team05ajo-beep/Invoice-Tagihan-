
import { GoogleGenAI, Type } from "@google/genai";

// Initialize the GoogleGenAI client with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractInvoiceData = async (base64Image: string) => {
  try {
    // Generate content using the gemini-3-flash-preview model for document extraction.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/png',
              data: base64Image.split(',')[1] || base64Image,
            },
          },
          {
            text: "Extract invoice details from this image. Map the fields accurately. For 'alreadyPaid', find 'Sudah Dibayar'. For 'items', include the descriptions, quantities, and prices."
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            invoiceNumber: { type: Type.STRING },
            date: { type: Type.STRING },
            customerName: { type: Type.STRING },
            customerAddress: { type: Type.STRING },
            projectName: { type: Type.STRING },
            projectPeriod: { type: Type.STRING },
            alreadyPaid: { type: Type.NUMBER },
            paymentAccount: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  description: { type: Type.STRING },
                  quantity: { type: Type.NUMBER },
                  size: { type: Type.STRING },
                  price: { type: Type.NUMBER }
                }
              }
            }
          }
        }
      }
    });

    // Extract text directly from the response object as per SDK guidelines.
    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Extraction error:", error);
    throw error;
  }
};
