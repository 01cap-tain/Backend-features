import express from "express";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import router from "./routes/login.js";

// const __filename = fileURLToPath(import.meta.url);
// const nam = path.join(dirname(__filename), "data");

// if (!fs.existsSync(nam)) {
//   fs.mkdir(nam, (err) => {
//     if (err) throw err;

//     const filenam = path.join(nam, "content.txt");
//     fs.writeFile(filenam, "iasf", (err, data) => {
//       console.log("file created successfully:");
//       fs.readFile(filenam, "utf8", (err, data) => {
//         console.log(data);
//       });
//     });
//   });
// }

function divider(a, b) {
  return new Promise((resolve, reject) => {
    if (b === 0) {
      reject('can"t run');
    } else {
      setTimeout(() => {
        resolve(a / b);
      }, 2000);
    }
  });
}

// function mul(a, b, callback) {
//   console.log(a * b);
//   callback();
// }
// mul(2, 3, () => {
//   console.log("done!");
// });

async function run() {
  try {
    const value = await divider(10, 10);
    console.log("Completed:", value);
  } catch (err) {
    console.error(err);
  }
}
run();
// const writefile = path.join(nam, "testing.js");
// fs.writeFileSync(writefile, 'console.log("let go")');
// console.log(nam);
// console.log(__filename);

const app = express();
const PORT = 3000;
app.use(router);
app.listen(PORT, () => {
  console.log("listening on port idk");
});


const typeCheck = await connection.query(`
  SELECT 1 FROM pg_type WHERE typname = 'user_role';
`);

if (typeCheck.rows.length === 0) {
  await connection.query(`
    CREATE TYPE user_role AS ENUM ('member', 'moderator', 'admin');
  `);
}

await connection.query(`
    CREATE TABLE IF NOT EXISTS users(
     id SERIAL PRIMARY KEY,
    username TEXT  NOT NULL UNIQUE,
    role user_role NOT NULL DEFAULT 'member',
   passHash TEXT NOT NULL
    )
    `);

await connection.query(`
        CREATE TABLE IF NOT EXISTS profile(
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    gender varchar(10) NOT NULL,
    profession TEXT NOT NULL
)`);