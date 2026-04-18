import { DBSQLClient } from '@databricks/sql';
import dotenv from 'dotenv';
dotenv.config();

const hostname = process.env.DATABRICKS_SERVER_HOSTNAME || '';
const httpPath = process.env.DATABRICKS_HTTP_PATH || '';
const token = process.env.DATABRICKS_TOKEN || '';

let client: DBSQLClient | null = null;
let session: any = null;
let connected = false;

export async function getDb() {
  if (connected && session) return session;
  try {
    client = new DBSQLClient();
    await client.connect({ host: hostname, path: httpPath, token });
    session = await client.openSession();
    connected = true;
    console.log('✅ Connected to Databricks SQL Warehouse');
    return session;
  } catch (err) {
    console.error('❌ Databricks connection failed, falling back to local JSON:', err);
    connected = false;
    session = null;
    return null;
  }
}

export async function runQuery(sql: string, params: any[] = []): Promise<any[]> {
  const db = await getDb();
  if (!db) return [];
  try {
    let i = 0;
    const finalSql = sql.replace(/\?/g, () => {
      const val = params[i++];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return String(val);
      if (typeof val === 'boolean') return val ? '1' : '0';
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    const operation = await db.executeStatement(finalSql, { runAsync: false });
    const result = await operation.fetchAll();
    await operation.close();
    return result as any[];
  } catch (err) {
    console.error('Databricks query error:', err);
    return [];
  }
}

export async function runExec(sql: string, params: any[] = []): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    let i = 0;
    const finalSql = sql.replace(/\?/g, () => {
      const val = params[i++];
      if (val === null || val === undefined) return 'NULL';
      if (typeof val === 'number') return String(val);
      if (typeof val === 'boolean') return val ? '1' : '0';
      return `'${String(val).replace(/'/g, "''")}'`;
    });
    const operation = await db.executeStatement(finalSql, { runAsync: false });
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
