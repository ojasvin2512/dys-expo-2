// API Key Tester - Check which Gemini and OpenRouter keys are working
import dotenv from 'dotenv';
dotenv.config();

const GEMINI_KEYS = [
  { name: 'GEMINI_API_KEY', key: process.env.GEMINI_API_KEY },
  { name: 'GEMINI_API_KEY_1', key: process.env.GEMINI_API_KEY_1 },
  { name: 'GEMINI_API_KEY_2', key: process.env.GEMINI_API_KEY_2 },
  { name: 'GEMINI_API_KEY_3', key: process.env.GEMINI_API_KEY_3 },
  { name: 'GEMINI_API_KEY_4', key: process.env.GEMINI_API_KEY_4 },
  { name: 'GEMINI_API_KEY_5', key: process.env.GEMINI_API_KEY_5 },
  { name: 'GEMINI_API_KEY_6', key: process.env.GEMINI_API_KEY_6 },
  { name: 'GEMINI_API_KEY_7', key: process.env.GEMINI_API_KEY_7 },
  { name: 'GEMINI_API_KEY_8', key: process.env.GEMINI_API_KEY_8 },
].filter(k => k.key);

const OPENROUTER_KEYS = [
  { name: 'OPENROUTER_API_KEY', key: process.env.OPENROUTER_API_KEY },
  { name: 'OPENROUTER_API_KEY_2', key: process.env.OPENROUTER_API_KEY_2 },
  { name: 'OPENROUTER_API_KEY_3', key: process.env.OPENROUTER_API_KEY_3 },
  { name: 'OPENROUTER_API_KEY_4', key: process.env.OPENROUTER_API_KEY_4 },
].filter(k => k.key);

async function testGeminiKey(name, key) {
  // Try multiple models in order of preference (updated for 2026 API)
  const models = [
    { name: 'gemini-2.5-flash', endpoint: 'v1' },
    { name: 'gemini-2.5-pro', endpoint: 'v1' },
    { name: 'gemini-2.0-flash', endpoint: 'v1' },
    { name: 'gemini-2.0-flash-001', endpoint: 'v1' },
    { name: 'gemini-2.0-flash-lite', endpoint: 'v1' },
  ];

  let lastError = null;
  let workingModel = null;
  const errors = [];

  for (const { name: model, endpoint } of models) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/${endpoint}/models/${model}:generateContent?key=${key}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: 'Hi' }] }]
          })
        }
      );

      const data = await response.json();

      if (response.ok) {
        workingModel = model;
        return { name, status: '✅ WORKING', key: `...${key.slice(-6)}`, model: `${model}` };
      } else if (response.status === 429) {
        errors.push(`${model}: 429 quota`);
        lastError = { status: '⚠️ QUOTA EXCEEDED', error: data.error?.message };
        continue; // Try next model
      } else if (response.status === 401 || response.status === 403) {
        return { name, status: '❌ INVALID/EXPIRED', key: `...${key.slice(-6)}`, error: data.error?.message };
      } else if (response.status === 404) {
        errors.push(`${model}: 404`);
        continue;
      } else {
        errors.push(`${model}: ${response.status}`);
        lastError = { status: `❌ ERROR (${response.status})`, error: data.error?.message };
        continue;
      }
    } catch (err) {
      errors.push(`${model}: ${err.message}`);
      lastError = { status: '❌ NETWORK ERROR', error: err.message };
      continue;
    }
  }

  // If we get here, all models failed
  return { 
    name, 
    status: lastError?.status || '❌ ALL MODELS FAILED', 
    key: `...${key.slice(-6)}`, 
    error: errors.join(' | ')
  };
}

async function testOpenRouterKey(name, key) {
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://dyslearn.app',
        'X-Title': 'DysLearn AI Key Test',
      },
      body: JSON.stringify({
        model: 'google/gemma-4-31b-it:free',
        messages: [{ role: 'user', content: 'Hi' }],
        max_tokens: 10,
      })
    });

    const data = await response.json();

    if (response.ok) {
      return { name, status: '✅ WORKING', key: `...${key.slice(-6)}` };
    } else if (response.status === 402) {
      return { name, status: '⚠️ NO CREDITS', key: `...${key.slice(-6)}`, error: data.error?.message };
    } else if (response.status === 429) {
      return { name, status: '⚠️ RATE LIMITED', key: `...${key.slice(-6)}`, error: data.error?.message };
    } else if (response.status === 401 || response.status === 403) {
      return { name, status: '❌ INVALID/EXPIRED', key: `...${key.slice(-6)}`, error: data.error?.message };
    } else {
      return { name, status: `❌ ERROR (${response.status})`, key: `...${key.slice(-6)}`, error: data.error?.message };
    }
  } catch (err) {
    return { name, status: '❌ NETWORK ERROR', key: `...${key.slice(-6)}`, error: err.message };
  }
}

async function main() {
  console.log('\n🔍 Testing API Keys...\n');
  console.log('═'.repeat(80));
  console.log('GEMINI API KEYS');
  console.log('═'.repeat(80));

  for (const { name, key } of GEMINI_KEYS) {
    const result = await testGeminiKey(name, key);
    const modelInfo = result.model ? ` (${result.model})` : '';
    console.log(`${result.status.padEnd(20)} ${result.name.padEnd(25)} ${result.key}${modelInfo}`);
    if (result.error) console.log(`   └─ ${result.error}`);
  }

  console.log('\n' + '═'.repeat(80));
  console.log('OPENROUTER API KEYS');
  console.log('═'.repeat(80));

  for (const { name, key } of OPENROUTER_KEYS) {
    const result = await testOpenRouterKey(name, key);
    console.log(`${result.status.padEnd(20)} ${result.name.padEnd(25)} ${result.key}`);
    if (result.error) console.log(`   └─ ${result.error}`);
  }

  console.log('\n' + '═'.repeat(80));
  console.log('SUMMARY');
  console.log('═'.repeat(80));
  console.log('✅ WORKING        - Key is valid and has quota available');
  console.log('⚠️ QUOTA EXCEEDED - Key is valid but daily limit reached (resets at midnight PT)');
  console.log('⚠️ RATE LIMITED   - Key is valid but hit per-minute limit (wait 60s)');
  console.log('⚠️ NO CREDITS     - OpenRouter account has no credits left');
  console.log('❌ INVALID/EXPIRED - Key is not valid or has been revoked');
  console.log('═'.repeat(80) + '\n');
}

main();
