import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing in environment variables.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateSupportResponse = async (
  userMessage: string,
  balance: number,
  activeSubsCount: number
): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "Lo siento, el servicio de IA no está configurado correctamente.";

  try {
    const model = "gemini-2.5-flash";
    const systemInstruction = `
      Actúa como el asistente virtual de soporte para "StreamHub", una plataforma de venta de cuentas de streaming.
      
      Datos del usuario actual:
      - Saldo: $${balance}
      - Suscripciones activas: ${activeSubsCount}

      Tus responsabilidades:
      1. Ayudar con problemas de inicio de sesión (recomendar botón "Reportar Fallo").
      2. Explicar cómo recargar saldo.
      3. Recomendar servicios del catálogo (Netflix, Spotify, etc.).
      4. Ser breve, amable y usar emojis.
      
      Si el usuario pregunta por precios específicos, di que consulte el catálogo para ver ofertas actualizadas.
    `;

    const response = await ai.models.generateContent({
      model,
      contents: userMessage,
      config: {
        systemInstruction,
      },
    });

    return response.text || "Lo siento, no pude procesar tu solicitud en este momento.";
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Hubo un error al conectar con el soporte inteligente. Por favor intenta más tarde.";
  }
};