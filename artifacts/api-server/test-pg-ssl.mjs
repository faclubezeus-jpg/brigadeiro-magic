import pg from "pg";

const dbUrl = "postgresql://postgres.tnxmbertplpovzflstny:docinhomagico2024!@aws-1-us-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require";

async function test() {
  try {
    const pool = new pg.Pool({
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
