const { Pool } = require("pg");
const { createRequestHandler } = require("./server");

let handler;

module.exports = function handleVercelRequest(req, res) {
  if (!process.env.DATABASE_URL) {
    res.writeHead(500, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" });
    res.end(JSON.stringify({ error: "Set DATABASE_URL to the Supabase transaction-pooler connection string." }));
    return;
  }
  if (!handler) {
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 1,
      connectionTimeoutMillis: 10000,
      idleTimeoutMillis: 10000,
    });
    handler = createRequestHandler({ database: pool });
  }
  return handler(req, res);
};
