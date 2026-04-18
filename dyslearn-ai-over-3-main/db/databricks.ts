import { DBSQLClient } from '@databricks/sql';
import dotenv from 'dotenv';
dotenv.config();

const hostname = process.env.DATABRICKS_SERVER_HOSTNAME || '';
const httpPath = process.env.DATABRICKS_HTTP_PATH || '';
const token = process.env.DATABRICKS_TOKEN || '';

let session: any = null;
let connected = false;
let connectionAttempted = false; // only try once — never retry on every request

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(`Databricks connection timed out after ${ms}ms`)), ms))
  ]);
}

export async function getDb() {
  // Already connected
  if (connected && session) return session;
  // Already tried and failed — don't retry, use local JSON
  if (connectionAttempted) return null;

  connectionAttempted = true;
  try {
    const client = new DBSQLClient();
    await withTimeout(client.connect({ host: hostname, path: httpPath, token }), 5000);
    session = await withTimeout(client.openSession(), 5000);
    connected = true;
    console.log('✅ Connected to Databricks SQL Warehouse');
    return session;
  } catch (err: any) {
    console.warn(`⚠️  Databricks unavailable (${err.message}), using local JSON fallback.`);
    connected = false;
    session = null;
    return null;
  }
}

function buildSql(sql: string, params: any[]): string {
  let i = 0;
  return sql.replace(/\?/g, () => {
    const val = params[i++];
    if (val === null || val === undefined) return 'NULL';
    if (typeof val === 'number') return String(val);
    if (typeof val === 'boolean') return val ? '1' : '0';
    return `'${String(val).replace(/'/g, "''")}'`;
  });
}

export async function runQuery(sql: string, params: any[] = []): Promise<any[]> {
  if (!connected || !session) return [];
  try {
    const operation = await session.executeStatement(buildSql(sql, params), { runAsync: false });
    const result = await operation.fetchAll();
    await operation.close();
    return result as any[];
  } catch (err) {
    console.error('Databricks query error:', err);
    return [];
  }
}

export async function runExec(sql: string, params: any[] = []): Promise<boolean> {
  if (!connected || !session) return false;
  try {
    const operation = await session.executeStatement(buildSql(sql, params), { runAsync: false });
    await operation.close();
    return true;
  } catch (err) {
    console.error('Databricks exec error:', err);
    return false;
  }
}

export function isConnected() {
  return connected;
}
