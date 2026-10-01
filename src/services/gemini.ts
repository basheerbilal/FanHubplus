import { ChatMessage } from "../types";

export const chatWithGemini = async (messages: ChatMessage[], systemInstruction: string) => {
  try {
    const response = await fetch("/api/gemini/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: messages.map(m => ({ role: m.role, text: m.text })),
        systemInstruction,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to communicate with AI");
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini service error:", error);
    throw error;
  }
};
