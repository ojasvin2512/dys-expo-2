
import { GoogleGenAI, Chat, Part } from "@google/genai";
import { GEMINI_TEXT_MODEL, GEMINI_TEXT_MODEL_FALLBACKS, GEMINI_IMAGE_MODEL, GEMINI_IMAGE_MODEL_FALLBACKS, IMAGE_PROMPT_PREFIX, LANGUAGES } from '../constants';
import type { CustomInstructions, Language, Message, ImageProvider } from "../types";
import { trackGeminiCall, trackOpenRouterCall } from './apiUsageTracker';

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
    private tier1Keys: string[] = [];  // Primary keys
    private tier2Keys: string[] = [];  // Secondary keys
    private currentIndex: number = 0;
    private triedIndices: Set<number> = new Set();
    private blacklistedIndices: Set<number> = new Set(); // permanently exhausted for today

    constructor() {
        this.loadKeys();
    }

    private loadKeys() {
        const tier1RawKeys: string[] = [];
        const tier2RawKeys: string[] = [];
        
        // TIER 1: Primary keys (API_KEY, GEMINI_API_KEY, GEMINI_API_KEY_1, GEMINI_API_KEY_2)
        const mainKey = getEnv('API_KEY');
        if (mainKey) {
            if (mainKey.includes(',')) {
                tier1RawKeys.push(...mainKey.split(',').map(k => k.trim()).filter(Boolean));
            } else {
                tier1RawKeys.push(mainKey.trim());
            }
        }
        
        const geminiKey = getEnv('GEMINI_API_KEY');
        if (geminiKey) {
            if (geminiKey.includes(',')) {
                tier1RawKeys.push(...geminiKey.split(',').map(k => k.trim()).filter(Boolean));
            } else {
                tier1RawKeys.push(geminiKey.trim());
            }
        }
        
        // Add GEMINI_API_KEY_1 and GEMINI_API_KEY_2 to Tier 1
        for (let i = 1; i <= 2; i++) {
            const k = getEnv(`GEMINI_API_KEY_${i}`);
            if (k) tier1RawKeys.push(k.trim());
        }
        
        // TIER 2: Secondary keys (GEMINI_API_KEY_3 through GEMINI_API_KEY_10)
        for (let i = 3; i <= 10; i++) {
            const k = getEnv(`GEMINI_API_KEY_${i}`);
            if (k) tier2RawKeys.push(k.trim());
        }

        // Remove duplicates within each tier
        this.tier1Keys = Array.from(new Set(tier1RawKeys));
        this.tier2Keys = Array.from(new Set(tier2RawKeys));
        
        // Combine tiers: Tier 1 first, then Tier 2
        this.keys = [...this.tier1Keys, ...this.tier2Keys];
        
        if (this.keys.length === 0) {
            this.keys = ['missing-api-key'];
            this.tier1Keys = ['missing-api-key'];
        }
        
        console.log(`[KeyManager] Loaded ${this.keys.length} API key(s):`);
        console.log(`  [TIER 1] ${this.tier1Keys.length} primary key(s): ${this.tier1Keys.map((k, i) => `[${i+1}] ...${k.slice(-6)}`).join(', ')}`);
        console.log(`  [TIER 2] ${this.tier2Keys.length} secondary key(s): ${this.tier2Keys.map((k, i) => `[${i+1}] ...${k.slice(-6)}`).join(', ')}`);
        
        this.triedIndices.add(this.currentIndex);
    }

    getCurrentKey(): string {
        return this.keys[this.currentIndex];
    }
    
    getCurrentTier(): number {
        return this.currentIndex < this.tier1Keys.length ? 1 : 2;
    }

    // Call this when a key hits daily quota (limit: 0) — permanently skip it
    blacklist() {
        const tier = this.getCurrentTier();
        this.blacklistedIndices.add(this.currentIndex);
        console.warn(`[KeyManager] Tier ${tier} key ${this.currentIndex + 1}/${this.keys.length} blacklisted.`);
    }

    rotate(): boolean {
        if (this.keys.length <= 1) return false;
        
        // Find next non-blacklisted, non-tried key
        for (let i = 1; i < this.keys.length; i++) {
            const nextIndex = (this.currentIndex + i) % this.keys.length;
            if (!this.blacklistedIndices.has(nextIndex) && !this.triedIndices.has(nextIndex)) {
                const oldTier = this.getCurrentTier();
                this.currentIndex = nextIndex;
                const newTier = this.getCurrentTier();
                this.triedIndices.add(this.currentIndex);
                
                if (newTier !== oldTier) {
                    console.warn(`[KeyManager] Switching from Tier ${oldTier} to Tier ${newTier} - API key ${this.currentIndex + 1}/${this.keys.length}...`);
                } else {
                    console.warn(`[KeyManager] Switching to Tier ${newTier} API key ${this.currentIndex + 1}/${this.keys.length}...`);
                }
                
                ai = getAI();
                return true;
            }
        }
        // All keys tried or blacklisted — stop immediately
        console.warn(`[KeyManager] All API keys exhausted (${this.tier1Keys.length} Tier 1 + ${this.tier2Keys.length} Tier 2)`);
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

// Load all OpenRouter keys and rotate when one is exhausted
const openRouterKeys: string[] = (() => {
    const keys: string[] = [];
    const main = getEnv('OPENROUTER_API_KEY');
    if (main) keys.push(main);
    for (let i = 2; i <= 10; i++) {
        const k = getEnv(`OPENROUTER_API_KEY_${i}`);
        if (k) keys.push(k);
    }
    console.log(`[OpenRouter] Loaded ${keys.length} API key(s)`);
    return keys;
})();

let openRouterKeyIndex = 0;
const openRouterExhaustedKeys = new Set<number>(); // keys with 402
let openRouterLastFailTime = 0;

function getOpenRouterKey(): string | undefined {
    return openRouterKeys[openRouterKeyIndex];
}

function rotateOpenRouterKey(): boolean {
    for (let i = 1; i < openRouterKeys.length; i++) {
        const next = (openRouterKeyIndex + i) % openRouterKeys.length;
        if (!openRouterExhaustedKeys.has(next)) {
            openRouterKeyIndex = next;
            console.warn(`[OpenRouter] Switching to key ${openRouterKeyIndex + 1}/${openRouterKeys.length}`);
            return true;
        }
    }
    return false;
}

// Free models to try in order (verified April 2026 from openrouter.ai/collections/free-models)
const OPENROUTER_MODELS = [
    'google/gemma-4-31b-it:free',                    // Gemma 4 31B — best instruction following
    'google/gemma-4-26b-a4b-it:free',                // Gemma 4 26B MoE — fast & capable
    'arcee-ai/trinity-large-preview:free',           // Arcee Trinity Large 400B MoE
    'nvidia/nemotron-3-super-120b-a12b:free',        // NVIDIA Nemotron Super 120B
    'openai/gpt-oss-120b:free',                      // OpenAI OSS 120B
    'openai/gpt-oss-20b:free',                       // OpenAI OSS 20B — faster
    'minimax/minimax-m2.5:free',                     // MiniMax M2.5
    'meta-llama/llama-3.3-70b-instruct:free',        // Llama 3.3 70B
    'qwen/qwen3-next-80b-a3b-instruct:free',         // Qwen3 Next 80B
    'nvidia/nemotron-3-nano-30b-a3b:free',           // NVIDIA Nemotron Nano 30B — fast fallback
];

async function sendViaOpenRouter(systemPrompt: string, userMessage: string, messageHistory: Array<{role: string, content: string}> = []): Promise<string> {
    const key = getOpenRouterKey();
    if (!key) throw new Error('OpenRouter not available');
    if (openRouterExhaustedKeys.size >= openRouterKeys.length) throw new Error('OpenRouter credits exhausted');

    // If all models were rate-limited recently, wait 60s before retrying
    const timeSinceLastFail = Date.now() - openRouterLastFailTime;
    if (openRouterLastFailTime > 0 && timeSinceLastFail < 60000) {
        throw new Error(`OpenRouter rate limited — retry in ${Math.ceil((60000 - timeSinceLastFail) / 1000)}s`);
    }

    // Build messages array: system + history + current user message
    const messages = [
        { role: 'system', content: systemPrompt },
        ...messageHistory,
        { role: 'user', content: userMessage },
    ];

    let allRateLimited = true;
    for (const model of OPENROUTER_MODELS) {
        try {
            const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getOpenRouterKey()}`,
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://dyslearn.app',
                    'X-Title': 'DysLearn AI',
                },
                body: JSON.stringify({
                    model,
                    messages,
                    max_tokens: 2048,
                    temperature: 0.5,
                })
            });

            if (!response.ok) {
                if (response.status === 402) {
                    // This key is out of credits — blacklist and try next key
                    console.warn(`[OpenRouter] Key ${openRouterKeyIndex + 1} credits exhausted, rotating...`);
                    openRouterExhaustedKeys.add(openRouterKeyIndex);
                    if (rotateOpenRouterKey()) {
                        return await sendViaOpenRouter(systemPrompt, userMessage, messageHistory);
                    }
                    throw new Error('OpenRouter credits exhausted');
                }
                if (response.status === 429) {
                    console.warn(`OpenRouter model ${model} rate limited (429), trying next...`);
                    continue;
                }
                allRateLimited = false;
                console.warn(`OpenRouter model ${model} failed (${response.status}), trying next...`);
                continue;
            }

            allRateLimited = false;
            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (content) {
                openRouterLastFailTime = 0;
                trackOpenRouterCall(); // Track successful call
                console.log(`✅ OpenRouter responded via ${model} (key ${openRouterKeyIndex + 1})`);
                return content;
            }
        } catch (err: any) {
            if (err.message === 'OpenRouter credits exhausted') throw err;
            console.warn(`OpenRouter model ${model} error:`, err.message);
            continue;
        }
    }

    if (allRateLimited) {
        openRouterLastFailTime = Date.now();
        throw new Error('All OpenRouter models rate limited — will retry after 60s');
    }
    throw new Error('All OpenRouter models failed');
}

export function isOpenRouterAvailable(): boolean {
    if (openRouterKeys.length === 0) return false;
    if (openRouterExhaustedKeys.size >= openRouterKeys.length) return false;
    // Allow retry after 60s cooldown
    if (openRouterLastFailTime > 0 && Date.now() - openRouterLastFailTime < 60000) return false;
    return true;
}
// ─────────────────────────────────────────────────────────────────────────────

function isQuotaError(err: unknown): boolean {
    const raw = JSON.stringify(err ?? '');
    const code = (err as any)?.code ?? (err as any)?.status ?? (err as any)?.error?.code;
    // 429 = rate limit / quota exceeded; also treat invalid/forbidden keys as rotatable
    return code === 429 || code === 401 || code === 403 ||
           /429|RESOURCE_EXHAUSTED|quota exceeded|API_KEY_INVALID|invalid api key|unauthorized|forbidden/i.test(raw);
}

function isInvalidKeyError(err: unknown): boolean {
    const raw = JSON.stringify(err ?? '');
    const code = (err as any)?.code ?? (err as any)?.status ?? (err as any)?.error?.code;
    return code === 401 || code === 403 ||
           /API_KEY_INVALID|invalid api key|unauthorized|forbidden/i.test(raw);
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
        const result = await fn();
        trackGeminiCall(); // Track successful call
        return result;
    } catch (err) {
        if (!isQuotaError(err)) throw err;

        const keyIdx = (keyManager as any).currentIndex;
        const keyTotal = (keyManager as any).keys.length;
        const keyLabel = `key ${keyIdx + 1}/${keyTotal}`;

        // If key is invalid/forbidden (401/403), blacklist and rotate immediately
        if (isInvalidKeyError(err)) {
            console.warn(`[KeyManager] ${keyLabel} is invalid or forbidden, blacklisting.`);
            keyManager.blacklist();
            if (keyManager.rotate()) {
                return await withQuotaRetry(fn);
            }
            throw new Error('QUOTA_EXHAUSTED');
        }

        // If daily quota exhausted (limit=0), blacklist this key permanently
        if (isZeroQuota(err)) {
            console.warn(`[KeyManager] ${keyLabel} daily quota exhausted, blacklisting.`);
            keyManager.blacklist();
            if (keyManager.rotate()) {
                return await withQuotaRetry(fn);
            }
            throw new Error('QUOTA_EXHAUSTED');
        }

        // Rate limited (per-minute 429) — try rotating
        console.warn(`[KeyManager] ${keyLabel} hit rate limit, rotating.`);
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

## HOW TO RESPOND — ALWAYS USE THIS EXACT FORMAT (no step labels, just the content):

Start with a warm encouraging sentence and briefly restate what the user is asking. Example: "That's a great question! It looks like you're asking about bones."

Then give a short clear explanation in 1-3 sentences using simple words, like talking to a 10-year-old.

Then list 3-5 key facts in bold like this:
**They give your body shape:** Without bones, you'd be a floppy blob!
**They help you stand tall:** Bones are strong enough to hold you up.
**They protect your insides:** Your skull protects your brain, and your ribs protect your heart and lungs.

Then end with one encouraging closing sentence summarising the topic.

Then on its own line, add a Visual Aid tag for EVERY educational concept, science topic, or animal:
Visual Aid: [Short Topic Name]
Example: Visual Aid: [human skeleton]

Then at the very end, add source links in this EXACT format (replace TOPIC with the actual search topic, use + for spaces):
[SOURCES::Google Images::https://www.google.com/search?q=TOPIC&tbm=isch::🔍||YouTube::https://www.youtube.com/results?search_query=TOPIC::📺||Britannica::https://www.britannica.com/search?query=TOPIC::📖||Wikimedia::https://commons.wikimedia.org/w/index.php?search=TOPIC::🖼️]

Example for "bones":
[SOURCES::Google Images::https://www.google.com/search?q=human+bones&tbm=isch::🔍||YouTube::https://www.youtube.com/results?search_query=human+bones::📺||Britannica::https://www.britannica.com/search?query=bones::📖||Wikimedia::https://commons.wikimedia.org/w/index.php?search=human+bones::🖼️]

IMPORTANT: Do NOT output any step numbers or step labels like "Step 1", "Step 2", "Step 3" etc. Just output the content directly in the order shown above.

---

Your core functions are:
1.  **Simplify Text**: If a user provides a block of text, rewrite it using simple words, short sentences, and small paragraphs. Maintain the original meaning.
2.  **Explain Concepts**: Always use the response format above. Keep language simple and friendly.
3.  **Analyze Attachments**: If a user uploads an image, text file, or PDF, analyze the content and answer their question using the same format.
4.  **Generate Images**: If a user explicitly asks to create an image or says "/image", respond with: ${IMAGE_PROMPT_PREFIX}A simple, clear, and colorful illustration of [description]. Do NOT use backticks.
5.  **Conversational Help**: For casual chat or non-educational questions, be warm and supportive. You don't need the full format for simple greetings or short answers.

Always be encouraging and positive.
`;

export { sendStreamWithFallback };
export { sendViaOpenRouter };
export { baseSystemInstruction };

/**
 * Transcribe audio using Gemini's multimodal capabilities with retry logic
 * Supports multiple languages including Indian languages (Hindi, Bengali, Tamil)
 */
export async function transcribeAudio(audioBase64: string, mimeType: string = 'audio/webm', language: string = 'en'): Promise<string> {
    const startTime = performance.now();
    
    // Map language codes to full language names for better Gemini understanding
    const languageNames: Record<string, string> = {
        'hi': 'Hindi',
        'bn': 'Bengali', 
        'ta': 'Tamil',
        'es': 'Spanish',
        'fr': 'French',
        'de': 'German',
        'it': 'Italian',
        'en': 'English'
    };
    
    const languageName = languageNames[language] || 'English';
    
    // Universal prompt that works well with all languages including Indian languages
    // Gemini understands language names better than language-specific instructions
    const transcriptionPrompt = `Listen to this audio and transcribe exactly what is spoken in ${languageName}. Output only the spoken words, nothing else.`;
    
    // Retry logic for 503 errors (service temporarily unavailable)
    const maxRetries = 2;
    let lastError: any = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
        try {
            // Add exponential backoff delay for retries
            if (attempt > 0) {
                const delayMs = Math.min(1000 * Math.pow(2, attempt - 1), 3000); // 1s, 2s max
                console.log(`⏳ Retry ${attempt}/${maxRetries} after ${delayMs}ms delay...`);
                await new Promise(resolve => setTimeout(resolve, delayMs));
            }
            
            // Use the same models as regular chat (these are confirmed working)
            const response = await tryWithModelFallback<any>(
                'transcribeAudio',
                GEMINI_TEXT_MODEL_FALLBACKS,  // Use same models as chat
                model => ai.models.generateContent({
                    model,
                    contents: {
                        parts: [
                            {
                                // Universal prompt that works for all languages
                                text: transcriptionPrompt,
                            },
                            {
                                inlineData: {
                                    data: audioBase64,
                                    mimeType: mimeType,
                                }
                            }
                        ],
                    },
                    config: {
                        temperature: 0.1,
                        maxOutputTokens: 512,  // Increased for Indian languages (may need more tokens)
                    }
                })
            );
            
            let transcription = (response.text || '').trim();
            
            // Clean up transcription (language-agnostic)
            // Remove common prefixes in multiple languages
            transcription = transcription
                .replace(/^(Transcription:|Transcript:|Audio:|Text:|The audio says:|Spoken words:|Output:)\s*/i, '')
                .replace(/^(ट्रांसक्रिप्शन:|ट्रान्सक्रिप्ट:|ऑडियो:|टेक्स्ट:)\s*/i, '')  // Hindi
                .replace(/^(ট্রান্সক্রিপশন:|ট্রান্সক্রিপ্ট:|অডিও:|টেক্সট:)\s*/i, '')  // Bengali
                .replace(/^(படியெடுத்தல்:|படியெடுப்பு:|ஆடியோ:|உரை:)\s*/i, '')  // Tamil
                .replace(/\*\*/g, '')
                .replace(/^["'`]|["'`]$/g, '')
                .trim();
            
            const endTime = performance.now();
            const processingTime = ((endTime - startTime) / 1000).toFixed(2);
            console.log(`⚡ Gemini transcription (${languageName}): ${processingTime}s (attempt ${attempt + 1})`);
            console.log(`📝 Transcribed text: "${transcription.substring(0, 50)}${transcription.length > 50 ? '...' : ''}"`);
            
            if (!transcription || transcription.length < 1) {
                // Language-specific error messages
                const errorMessages: Record<string, string> = {
                    'hi': 'मुझे वह स्पष्ट रूप से सुनाई नहीं दिया। कृपया ज़ोर से या माइक्रोफ़ोन के पास बोलें।',
                    'bn': 'আমি এটি স্পষ্টভাবে শুনতে পাইনি। দয়া করে জোরে বা মাইক্রোফোনের কাছে বলুন।',
                    'ta': 'எனக்கு அது தெளிவாகக் கேட்கவில்லை. தயவுசெய்து சத்தமாக அல்லது மைக்ரோஃபோனுக்கு அருகில் பேசுங்கள்.',
                    'en': "I couldn't hear that clearly. Please try speaking louder or closer to the microphone."
                };
                return errorMessages[language] || errorMessages['en'];
            }
            
            return transcription;
        } catch (error) {
            lastError = error;
            const errorMsg = error instanceof Error ? error.message : String(error);
            
            // If it's a 503 error and we have retries left, continue
            if ((errorMsg.includes('503') || errorMsg.includes('unavailable') || errorMsg.includes('high demand')) && attempt < maxRetries) {
                console.warn(`⚠️ Service unavailable (503), will retry... (${attempt + 1}/${maxRetries})`);
                continue;
            }
            
            // If it's not a retryable error, or we're out of retries, break
            break;
        }
    }
    
    // All retries exhausted
    const endTime = performance.now();
    const processingTime = ((endTime - startTime) / 1000).toFixed(2);
    console.error(`❌ Transcription failed after ${processingTime}s:`, lastError);
    
    // Check if it's a quota error
    if (lastError instanceof Error && (lastError.message.includes('QUOTA_EXHAUSTED') || lastError.message.includes('quota'))) {
        throw new Error("API quota exhausted. Please try again later.");
    }
    
    // Check if it's a rate limit error
    if (lastError instanceof Error && (lastError.message.includes('503') || lastError.message.includes('high demand') || lastError.message.includes('unavailable'))) {
        throw new Error("Service temporarily busy. Please wait a moment and try again.");
    }
    
    throw new Error("Failed to transcribe audio. Please try again.");
}

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
    const titleInstruction = `Generate a very short, concise title (4-5 words max) for the following conversation. Just return the title itself, with no "Title:" prefix or quotes.\n\n---\n${prompt}`;
    try {
        const response = await tryWithModelFallback<any>(
            'generateChatTitle',
            GEMINI_TEXT_MODEL_FALLBACKS,
            model => ai.models.generateContent({
                model,
                contents: titleInstruction,
                config: { stopSequences: ["\n"], temperature: 0.2 }
            })
        );
        const title = (response.text || '').trim().replace(/"/g, '');
        return title || "New Chat";
    } catch (error) {
        // Gemini exhausted — try OpenRouter for title generation
        if (isOpenRouterAvailable()) {
            try {
                const orTitle = await sendViaOpenRouter(
                    'You generate very short chat titles. Reply with only the title, 4-5 words max, no quotes, no prefix.',
                    titleInstruction
                );
                const title = orTitle.trim().replace(/"/g, '').split('\n')[0];
                return title || "New Chat";
            } catch (orErr) {
                console.error("OpenRouter title generation failed:", orErr);
            }
        }
        return "New Chat";
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
