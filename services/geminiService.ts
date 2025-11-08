import { GoogleGenAI, Modality } from "@google/genai";
import type { StoryParams } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const storyGenerationModel = 'gemini-2.5-pro';
const ttsModel = 'gemini-2.5-flash-preview-tts';

function buildStoryPrompt(params: StoryParams): string {
  return `
Please write a story with the following elements:

**Characters:**
${params.characters || 'Not specified.'}

**Setting (Place & Time):**
${params.place || 'Not specified.'}, during the ${params.timePeriod || 'Not specified.'}.

**Context & Plot:**
${params.plot || 'A simple, developing plot.'}
The main context is: ${params.context || 'Not specified.'}

**Genre(s):**
${params.genres || 'General Fiction.'}

**Theme:**
${params.theme || 'Not specified.'}

**Narrative Style:**
- Point of View: ${params.pointOfView}
- Style: ${params.style || 'A clear and engaging style.'}
- Pacing: ${params.pacing || 'A moderate pace.'}
- Structure: ${params.structure || 'Linear and chronological.'}
- Narrative Voice: ${params.narrative || 'An objective narrator.'}
- Character Voice Assignments: ${params.characterVoiceMapping || 'Please assign distinct, appropriate voices to the characters.'}

**Desired Ending:**
${params.preferredEnding || 'A satisfying conclusion.'}

---
**IMPORTANT INSTRUCTIONS:**
1.  Begin the story now. Ensure narration sets the scene effectively and dialogue feels authentic.
2.  You MUST format all character dialogue strictly as \`CharacterName: "The dialogue text."\`.
3.  Each piece of dialogue must be in its own paragraph. Narration should also be in separate paragraphs. Do not mix narration and dialogue in the same paragraph.
---
`;
}

export async function generateStory(params: StoryParams): Promise<string> {
  const prompt = buildStoryPrompt(params);

  try {
    const response = await ai.models.generateContent({
      model: storyGenerationModel,
      contents: prompt,
      config: {
        systemInstruction: "You are a master storyteller and creative writer. Your task is to write a compelling story based on the user's detailed specifications. You must strictly follow all formatting instructions, especially for character dialogue.",
        temperature: 0.8,
        topP: 0.95,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Error generating story:", error);
    throw new Error("Failed to generate story from the AI model.");
  }
}

type CharacterVoice = {
    speaker: string;
    voiceConfig: {
        prebuiltVoiceConfig: {
            voiceName: string;
        };
    };
};

export async function generateSpeech(text: string, narratorVoice: string, characterVoices?: CharacterVoice[]): Promise<string> {
  if (!text.trim()) {
    return '';
  }
  
  const speechConfig: { [key: string]: any } = {};

  if (characterVoices && characterVoices.length > 0) {
      // Use multi-speaker config for dialogue
      speechConfig.multiSpeakerVoiceConfig = {
          speakerVoiceConfigs: characterVoices
      };
  } else {
      // Use single voice config for narration
      speechConfig.voiceConfig = {
          prebuiltVoiceConfig: { voiceName: narratorVoice },
      };
  }

  try {
    const response = await ai.models.generateContent({
      model: ttsModel,
      contents: [{ parts: [{ text: `TTS the following: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: speechConfig,
      },
    });
    
    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (base64Audio) {
      return base64Audio;
    } else {
      // It's possible for a part to generate no audio (e.g., if it's just whitespace)
      console.warn("No audio data received from API for text part:", text);
      return '';
    }
  } catch (error) {
    console.error("Error generating speech for text:", text, error);
    throw new Error("Failed to generate audio from the AI model.");
  }
}