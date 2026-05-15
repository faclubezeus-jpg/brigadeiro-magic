const { Pool } = require('pg');

let dbUrl = "postgresql://postgres.tnxmbertplpovzflstny:docinhomagico2024!@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";
dbUrl = dbUrl.replace("?sslmode=require", "").replace("&sslmode=require", "");

async function test() {
  try {
    const pool = new Pool({
      connectionString: dbUrl,
      ssl: { rejectUnauthorized: false }
    });
    const client = await pool.connect();
    console.log("Connected successfully!");
    client.release();
    process.exit(0);
  } catch (err) {
    console.error("Connection failed:", err);
    process.exit(1);
  }
}

test();
