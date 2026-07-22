import pkg from "pg";
const { Pool } = pkg;
import "dotenv/config";
const connection = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pool.on("error", (err) => {
//   console.log(
//     "Neon connection went idle or closed. Reconnecting on next query...",
//   );
// });
export default connection;
