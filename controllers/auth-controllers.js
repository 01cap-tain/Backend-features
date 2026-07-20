import argon2 from "argon2";
import connection from "../Database/dbClient.js";
import session from "express-session";
import cookieParser from "cookie-parser";

connection.connect();
async function signUp(req, res) {
  try {
    const { username } = req.body;
    const { password } = req.body;
    const { role } = req.body;

    // Direct role evaluation logic
    let assignRole = "member";
    if (username.includes(".admin")) {
      assignRole = "admin";
    } else if (username.includes(".moderator")) {
      assignRole = "moderator";
    }
    //   password hash
    const passHash = await argon2.hash(password, 10);

    const newUser = await connection.query(
      `
        INSERT INTO users(username,role,passhash)
        VALUES($1,$2,$3)
        `,
      [username, assignRole, passHash],
    );
    if (newUser) {
      res.status(200).json({
        success: true,
        message: "Sign Up successful",
      });
    }
    // console.log("Signup completed");
  } catch (err) {
    res.status(500);
  }
  // connection.end();
}

async function signIn(req, res) {
  const { username, password } = req.body;

  const passHash = await connection.query(
    `
          SELECT id,username, passhash FROM users WHERE username =$1   
            `,
    [username],
  );
  if (passHash.rows.length === 0) {
    return res.status(401).json({
      message: "Invalid user",
    });
  }
  const storedHash = passHash.rows[0].passhash;
  const confirmPassword = await argon2.verify(storedHash, password);

  if (!confirmPassword) {
    return res.status(401).json({
      message: "re-check your password",
    });
  }
  const id = passHash.rows[0].id;
  req.session.user = { username, id };

  try {
    await new Promise((resolve, reject) => {
      req.session.save((err) => {
        if (err) {
          console.error("Failed to save session:", err);
          return reject(err);
        }
        console.log("✅ Session saved successfully");
        resolve();
      });
    });

    return res.status(201).json({
      message: "Sign in Successful",
      user: req.session.user,
    });
  } catch (err) {
    res.status(500).json({
      message: "something occurred, try again later",
    });
  }
}
async function profile(req, res) {
  try {
    // 1. Safely extract username inside the try block (no await needed)
    const sessionData = req.session || {};
    console.log(sessionData);
    // 2. Check if username exists
    if (req.session?.user?.username) {
      const userId = req.session?.user?.id;
      const userProfile = await connection.query(
        `
        SELECT u.username,p.gender,p.profession FROM users
         AS u INNER JOIN profile
         AS p on u.id =p.user_id WHERE u.id =$1
        `,
        [userId],
      );
      return res.status(200).json({
        userProfile: userProfile.rows[0],
      });
    }

    // 3. CRITICAL: Handle the case where username does NOT exist
    return res.status(401).json({
      message: "Unauthorized: No valid user cookie found",
    });
  } catch (err) {
    console.log(err);
  }
}

async function editProfile(req, res) {
  try {
    const { username, gender, profession } = req.body;
    if (!req.session.user.id) {
      return res.status(401).json({
        message: "Unathorized",
      });
    }

    // existing user info and profile info
    const existingInfo = await connection.query(
      `
  SELECT u.username, p.gender, p.profession 
  FROM users AS u 
  INNER JOIN profile AS p ON u.id = p.user_id 
  WHERE u.id = $1;
`,
      [req.session.user.id],
    );

    if (existingInfo.rows.length === 0) {
      return res.json({
        message: "No Profile Found",
      });
    }

    // 2. Destructure the properties for cleaner comparison
    const {
      username: oldUsername,
      gender: oldGender,
      profession: oldProfession,
    } = existingInfo.rows[0];

    // 3. Run the validation check (fixed syntax)
    if (
      oldUsername === username &&
      oldGender === gender &&
      oldProfession === profession
    ) {
      return res.status(400).json({ message: "Unedited user info" });
    }

    const updatedUser = await connection.query(
      `
      UPDATE users SET username = $1 WHERE id = $2 RETURNING username
      `,
      [username, req.session.user.id],
    );

    const editedProfile = await connection.query(
      `
      UPDATE profile SET gender = $1, profession = $2
      WHERE user_Id=$3 RETURNING gender,profession
      `,
      [gender, profession, req.session.user.id],
    );

    console.log("testing");

    // The editProfile properties overwrites the oldProfile
    req.session.user = {
      ...req.session.user,
      ...updatedUser.rows[0],
      ...editedProfile.rows[0],
    };
    res.status(202).json({
      message: "resource changed",
    });
  } catch (err) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
}
async function populate(req, res) {
  const { user_id, gender, profession } = req.body;
  await connection.query(
    `
        INSERT INTO profile(user_id,gender,profession)
        VALUES($1,$2,$3)
        `,
    [user_id, gender, profession],
  );

  res.status(201).json({
    message: "resource added to db",
  });
}

async function passwordReset(req, res) {
  const { username, newPassword, oldPassword } = req.body;
  const newpasshash = await argon2.hash(newPassword, 10);
  const old = await argon2.hash(oldPassword, 10);
  const passHash = await connection.query(
    `
    SELECT passhash FROM users WHERE username =$1
    `,
    [username],
  );
  const isPasswordMatch = await argon2.verify(passHash.rows[0].passhash, old);
  if (!isPasswordMatch) {
    return res.status(400).json({
      message: "Old password is incorrect",
    });
  }
  await connection.query(
    `
    UPDATE users SET passhash =$1 WHERE username = $2
    `,
    [newpasshash, username],
  );
}

function debug(req, res) {
  console.log("=== SESSION DEBUG ===");
  console.log("Session ID:", req.sessionID);
  console.log("Full session:", req.session);
  console.log("Cookies received:", req.headers.cookie);

  res.json({
    sessionID: req.sessionID,
    session: req.session,
    cookies: req.headers.cookie,
  });
}
export { signUp, signIn, profile, editProfile, passwordReset, debug, populate };
