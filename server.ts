import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Health Check
  app.get("/api/health", (req, res) => {
    res.json({
      status: "ok",
      workshop: "Taller IA Generativa Jujuy",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // API Expand Story with Gemini
  app.post("/api/expand-story", async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(503).json({
          error: "GEMINI_API_KEY no disponible en el servidor.",
          hasKey: false
        });
      }

      const { groupName, genre, visualStyle, location, characters, plotHook, aiChallenge } = req.body;

      const ai = new GoogleGenAI({
        apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });

      const prompt = `Eres el director pedagógico y creativo de un taller de Inteligencia Artificial Generativa en la provincia de Jujuy, Argentina.
Un grupo de participantes ("${groupName || 'Equipo'}") ha recibido por sorteo aleatorio la siguiente consigna creativa:

- Género narrativo: ${genre}
- Estilo estético / visual: ${visualStyle}
- Locación en Jujuy: ${location}
- Personajes: ${characters}
- Detonante / Conflicto: ${plotHook}
- Desafío del Taller: ${aiChallenge}

Elabora un "Kit de Proyecto y Prompts" completo para que el grupo pueda trabajar inmediatamente en herramientas como Midjourney/Flux, ChatGPT/Gemini y Suno/ElevenLabs. Debe fusionar de forma genuina y respetuosa la riqueza paisajística y cultural jujeña (Quebrada, Puna, Yungas o Valles) con el género asignado.

Responde estrictamente en formato JSON válido con la siguiente estructura:
{
  "tituloProyecto": "Título creativo y contundente",
  "logline": "1 o 2 oraciones de alto impacto que resumen la historia",
  "sinopsisNarrativa": "Desarrollo de la trama en 3 párrafos cortos (Planteamiento, Nudo con el conflicto local, Desenlace o giro inesperado)",
  "vinculoJujuy": "Breve explicación de por qué este escenario o mitología local es crucial para la trama",
  "personajesDetalle": [
    {
      "nombre": "Nombre del personaje",
      "rol": "Rol en la historia",
      "descripcion": "Descripción psicológica y rasgos andinos/locales",
      "visualPromptCue": "Detalles estéticos clave para generar su imagen en IA"
    }
  ],
  "promptsListos": {
    "imagenHero": "Prompt en inglés listo para copiar en Midjourney v6 / Flux.1 con descripción cinematográfica, relación de aspecto --ar 16:9 y parámetros de estilo",
    "guionHistoria": "Prompt para ChatGPT / Claude para redactar la escena climática o teaser con tono y diálogos",
    "audioBandaSonora": "Prompt para Suno / Udio con estilos musicales (ej: folclore andino fusión, sikus, sintetizadores darksynth, tempo, etc.)"
  },
  "misionDelGrupo": [
    "Paso 1: Generar la imagen conceptual principal",
    "Paso 2: Desarrollar el guión o diálogo central con LLM",
    "Paso 3: Presentar el pitch en 2 minutos frente al taller"
  ]
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.8,
        }
      });

      const rawText = response.text || "{}";
      const parsed = JSON.parse(rawText);
      return res.json({ success: true, brief: parsed });
    } catch (err: any) {
      console.error("Error al expandir historia con Gemini:", err);
      return res.status(500).json({ error: err?.message || "Error al generar expansión con IA" });
    }
  });

  // Vite middleware for dev or static serving for prod
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Servidor de taller Jujuy listo en http://localhost:${PORT}`);
  });
}

startServer();
