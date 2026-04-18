import { runExec, getDb } from './databricks.js';

export async function initSchema() {
  const db = await getDb();
  if (!db) return;
  console.log('🔧 Initializing Databricks schema...');
  await runExec(`CREATE TABLE IF NOT EXISTS dyslearn_users (user_id STRING NOT NULL, email STRING, password_hash STRING, theme STRING DEFAULT 'light', background_style STRING DEFAULT 'none', language STRING DEFAULT 'en', voice_uri STRING, custom_instructions_about_user STRING DEFAULT '', custom_instructions_how_to_respond STRING DEFAULT '', notifications_enabled BOOLEAN DEFAULT false, total_points INT DEFAULT 0, skill_vocabulary INT DEFAULT 0, skill_grammar INT DEFAULT 0, skill_spelling INT DEFAULT 0, skill_phonetics INT DEFAULT 0, skill_creativity INT DEFAULT 0, skill_logic INT DEFAULT 0, skill_math INT DEFAULT 0, enable_image_generation BOOLEAN DEFAULT true, enable_daily_time_limit BOOLEAN DEFAULT false, selected_image_provider STRING DEFAULT 'gemini', selected_image_model STRING DEFAULT 'models/gemini-2.0-flash-exp', dyslexia_enabled BOOLEAN DEFAULT false, dyslexia_ruler_enabled BOOLEAN DEFAULT false, dyslexia_hover_speech_enabled BOOLEAN DEFAULT false, dyslexia_font_size DOUBLE DEFAULT 1.0, dyslexia_line_spacing DOUBLE DEFAULT 1.5, dyslexia_letter_spacing DOUBLE DEFAULT 0.0, dyslexia_word_spacing DOUBLE DEFAULT 0.0, dyslexia_speech_rate DOUBLE DEFAULT 1.0, dino_highscore INT DEFAULT 0, flappy_highscore INT DEFAULT 0, tetris_highscore INT DEFAULT 0) USING DELTA`);
  await runExec(`CREATE TABLE IF NOT EXISTS dyslearn_chats (session_id STRING NOT NULL, user_id STRING NOT NULL, title STRING DEFAULT 'New Chat', challenge_id STRING, challenge_system_prompt STRING, created_at BIGINT DEFAULT 0) USING DELTA`);
  await runExec(`CREATE TABLE IF NOT EXISTS dyslearn_messages (message_id STRING NOT NULL, session_id STRING NOT NULL, user_id STRING NOT NULL, role STRING NOT NULL, content STRING, image_url STRING, base64_data STRING, mime_type STRING, attachment_name STRING, attachment_type STRING, is_loading BOOLEAN DEFAULT false, created_at BIGINT DEFAULT 0) USING DELTA`);
  await runExec(`CREATE TABLE IF NOT EXISTS dyslearn_progress (user_id STRING NOT NULL, date_str STRING NOT NULL, points_earned INT DEFAULT 0, games_played INT DEFAULT 0, minutes_played INT DEFAULT 0) USING DELTA`);
  console.log('✅ Databricks schema ready');
}
