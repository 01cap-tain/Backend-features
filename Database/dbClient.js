import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";
const connection = new Pool({
  database: process.env.DATABASE_NAME,
  host: process.env.DASEBASE_HOST,
  password: process.env.DATABASE_PASSWORD,
  user: process.env.DATABASE_USER,
  port: process.env.DATABASE_PORT,
});

export default connection;
