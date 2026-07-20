import express from "express";
import connection from "../Database/dbClient.js";
import {
  signIn,
  signUp,
  profile,
  debug,
  populate,
  editProfile,
  passwordReset,
} from "../controllers/auth-controllers.js";
import authentication from "../middleware/auth-middleware.js";

connection.connect();
const router = express.Router();

router.post("/signUp", signUp);
router.post("/signIn", signIn);
router.get("/profile", authentication, profile);
router.get("/debug-session", debug);
router.patch("/profile", authentication, editProfile);
router.post("/reset", passwordReset);

// console.log(connection.query)
// router.post("/SignUp", async (req, res) => {
//   try {
//     console.log("database created");
//   } catch (err) {
//     res.json();
//   }
//   connection.end();
// });

export default router;
