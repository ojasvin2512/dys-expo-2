import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import { getDb, runQuery, runExec, isConnected } from '../db/databricks';
import { initSchema } from '../db/schema';
dotenv.config();
import dotenv from 'dotenv';
import { getDb, runQuery, runExec, isConnected } from '../db/databricks';
import { initSchema } from '../db/schema';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

type ApiResponse<T> = { success: boolean; message?: string; data?: T };

type UserRecord = {
  userId: string;
  email?: string;
  passwordHash?: string;
  theme: string;
  background_style: string;
  language: string;
  voice_uri: string | null;
  custom_instructions_about_user: string;
  custom_instructions_how_to_respond: string;
  notifications_enabled: boolean;
  total_points: number;
  skill_vocabulary: number;
  skill_grammar: number;
  skill_spelling: number;
  skill_phonetics: number;
  skill_creativity: number;
  skill_logic: number;
  skill_math: number;
  enable_image_generation: boolean;
  enable_daily_time_limit: boolean;
  selected_image_provider: string;
  selected_image_model: string;
  dyslexia_enabled: boolean;
  dyslexia_ruler_enabled: boolean;
  dyslexia_hover_speech_enabled: boolean;
  dyslexia_font_size: number;
  dyslexia_line_spacing: number;
  dyslexia_letter_spacing: number;
  dyslexia_word_spacing: number;
  dyslexia_speech_rate: number;
  dino_highscore?: number;
  flappy_highscore?: number;
  tetris_highscore?: number;
};

type ChatRecord = {
  session_id: string;
  user_id: string;
  title: string;
  challenge_id: string | null;
  challenge_system_prompt?: string;
  created_at: number;
  messages: MessageRecord[];
};

type MessageRecord = {
  message_id: string;
  user_id: string;
  role: 'user' | 'assistant';
  content: string;
  image_url: string | null;
  base64_data: string | null;
  mime_type: string | null;
  attachment_name: string | null;
  attachment_type: string | null;
  is_loading: boolean;
};

type ProgressEntry = {
  date_str: string;
  points_earned: number;
  games_played: number;
  minutes_played: number;
};

// ─── IN-MEMORY FALLBACK (used when Databricks is offline) ───────────────────
const usersById = new Map<string, UserRecord>();
const userIdByEmail = new Map<string, string>();
const chatsBySessionId = new Map<string, ChatRecord>();
const progressByUserId = new Map<string, ProgressEntry[]>();

const DB_PATH = path.resolve(__dirname, '../data/db.json');

function saveLocalData() {
  try {
    const dir = path.dirname(DB_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const data = {
      users: Array.from(usersById.entries()),
      emails: Array.from(userIdByEmail.entries()),
      chats: Array.from(chatsBySessionId.entries()),
      progress: Array.from(progressByUserId.entries()),
    };
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Failed to save local database:', err);
  }
}

function loadLocalData() {
  try {
    if (!fs.existsSync(DB_PATH)) return;
    const raw = fs.readFileSync(DB_PATH, 'utf-8');
    const data = JSON.parse(raw);
    if (data.users) data.users.forEach(([k, v]: [string, UserRecord]) => usersById.set(k, v));
    if (data.emails) data.emails.forEach(([k, v]: [string, string]) => userIdByEmail.set(k, v));
    if (data.chats) data.chats.forEach(([k, v]: [string, ChatRecord]) => chatsBySessionId.set(k, v));
    if (data.progress) data.progress.forEach(([k, v]: [string, ProgressEntry[]]) => progressByUserId.set(k, v));
    console.log(`✅ Loaded ${usersById.size} users and ${chatsBySessionId.size} chats from local JSON.`);
  } catch (err) {
    console.error('Failed to load local database:', err);
  }
}

loadLocalData();
// ─────────────────────────────────────────────────────────────────────────────

function getDefaultUser(userId: string): UserRecord {
  return {
    userId,
    theme: 'light',
    background_style: 'none',
    language: 'en',
    voice_uri: null,
    custom_instructions_about_user: '',
    custom_instructions_how_to_respond: '',
    notifications_enabled: false,
    total_points: 0,
    skill_vocabulary: 0,
    skill_grammar: 0,
    skill_spelling: 0,
    skill_phonetics: 0,
    skill_creativity: 0,
    skill_logic: 0,
    skill_math: 0,
    enable_image_generation: true,
    enable_daily_time_limit: false,
    selected_image_provider: 'gemini',
    selected_image_model: 'models/gemini-2.0-flash-exp',
    dyslexia_enabled: false,
    dyslexia_ruler_enabled: false,
    dyslexia_hover_speech_enabled: false,
    dyslexia_font_size: 1,
    dyslexia_line_spacing: 1.5,
    dyslexia_letter_spacing: 0,
    dyslexia_word_spacing: 0,
    dyslexia_speech_rate: 1,
  };
}

function rowToUser(row: any): UserRecord {
  return {
    userId: row.user_id,
    email: row.email || undefined,
    passwordHash: row.password_hash || undefined,
    theme: row.theme || 'light',
    background_style: row.background_style || 'none',
    language: row.language || 'en',
    voice_uri: row.voice_uri || null,
    custom_instructions_about_user: row.custom_instructions_about_user || '',
    custom_instructions_how_to_respond: row.custom_instructions_how_to_respond || '',
    notifications_enabled: !!row.notifications_enabled,
    total_points: Number(row.total_points) || 0,
    skill_vocabulary: Number(row.skill_vocabulary) || 0,
    skill_grammar: Number(row.skill_grammar) || 0,
    skill_spelling: Number(row.skill_spelling) || 0,
    skill_phonetics: Number(row.skill_phonetics) || 0,
    skill_creativity: Number(row.skill_creativity) || 0,
    skill_logic: Number(row.skill_logic) || 0,
    skill_math: Number(row.skill_math) || 0,
    enable_image_generation: row.enable_image_generation !== false,
    enable_daily_time_limit: !!row.enable_daily_time_limit,
    selected_image_provider: row.selected_image_provider || 'gemini',
    selected_image_model: row.selected_image_model || 'models/gemini-2.0-flash-exp',
    dyslexia_enabled: !!row.dyslexia_enabled,
    dyslexia_ruler_enabled: !!row.dyslexia_ruler_enabled,
    dyslexia_hover_speech_enabled: !!row.dyslexia_hover_speech_enabled,
    dyslexia_font_size: Number(row.dyslexia_font_size) || 1,
    dyslexia_line_spacing: Number(row.dyslexia_line_spacing) || 1.5,
    dyslexia_letter_spacing: Number(row.dyslexia_letter_spacing) || 0,
    dyslexia_word_spacing: Number(row.dyslexia_word_spacing) || 0,
    dyslexia_speech_rate: Number(row.dyslexia_speech_rate) || 1,
    dino_highscore: Number(row.dino_highscore) || 0,
    flappy_highscore: Number(row.flappy_highscore) || 0,
    tetris_highscore: Number(row.tetris_highscore) || 0,
  };
}

const ok = <T>(data: T): ApiResponse<T> => ({ success: true, data });
const fail = (message: string): ApiResponse<never> => ({ success: false, message });

const app = express();
export { app };
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));

// Initialize Databricks schema on startup (non-blocking)
initSchema().catch(err => console.error('Schema init error:', err));

// ─── HEALTH CHECK ────────────────────────────────────────────────────────────
app.get('/api/test-databricks', async (_req, res) => {
  const db = await getDb();
  res.json(ok({ ok: true, databricks: isConnected(), storage: isConnected() ? 'databricks' : 'local-json' }));
});

// ─── AUTH ─────────────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json(fail('Email and password are required.'));

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = randomUUID();

  if (isConnected()) {
    const existing = await runQuery(`SELECT user_id FROM dyslearn_users WHERE email = ?`, [email]);
    if (existing.length > 0) return res.status(409).json(fail('Email already registered.'));
    const u = getDefaultUser(userId);
    await runExec(
      `INSERT INTO dyslearn_users (user_id, email, password_hash) VALUES (?, ?, ?)`,
      [userId, email, passwordHash]
    );
  } else {
    if (userIdByEmail.has(email)) return res.status(409).json(fail('Email already registered.'));
    const user = getDefaultUser(userId);
    user.email = email;
    user.passwordHash = passwordHash;
    usersById.set(userId, user);
    userIdByEmail.set(email, userId);
    saveLocalData();
  }

  res.json(ok({ userId, email }));
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json(fail('Email and password are required.'));

  if (isConnected()) {
    const rows = await runQuery(`SELECT user_id, password_hash FROM dyslearn_users WHERE email = ?`, [email]);
    if (!rows.length) return res.status(401).json(fail('Invalid email or password.'));
    const match = await bcrypt.compare(password, rows[0].password_hash || '');
    if (!match) return res.status(401).json(fail('Invalid email or password.'));
    res.json(ok({ userId: rows[0].user_id, email }));
  } else {
    const uid = userIdByEmail.get(email);
    if (!uid) return res.status(401).json(fail('Invalid email or password.'));
    const user = usersById.get(uid);
    if (!user?.passwordHash) return res.status(401).json(fail('Invalid email or password.'));
    const match = await bcrypt.compare(password, user.passwordHash);
    if (!match) return res.status(401).json(fail('Invalid email or password.'));
    res.json(ok({ userId: uid, email }));
  }
});

// ─── USER SETTINGS ────────────────────────────────────────────────────────────
app.get('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;

  if (isConnected()) {
    const rows = await runQuery(`SELECT * FROM dyslearn_users WHERE user_id = ?`, [userId]);
    if (rows.length > 0) return res.json(ok(rowToUser(rows[0])));
    // Auto-create user
    const def = getDefaultUser(userId);
    await runExec(`INSERT INTO dyslearn_users (user_id) VALUES (?)`, [userId]);
    return res.json(ok(def));
  }

  const existing = usersById.get(userId);
  if (existing) return res.json(ok(existing));
  const created = getDefaultUser(userId);
  usersById.set(userId, created);
  return res.json(ok(created));
});

app.post('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;
  const b = (req.body || {}) as Record<string, unknown>;

  if (isConnected()) {
    // Upsert user settings
    await runExec(`
      MERGE INTO dyslearn_users AS target
      USING (SELECT ? AS user_id) AS source ON target.user_id = source.user_id
      WHEN NOT MATCHED THEN INSERT (user_id) VALUES (?)
    `, [userId, userId]);

    const sets = [
      'theme', 'background_style', 'language', 'voice_uri',
      'custom_instructions_about_user', 'custom_instructions_how_to_respond',
      'notifications_enabled', 'total_points', 'enable_image_generation',
      'enable_daily_time_limit', 'selected_image_provider', 'selected_image_model',
      'skill_vocabulary', 'skill_grammar', 'skill_spelling', 'skill_phonetics',
      'skill_creativity', 'skill_logic', 'skill_math',
      'dyslexia_enabled', 'dyslexia_ruler_enabled', 'dyslexia_hover_speech_enabled',
      'dyslexia_font_size', 'dyslexia_line_spacing', 'dyslexia_letter_spacing',
      'dyslexia_word_spacing', 'dyslexia_speech_rate',
      'dino_highscore', 'flappy_highscore', 'tetris_highscore',
    ].filter(k => b[k] !== undefined);

    if (sets.length > 0) {
      const setClauses = sets.map(k => `${k} = ?`).join(', ');
      const vals = sets.map(k => b[k]);
      await runExec(`UPDATE dyslearn_users SET ${setClauses} WHERE user_id = ?`, [...vals, userId]);
    }
    return res.json(ok({}));
  }

  // Local fallback
  const user = usersById.get(userId) || getDefaultUser(userId);
  const fields: (keyof UserRecord)[] = [
    'theme', 'background_style', 'language', 'voice_uri',
    'custom_instructions_about_user', 'custom_instructions_how_to_respond',
    'notifications_enabled', 'total_points', 'enable_image_generation',
    'enable_daily_time_limit', 'selected_image_provider', 'selected_image_model',
    'skill_vocabulary', 'skill_grammar', 'skill_spelling', 'skill_phonetics',
    'skill_creativity', 'skill_logic', 'skill_math',
    'dyslexia_enabled', 'dyslexia_ruler_enabled', 'dyslexia_hover_speech_enabled',
    'dyslexia_font_size', 'dyslexia_line_spacing', 'dyslexia_letter_spacing',
    'dyslexia_word_spacing', 'dyslexia_speech_rate',
    'dino_highscore', 'flappy_highscore', 'tetris_highscore',
  ];
  fields.forEach(k => { if (b[k] !== undefined) (user as any)[k] = b[k]; });
  usersById.set(userId, user);
  saveLocalData();
  res.json(ok({}));
});

app.delete('/api/user/:userId', async (req, res) => {
  const { userId } = req.params;

  if (isConnected()) {
    await runExec(`DELETE FROM dyslearn_users WHERE user_id = ?`, [userId]);
    await runExec(`DELETE FROM dyslearn_messages WHERE user_id = ?`, [userId]);
    await runExec(`DELETE FROM dyslearn_chats WHERE user_id = ?`, [userId]);
    await runExec(`DELETE FROM dyslearn_progress WHERE user_id = ?`, [userId]);
    return res.json(ok({}));
  }

  usersById.delete(userId);
  for (const [email, id] of userIdByEmail.entries()) {
    if (id === userId) userIdByEmail.delete(email);
  }
  for (const [sid, chat] of chatsBySessionId.entries()) {
    if (chat.user_id === userId) chatsBySessionId.delete(sid);
  }
  progressByUserId.delete(userId);
  saveLocalData();
  res.json(ok({}));
});

// ─── PROGRESS ─────────────────────────────────────────────────────────────────
app.get('/api/progress/:userId', async (req, res) => {
  const { userId } = req.params;

  if (isConnected()) {
    const rows = await runQuery(
      `SELECT date_str, points_earned, games_played, minutes_played FROM dyslearn_progress WHERE user_id = ? ORDER BY date_str DESC`,
      [userId]
    );
    return res.json(ok(rows));
  }

  const entries = (progressByUserId.get(userId) || [])
    .sort((a, b) => b.date_str.localeCompare(a.date_str));
  res.json(ok(entries));
});

app.post('/api/progress/:userId', async (req, res) => {
  const { userId } = req.params;
  const body = req.body || {};
  if (!body.date_str) return res.status(400).json(fail('date_str is required.'));

  if (isConnected()) {
    const existing = await runQuery(
      `SELECT points_earned, games_played, minutes_played FROM dyslearn_progress WHERE user_id = ? AND date_str = ?`,
      [userId, body.date_str]
    );
    if (existing.length > 0) {
      await runExec(
        `UPDATE dyslearn_progress SET points_earned = points_earned + ?, games_played = games_played + ?, minutes_played = minutes_played + ? WHERE user_id = ? AND date_str = ?`,
        [Number(body.points || 0), Number(body.games || 0), Number(body.minutes || 0), userId, body.date_str]
      );
    } else {
      await runExec(
        `INSERT INTO dyslearn_progress (user_id, date_str, points_earned, games_played, minutes_played) VALUES (?, ?, ?, ?, ?)`,
        [userId, body.date_str, Number(body.points || 0), Number(body.games || 0), Number(body.minutes || 0)]
      );
    }
    return res.json(ok({}));
  }

  const arr = progressByUserId.get(userId) || [];
  const idx = arr.findIndex(e => e.date_str === body.date_str);
  const next: ProgressEntry = {
    date_str: body.date_str,
    points_earned: ((idx >= 0 ? arr[idx].points_earned : 0)) + Number(body.points || 0),
    games_played: ((idx >= 0 ? arr[idx].games_played : 0)) + Number(body.games || 0),
    minutes_played: ((idx >= 0 ? arr[idx].minutes_played : 0)) + Number(body.minutes || 0),
  };
  if (idx >= 0) arr[idx] = next; else arr.unshift(next);
  progressByUserId.set(userId, arr);
  saveLocalData();
  res.json(ok({}));
});

// ─── ACHIEVEMENTS ─────────────────────────────────────────────────────────────
app.get('/api/user/:userId/achievements', (_req, res) => res.json(ok([])));

// ─── CHATS ────────────────────────────────────────────────────────────────────
app.get('/api/user/:userId/chats', async (req, res) => {
  const { userId } = req.params;

  if (isConnected()) {
    const rows = await runQuery(
      `SELECT session_id, title, challenge_system_prompt, challenge_id, created_at FROM dyslearn_chats WHERE user_id = ? ORDER BY created_at DESC`,
      [userId]
    );
    return res.json(ok(rows));
  }

  const chats = Array.from(chatsBySessionId.values())
    .filter(c => c.user_id === userId)
    .sort((a, b) => (b.created_at || 0) - (a.created_at || 0))
    .map(c => ({
      session_id: c.session_id,
      title: c.title,
      challenge_system_prompt: c.challenge_system_prompt,
      challenge_id: c.challenge_id,
      created_at: c.created_at || 0,
    }));
  res.json(ok(chats));
});

app.post('/api/chats', async (req, res) => {
  const body = req.body || {};
  if (!body.session_id || !body.user_id) return res.status(400).json(fail('session_id and user_id are required.'));

  if (isConnected()) {
    const existing = await runQuery(`SELECT session_id FROM dyslearn_chats WHERE session_id = ?`, [body.session_id]);
    if (existing.length > 0) {
      await runExec(
        `UPDATE dyslearn_chats SET title = ?, challenge_id = ? WHERE session_id = ?`,
        [body.title || 'New Chat', body.challenge_id ?? null, body.session_id]
      );
    } else {
      await runExec(
        `INSERT INTO dyslearn_chats (session_id, user_id, title, challenge_id, challenge_system_prompt, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
        [body.session_id, body.user_id, body.title || 'New Chat', body.challenge_id ?? null, body.challenge_system_prompt ?? null, body.created_at || Date.now()]
      );
    }
    return res.json(ok({}));
  }

  const existing = chatsBySessionId.get(body.session_id);
  if (existing) {
    existing.title = body.title || existing.title;
    existing.challenge_id = body.challenge_id ?? existing.challenge_id;
    saveLocalData();
    return res.json(ok(existing));
  }
  const chat: ChatRecord = {
    session_id: body.session_id,
    user_id: body.user_id,
    title: body.title || 'New Chat',
    challenge_id: body.challenge_id ?? null,
    created_at: body.created_at || Date.now(),
    messages: [],
  };
  chatsBySessionId.set(chat.session_id, chat);
  saveLocalData();
  res.json(ok(chat));
});

app.get('/api/chats/:sessionId', async (req, res) => {
  const { sessionId } = req.params;

  if (isConnected()) {
    const rows = await runQuery(
      `SELECT message_id, role, content, image_url, base64_data, mime_type, attachment_name, attachment_type, is_loading FROM dyslearn_messages WHERE session_id = ? ORDER BY created_at ASC`,
      [sessionId]
    );
    return res.json(ok(rows));
  }

  const chat = chatsBySessionId.get(sessionId);
  if (!chat) return res.json(ok([]));
  res.json(ok(chat.messages.map(m => ({
    message_id: m.message_id, role: m.role, content: m.content,
    image_url: m.image_url, base64_data: m.base64_data, mime_type: m.mime_type,
    attachment_name: m.attachment_name, attachment_type: m.attachment_type, is_loading: m.is_loading,
  }))));
});

app.post('/api/chats/:sessionId/messages', async (req, res) => {
  const { sessionId } = req.params;
  const body = req.body || {};
  if (!body.message_id || !body.user_id || !body.role || body.content === undefined)
    return res.status(400).json(fail('message_id, user_id, role, content are required.'));

  if (isConnected()) {
    const existing = await runQuery(`SELECT message_id FROM dyslearn_messages WHERE message_id = ?`, [body.message_id]);
    if (existing.length > 0) {
      await runExec(
        `UPDATE dyslearn_messages SET content = ?, image_url = ?, is_loading = ? WHERE message_id = ?`,
        [body.content, body.image_url ?? null, !!body.is_loading, body.message_id]
      );
    } else {
      await runExec(
        `INSERT INTO dyslearn_messages (message_id, session_id, user_id, role, content, image_url, base64_data, mime_type, attachment_name, attachment_type, is_loading, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [body.message_id, sessionId, body.user_id, body.role, body.content, body.image_url ?? null, body.base64_data ?? null, body.mime_type ?? null, body.attachment_name ?? null, body.attachment_type ?? null, !!body.is_loading, Date.now()]
      );
    }
    return res.json(ok({}));
  }

  const chat = chatsBySessionId.get(sessionId);
  if (!chat) return res.status(404).json(fail('Chat not found.'));
  const msg: MessageRecord = {
    message_id: body.message_id,
    user_id: body.user_id,
    role: body.role === 'user' ? 'user' : 'assistant',
    content: body.content,
    image_url: body.image_url ?? null,
    base64_data: body.base64_data ?? null,
    mime_type: body.mime_type ?? null,
    attachment_name: body.attachment_name ?? null,
    attachment_type: body.attachment_type ?? null,
    is_loading: !!body.is_loading,
  };
  const idx = chat.messages.findIndex(m => m.message_id === msg.message_id);
  if (idx >= 0) chat.messages[idx] = msg; else chat.messages.push(msg);
  saveLocalData();
  res.json(ok({}));
});

// ─── SPA CATCH-ALL ────────────────────────────────────────────────────────────
app.use((req, res, next) => {
  if (req.method === 'GET' && !req.path.startsWith('/api')) {
    res.sendFile(path.resolve(__dirname, '../dist/index.html'));
  } else {
    next();
  }
});

export default function handler(req: any, res: any) {
  return app(req, res);
}
