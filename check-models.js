// Check what models are available for a Gemini API key
import dotenv from 'dotenv';
dotenv.config();

const key = process.env.GEMINI_API_KEY;

async function listModels() {
  try {
    console.log(`Testing key: ...${key.slice(-6)}\n`);
    
    // Try v1 endpoint
    console.log('Trying v1 endpoint...');
    const v1Response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${key}`
    );
    const v1Data = await v1Response.json();
    
    if (v1Response.ok) {
      console.log('✅ v1 endpoint accessible');
      console.log('Available models:');
      v1Data.models?.forEach(m => {
        console.log(`  - ${m.name} (${m.displayName})`);
      });
    } else {
      console.log(`❌ v1 endpoint failed: ${v1Response.status}`);
      console.log(JSON.stringify(v1Data, null, 2));
    }
    
    console.log('\n---\n');
    
    // Try v1beta endpoint
    console.log('Trying v1beta endpoint...');
    const v1betaResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`
    );
    const v1betaData = await v1betaResponse.json();
    
    if (v1betaResponse.ok) {
      console.log('✅ v1beta endpoint accessible');
      console.log('Available models:');
      v1betaData.models?.forEach(m => {
        console.log(`  - ${m.name} (${m.displayName})`);
      });
    } else {
      console.log(`❌ v1beta endpoint failed: ${v1betaResponse.status}`);
      console.log(JSON.stringify(v1betaData, null, 2));
    }
    
  } catch (err) {
    console.error('Error:', err.message);
  }
}

listModels();
