import { GoogleGenerativeAI } from '@google/generative-ai';
import { Theme } from '../types';
import { getStateById } from '../data/states';
import { validatePromptIsNameFree } from './validation.service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });

export async function generateImagePrompt(stateId: string, theme: Theme): Promise<string> {
  const state = getStateById(stateId);
  if (!state) throw new Error(`Unknown state: ${stateId}`);
  const themeLabels: Record<Theme, string> = {
    spirit: 'Spirit & Culture',
    food: 'Food & Cuisine',
    festival: 'Festival & Ritual',
    nature: 'Nature & Landscape',
    architecture: 'Architecture & Craft',
  };
  const systemPrompt = `You are building a cultural image challenge where the state identity must be completely hidden. The viewer must not know which state this is.
State: ${state.name} | Capital: ${state.capital} | Theme: ${themeLabels[theme]}

Generate a rich Imagen 3 image prompt that captures the ${themeLabels[theme]} of ${state.name} with visual authenticity.

ABSOLUTE RULES:
1. Do not write "${state.name}" or any variation of it
2. Do not write "${state.capital}" or any variation
3. Do not include any text overlay in the image
4. Do not use the demonym (e.g. "${state.demonym}")
5. Do not name any landmark uniquely tied to this state by its official name
6. Do not write "${state.language}" (the language name)

Instead describe: specific color palette, cultural objects, human activities, landscape textures, lighting, atmosphere, composition.
Make it visually rich enough to capture the soul of the state without revealing its name.

Output: ONLY the image prompt, 150-200 words, no preamble.`;
  const result = await model.generateContent(systemPrompt);
  return result.response.text().trim();
}

export async function generateClues(stateId: string, theme: Theme): Promise<string[]> {
  const state = getStateById(stateId);
  if (!state) throw new Error(`Unknown state: ${stateId}`);
  const themeLabels: Record<Theme, string> = {
    spirit: 'Spirit & Culture',
    food: 'Food & Cuisine',
    festival: 'Festival & Ritual',
    nature: 'Nature & Landscape',
    architecture: 'Architecture & Craft',
  };
  const prompt = `State: ${state.name} | Theme: ${themeLabels[theme]}

Generate 3 progressive clues for a cultural guessing game about this state.

Rules: No state name ("${state.name}"), capital ("${state.capital}"), demonym ("${state.demonym}"), language name ("${state.language}"), or identifying proper noun.

Clue 1 (sensory/atmospheric): A feeling, a smell, a color palette — not a fact
Clue 2 (cultural): A tradition, food, or craft WITHOUT naming it by state
Clue 3 (geographic/historic): A landscape or architectural style clue

Output JSON only: ["clue1", "clue2", "clue3"]`;
  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();
  const jsonMatch = text.match(/\[.*\]/s);
  if (!jsonMatch) throw new Error('Could not parse clues JSON');
  return JSON.parse(jsonMatch[0]);
}

export async function generateShareCaption(stateId: string): Promise<string> {
  const state = getStateById(stateId);
  if (!state) throw new Error(`Unknown state: ${stateId}`);
  const prompt = `State: ${state.name}

Write a 2-sentence social media post for a cultural image challenge about this state.
Rule: Do not use the state name "${state.name}", capital "${state.capital}", demonym "${state.demonym}", or language "${state.language}".
Make it intriguing. End with: "Can you guess which state? 🔍 [link]"
Output: Only the 2 sentences. No quotes.`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateCulturalFact(stateId: string): Promise<string> {
  const state = getStateById(stateId);
  if (!state) throw new Error(`Unknown state: ${stateId}`);
  const prompt = `Write 2 fascinating sentences about the culture, history, or heritage of ${state.name}, India. Make it educational and compelling. No bullet points.`;
  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateWithValidation(
  stateId: string,
  theme: Theme,
  attempts: number = 0
): Promise<{ prompt: string; attempts: number }> {
  if (attempts >= 3) {
    // Fallback: generate a safe generic prompt
    const state = getStateById(stateId)!;
    const themeMap: Record<Theme, string> = {
      spirit: 'traditional customs, vibrant ceremonies, and cultural celebrations',
      food: 'aromatic spices, colorful dishes, and traditional culinary preparations',
      festival: 'lanterns, flowers, and joyful community gatherings',
      nature: 'lush landscapes, mountains, and pristine natural scenery',
      architecture: 'ancient stone temples, ornate carvings, and historical monuments',
    };
    return {
      prompt: `A photorealistic scene capturing ${themeMap[theme]} in a style reminiscent of the ${state.region} region of India. Rich natural lighting, intricate cultural details, warm and authentic atmosphere. 8K, documentary photography style.`,
      attempts,
    };
  }
  const prompt = await generateImagePrompt(stateId, theme);
  const validation = validatePromptIsNameFree(prompt, stateId);
  if (!validation.isValid) {
    console.log(`Validation failed (attempt ${attempts + 1}), found: ${validation.foundTerms.join(', ')}`);
    return generateWithValidation(stateId, theme, attempts + 1);
  }
  return { prompt, attempts: attempts + 1 };
}
