
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_TEXT_MODEL_FALLBACKS, GEMINI_IMAGE_MODEL, GEMINI_IMAGE_MODEL_FALLBACKS, IMAGE_PROMPT_PREFIX, LANGUAGES } from '../constants';
import type { CustomInstructions, Language, Message, ImageProvider } from "../types";

const getEnv = (key: string): string | undefined => {
    // 1. Try Vite's import.meta.env
    try {
        const viteEnv = (import.meta as any)?.env;
        const viteVal = viteEnv?.[key] ?? viteEnv?.[`VITE_${key}`];
        if (typeof viteVal === 'string' && viteVal.trim()) return viteVal;
    } catch (e) {}

    // 2. Try process.env (Node or Vite-defined)
    try {
        const processEnv = (globalThis as any).process?.env;
        const nodeVal = processEnv?.[key] ?? processEnv?.[`VITE_${key}`];
        if (typeof nodeVal === 'string' && nodeVal.trim()) return nodeVal;
    } catch (e) {}
    
    return undefined;
};

// Forward declaration of ai to avoid scoping issues in KeyManager
let ai: any;

class KeyManager {
    private keys: string[] = [];
    private currentIndex: number = 0;
    private triedIndices: Set<number> = new Set();
    private blacklistedIndices: Set<number> = new Set(); // permanently exhausted for today

    constructor() {
        this.loadKeys();
    }

    private loadKeys() {
        const rawKeys: string[] = [];
        
        const mainKey = getEnv('GEMINI_API_KEY') || getEnv('API_KEY');
        if (mainKey) {
            if (mainKey.includes(',')) {
                rawKeys.push(...mainKey.split(',').map(k => k.trim()).filter(Boolean));
            } else {
                rawKeys.push(mainKey.trim());
            }
        }

        for (let i = 1; i <= 10; i++) {
            const k = getEnv(`GEMINI_API_KEY_${i}`);
            if (k) rawKeys.push(k.trim());
        }

        this.keys = Array.from(new Set(rawKeys));
        if (this.keys.length === 0) {
            this.keys = ['missing-api-key'];
        }
        console.log(`[KeyManager] Loaded ${this.keys.length} API keys`);
        this.triedIndices.add(this.currentIndex);
    }

    getCurrentKey(): string {
        return this.keys[this.currentIndex];
    }

    // Call this when a key hits daily quota (limit: 0) — permanently skip it
    blacklist() {
        this.blacklistedIndices.add(this.currentIndex);
        console.warn(`[KeyManager] Key ${this.currentIndex + 1}/${this.keys.length} daily quota exhausted, blacklisting.`);
    }

    rotate(): boolean {
        if (this.keys.length <= 1) return false;
        
        // Find next non-blacklisted, non-tried key
        for (let i = 1; i < this.keys.length; i++) {
            const nextIndex = (this.currentIndex + i) % this.keys.length;
            if (!this.blacklistedIndices.has(nextIndex) && !this.triedIndices.has(nextIndex)) {
                this.currentIndex = nextIndex;
                this.triedIndices.add(this.currentIndex);
                console.warn(`[KeyManager] Switching to API key ${this.currentIndex + 1}/${this.keys.length}...`);
                ai = getAI();
                return true;
            }
        }
        // All keys tried or blacklisted — stop immediately
        return false;
    }

    resetCycle() {
        // Only clear tried indices, keep blacklist intact
        this.triedIndices.clear();
        this.triedIndices.add(this.currentIndex);
    }
}

const keyManager = new KeyManager();

function getAI() {
    return new GoogleGenAI({ apiKey: keyManager.getCurrentKey() });
}

// Variable ai is forward-declared above and initialized here
ai = getAI();

// ─── OPENROUTER FALLBACK ──────────────────────────────────────────────────────
// Used automatically when all Gemini keys are exhausted
let openRouterExhausted = false; // only set true on 402 (no credits)
let openRouterLastFailTime = 0;  // track when all models were rate-limited

// Free models to try in order (updated April 2026 — verified from OpenRouter API)
const OPENROUTER_MODELS = [
    'google/gemma-4-31b-it:free',              // Gemma 4 31B — user requested
    'google/gemma-3-27b-it:free',              // Gemma 3 27B
    'google/gemma-3-12b-it:free',              // Gemma 3 12B
    'meta-llama/llama-3.3-70b-instruct:free',  // Llama 3.3 70B
    'nvidia/nemotron-3-super-120b-a12b:free',  // NVIDIA 120B
    'openai/gpt-oss-120b:free',                // OpenAI OSS 120B
    'qwen/qwen3-coder:free',                   // Qwen3 Coder
    'nousresearch/hermes-3-llama-3.1-405b:free', // Hermes 405B
    'meta-llama/llama-3.2-3b-instruct:free',   // Llama 3.2 3B (fast fallback)
    'google/gemma-3-4b-it:free',               // Gemma 3 4B (fast fallback)
];

async function sendViaOpenRouter(systemPrompt: string, userMessage: string): Promise<string> {
    const key = getEnv('OPENROUTER_API_KEY');
    if (!key) throw new Error('OpenRouter not available');
    if (openRouterExhausted) throw new Error('OpenRouter credits exhausted');
    
    // If all models were rate-limited recently, wait 60s before retrying
    const timeSinceLastFail = Date.now() - openRouterLastFailTime;
    if (openRouterLastFailTime > 0 && timeSinceLastFail < 60000) {
        throw new Error(`OpenRouter rate limited — retry in ${Math.ceil((60000 - timeSinceLastFail) / 1000)}s`);
    }

    let allRateLimited = true;
    for (const model of OPENROUTER_MODELS) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${key}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://dyslearn.app',
                    'X-Title': 'DysLearn AI',
                },
                body: JSON.stringify({
                    model,
                    messages: [
                        { role: 'system', content: systemPrompt },
                        { role: 'user', content: userMessage }
                    ],
                    max_tokens: 1024,
                    temperature: 0.7,
                })
            });

            if (!response.ok) {
                if (response.status === 402) { 
                    openRouterExhausted = true; 
                    throw new Error('OpenRouter credits exhausted'); 
                }
                if (response.status === 429) {
                    // Rate limited on this model — try next
                    console.warn(`OpenRouter model ${model} rate limited (429), trying next...`);
                    continue;
                }
                // 404 or other — model unavailable, try next
                allRateLimited = false;
                console.warn(`OpenRouter model ${model} failed (${response.status}), trying next...`);
                continue;
            }

            allRateLimited = false; // at least one model responded
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
                openRouterLastFailTime = 0; // reset on success
                console.log(`✅ OpenRouter responded via ${model}`);
                return content;
            }
        } catch (err: any) {
            if (err.message === 'OpenRouter credits exhausted') throw err;
            console.warn(`OpenRouter model ${model} error:`, err.message);
            continue;
        }
    }

    // If all were 429, record the time so we can retry after 60s
    if (allRateLimited) {
        openRouterLastFailTime = Date.now();
        throw new Error('All OpenRouter models rate limited — will retry after 60s');
    }
    throw new Error('All OpenRouter models failed');
}

export function isOpenRouterAvailable(): boolean {
    if (!getEnv('OPENROUTER_API_KEY')) return false;
    if (openRouterExhausted) return false;
    // Allow retry after 60s cooldown
    if (openRouterLastFailTime > 0 && Date.now() - openRouterLastFailTime < 60000) return false;
    return true;
}
// ─────────────────────────────────────────────────────────────────────────────

function isQuotaError(err: unknown): boolean {
    const raw = JSON.stringify(err ?? '');
    const code = (err as any)?.code ?? (err as any)?.status ?? (err as any)?.error?.code;
    return code === 429 || code === 401 || code === 403 ||
           /429|RESOURCE_EXHAUSTED|quota exceeded|API_KEY_INVALID|invalid api key|unauthorized|forbidden/i.test(raw);
}

function isFallbackableError(err: unknown): boolean {
    const raw = JSON.stringify(err ?? '');
    const code = (err as any)?.code ?? (err as any)?.status ?? (err as any)?.error?.code;
    return code === 404 || code === 400 || code === 503 ||
           /404|NOT_FOUND|not found|INVALID_ARGUMENT|bad request|503|unavailable/i.test(raw);
}

function isZeroQuota(err: unknown): boolean {
    const raw = JSON.stringify(err ?? '');
    return /limit.*?:\s*0\b/i.test(raw) || /"limit"\s*:\s*0\b/i.test(raw);
}

async function withQuotaRetry<T>(fn: () => Promise<T>): Promise<T> {
    try {
        return await fn();
    } catch (err) {
        if (!isQuotaError(err)) throw err;

        // If daily quota exhausted, blacklist this key permanently
        if (isZeroQuota(err)) {
            keyManager.blacklist();
            // Try next key immediately
            if (keyManager.rotate()) {
                return await withQuotaRetry(fn);
            }
            // All keys exhausted — fail fast
            throw new Error('QUOTA_EXHAUSTED');
        }

        // Rate limited (per-minute) — try rotating
        if (keyManager.rotate()) {
            return await withQuotaRetry(fn);
        }

        throw new Error('QUOTA_EXHAUSTED');
    }
}

async function tryWithModelFallback<T>(
    operation: string,
    modelCandidates: string[],
    fn: (model: string) => Promise<T>
): Promise<T> {
    const errors: Error[] = [];
    
    // Reset key cycle when starting a new operation
    keyManager.resetCycle();

    for (const model of modelCandidates.filter(Boolean)) {
        try {
            return await withQuotaRetry(() => fn(model));
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);
            console.warn(`Gemini ${operation} error with model ${model}:`, errorMsg);
            errors.push(err instanceof Error ? err : new Error(errorMsg));

            // If this is a quota or key error, and we haven't tried all keys yet, 
            // withQuotaRetry already attempted rotation. If we are here, it means 
            // all keys failed for this specific model, or it was a non-fallbackable error.
            
            if (!isQuotaError(err) && !isFallbackableError(err)) {
                throw err;
            }

            // If 0 quota or model not found, continue to next candidate.
            console.log(`Model ${model} failed (${errorMsg}), trying next fallback...`);
            continue;
        }
    }

    const combined = errors.map(e => e.message).join(' | ');
    throw new Error(
        `Gemini ${operation} failed on all candidate models and API keys. Details: ${combined}`
    );
}

async function sendStreamWithFallback(
    getChat: (model: string) => Chat,
    getMessage: () => string | Array<{ text?: string; inlineData?: { mimeType: string; data: string } }>,
    modelCandidates: string[]
) {
    const errors: Error[] = [];
    const MAX_KEY_ROTATIONS = 8;
    let rotationCount = 0;
    
    // Reset key cycle
    keyManager.resetCycle();

    for (let i = 0; i < modelCandidates.length; i++) {
        const model = modelCandidates[i];
        if (!model) continue;

        try {
            const chat = getChat(model);
            const message = getMessage();
            const streamPromise = chat.sendMessageStream({ message });
            const timeoutPromise = new Promise<never>((_, reject) =>
                setTimeout(() => reject(new Error('Request timed out after 30s. The API may be overloaded. Please try again.')), 30000)
            );
            return await Promise.race([streamPromise, timeoutPromise]);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : String(err);

            console.warn(`Gemini sendMessageStream error with model ${model} (rotation ${rotationCount}/${MAX_KEY_ROTATIONS}):`, errorMsg.substring(0, 100));
            errors.push(err instanceof Error ? err : new Error(errorMsg));

            if (isQuotaError(err)) {
                // Blacklist this key if daily quota is exhausted
                if (isZeroQuota(err)) {
                    keyManager.blacklist();
                }

                // Try next key if we haven't hit the rotation limit
                if (rotationCount < MAX_KEY_ROTATIONS && keyManager.rotate()) {
                    rotationCount++;
                    i = -1; // restart model loop with new key
                    continue;
                }

                // All rotations exhausted
                throw new Error('QUOTA_EXHAUSTED');
            }

            if (!isQuotaError(err) && !isFallbackableError(err)) {
                throw err;
            }

            continue;
        }
    }

    throw new Error('QUOTA_EXHAUSTED');
}

const baseSystemInstruction = `You are a friendly and patient AI Learning Assistant for students with dyslexia, created by Ojasvin Anand. Your goal is to make information clear, accessible, and engaging.

**Important Identity Rule:** If you are asked who created you, who you are, or about your origins, you must state that you were created by Ojasvin Anand. Do not mention being a large language model or being trained by Google in this context.

Your core functions are:
1.  **Simplify Text**: If a user provides a block of text, rewrite it using simple words, short sentences, and small paragraphs. Maintain the original meaning. Use markdown for formatting if it helps clarity (like lists).
2.  **Explain Concepts**: If a user asks for an explanation of a word or concept, explain it in a simple, relatable way, like you're talking to a 10-year-old. Use analogies if helpful. If the topic would benefit from a video explanation, you can provide a YouTube search link at the end of your response using this format: [SOURCES::YouTube::https://www.youtube.com/results?search_query=TOPIC_NAME::📺]
3.  **Analyze Attachments**: If a user uploads an image, a text file (.txt), or a PDF, their prompt will be about that file. Analyze the content and answer their question. For example, they might ask
    
    CRITICAL: For EVERY educational concept, science topic, or animal you explain, you MUST provide a visual aid prompt at the end of your response using this EXACT format: "Visual Aid: [Short Topic Name]". 
    This allows the system to automatically display a real educational photo or diagram.
    Example: 
    "The heart is a pump. Visual Aid: [human heart]"
    "Lions are big cats. Visual Aid: [lion]"
    
    If the user asks for a picture or says "/image", also provide the same tag.
4.  **Generate Images**: You have the ability to generate images. If a user explicitly asks you to create an image, picture, or drawing, provide a brief encouraging sentence followed by the image command in this format: ${IMAGE_PROMPT_PREFIX}A simple, clear, and colorful illustration of [your description of the image]. Do NOT use backticks around this command. Your description should be detailed enough for an image model. Only generate an image if the user specifically requests one.
5.  **Conversational Help**: For any other questions, be a supportive and encouraging learning partner. Keep your language clear and simple. If appropriate, offer to draw something to explain a concept better.

Always be encouraging and positive.
`;

export { sendStreamWithFallback };
export { sendViaOpenRouter };

export function createChat(customInstructions?: CustomInstructions, language: Language = 'en', messageHistory: Message[] = [], systemPromptOverride?: string, forceModel?: string): Chat {
    let finalSystemInstruction: string;

    if (systemPromptOverride) {
        finalSystemInstruction = systemPromptOverride;
    } else {
        finalSystemInstruction = baseSystemInstruction;
        if (customInstructions && (customInstructions.aboutUser || customInstructions.howToRespond)) {
            finalSystemInstruction += "\n\n--- CUSTOM INSTRUCTIONS ---\n";
            if (customInstructions.aboutUser) {
                finalSystemInstruction += `ABOUT THE USER:\n${customInstructions.aboutUser}\n\n`;
            }
            if (customInstructions.howToRespond) {
                finalSystemInstruction += `HOW TO RESPOND:\n${customInstructions.howToRespond}\n`;
            }
            finalSystemInstruction += "---------------------------\n";
        }
    }

    const langLabel = LANGUAGES.find(l => l.code === language)?.label || 'English';
    const languageInstruction = `\n--- LANGUAGE RULE ---\nIMPORTANT: You MUST write all your responses exclusively in ${langLabel} (${language}). Do not switch languages.`;
    finalSystemInstruction += languageInstruction;

    const historyForAI = messageHistory
      .filter(m => m.id !== 'init') 
      .map(m => {
          const parts: Part[] = [];
          
          if (m.content) {
              parts.push({ text: m.content });
          }
          
          if (m.base64Data && m.mimeType) {
              parts.push({
                  inlineData: {
                      data: m.base64Data,
                      mimeType: m.mimeType
                  }
              });
          }
          
          // If message is somehow empty, add a placeholder to satisfy API requirements
          if (parts.length === 0) {
              parts.push({ text: "..." });
          }

          return {
              role: m.role === 'assistant' ? 'model' : 'user',
              parts,
          };
      });


    const selectedModel = forceModel || GEMINI_TEXT_MODEL_FALLBACKS.find(Boolean) || GEMINI_TEXT_MODEL;
    return ai.chats.create({
        model: selectedModel,
        history: historyForAI,
        config: {
            systemInstruction: finalSystemInstruction,
            temperature: 0.5,
        },
    });
}

export async function generateChatTitle(prompt: string): Promise<string> {
    try {
        const response = await tryWithModelFallback<any>(
            'generateChatTitle',
            GEMINI_TEXT_MODEL_FALLBACKS,
            model => ai.models.generateContent({
                model,
                contents: `Generate a very short, concise title (4-5 words max) for the following conversation. Just return the title itself, with no "Title:" prefix or quotes.\n\n---\n${prompt}`,
                config: {
                    stopSequences: ["\n"],
                    temperature: 0.2,
                }
            })
        );
        const title = (response.text || '').trim().replace(/"/g, '');
        return title || "New Chat";
    } catch (error) {
        console.error("Error generating title:", error);
        return "New Chat"; // Fallback title on error
    }
}



/**
 * Fetches a real educational image from Wikimedia Commons.
 */
export async function fetchRealImage(query: string): Promise<string | null> {
    try {
        const cleanQuery = query.replace(/^(a|an|the|simple|clear|colorful|detailed|educational|beautiful|brief)\s+(illustration|drawing|picture|diagram|image|sketch|graphic|visual|aid|video|lesson|explanation)?\s*(of|for|showing|depicting|about)?\s+/i, '').trim();
        const encodedQuery = encodeURIComponent(cleanQuery);
        
        // Use Wikipedia PageImages API to find the most relevant image
        const url = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages|extracts&format=json&piprop=original&titles=${encodedQuery}&exintro&explaintext&redirects=1&origin=*`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        const pages = data.query?.pages;
        if (pages) {
            const pageId = Object.keys(pages)[0];
            if (pageId !== '-1' && pages[pageId].original?.source) {
                // Use Wikimedia image proxy to avoid hotlink blocking
                const src = pages[pageId].original.source as string;
                // Only return if it's a proper image format
                if (/\.(jpg|jpeg|png|gif|svg|webp)(\?|$)/i.test(src)) {
                    return src;
                }
            }
        }
        
        // Fallback: Search for the title if direct title match fails
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodedQuery}&format=json&origin=*`;
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (searchData.query?.search?.[0]?.title) {
            const topTitle = encodeURIComponent(searchData.query.search[0].title);
            const topUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&format=json&piprop=original&titles=${topTitle}&redirects=1&origin=*`;
            const topResponse = await fetch(topUrl);
            const topData = await topResponse.json();
            const topPages = topData.query?.pages;
            if (topPages) {
                const topPageId = Object.keys(topPages)[0];
                if (topPageId !== '-1' && topPages[topPageId].original?.source) {
                    const src = topPages[topPageId].original.source as string;
                    if (/\.(jpg|jpeg|png|gif|svg|webp)(\?|$)/i.test(src)) {
                        return src;
                    }
                }
            }
        }

        return null;
    } catch (error) {
        console.error("Error fetching real image:", error);
        return null;
    }
}

import { findEducationalAsset } from '../educationalLibrary';

export async function generateImageForText(prompt: string, provider: ImageProvider = 'gemini', forcedModel?: string): Promise<string> {
    try {
        // Step 0: Try to fetch a REAL educational photo (Wikimedia) first
        // This fulfills the user's request for "real images instead of generating/illustrations"
        const realImage = await fetchRealImage(prompt);
        if (realImage) {
            console.log(`Found real image for: "${prompt}" -> ${realImage}`);
            return realImage;
        }

        // Step 0.5: Check the Static Educational Library (SVGs/Illustrations)
        const staticAsset = findEducationalAsset(prompt);
        if (staticAsset) {
            console.log(`Found static educational asset for: "${prompt}" -> ${staticAsset}`);
            return staticAsset;
        }

        if (provider === 'pollinations') {
            const encodedPrompt = encodeURIComponent(prompt);
            const seed = Math.floor(Math.random() * 1000000);
            return `https://image.pollinations.ai/prompt/${encodedPrompt}?seed=${seed}&width=1024&height=1024&nologo=true`;
        }

        // Use the global AI instance which is managed by KeyManager
        const modelCandidates = forcedModel ? [forcedModel] : GEMINI_IMAGE_MODEL_FALLBACKS;
 
        // For gemini-2.5-flash-image, we use generateContent
        const response = await tryWithModelFallback<any>(
            'generateImageForText',
            modelCandidates,
            model => ai.models.generateContent({
                model,
                contents: {
                    parts: [
                        {
                            text: `A clear, simple, educational illustration for a student with dyslexia. Style: clean black lines on a white background, minimal colors, highly readable, school-inspired. Prompt: ${prompt}`,
                        },
                    ],
                },
            }).catch((err: any) => {
                // If it's a quota error, we don't want to wait 10s or 2s here, 
                // just throw it so tryWithModelFallback can move to the next model immediately.
                if (isQuotaError(err)) {
                    throw err; 
                }
                throw err;
            })
        );

        // Find the image part in the response
        const candidate = response.candidates?.[0];
        if (candidate?.content?.parts) {
            for (const part of candidate.content.parts) {
                if (part.inlineData) {
                    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
                }
            }
        }
        
        // If Gemini fails or doesn't return an image, try Pollinations as a final backup
        console.warn("Gemini did not return an image part. Falling back to Pollinations.");
        const encodedPrompt = encodeURIComponent(prompt);
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;

    } catch (error) {
        console.error("Error in generateImageForText:", error);
        // Final fallback to Pollinations if everything else fails
        const encodedPrompt = encodeURIComponent(prompt);
        return `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=1024&nologo=true`;
    }
}
