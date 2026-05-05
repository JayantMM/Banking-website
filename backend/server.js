const express = require("express");
const path = require("path");
const mysql = require("mysql2");
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

/* Middleware */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* Static Files Folder */
app.use(express.static(path.join(__dirname, "public")));

/* MySQL Connection */
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "bankingdb"
});

/* Connect Database */
db.connect((err) => {
  if (err) {
    console.log("❌ Database Error:", err);
  } else {
    console.log("✅ MySQL Connected Successfully");
  }
});

/* Email Setup */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "yourgmail@gmail.com",
    pass: "your_app_password"
  }
});

/* Home Page */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

/* Login by User ID / Email */
app.post("/login", (req, res) => {

  const username = (req.body.username || "").trim();
  const password = (req.body.password || "").trim();

  const sql = `
    SELECT * FROM users
    WHERE (
      LOWER(TRIM(name)) = LOWER(?)
      OR LOWER(TRIM(email)) = LOWER(?)
      OR LOWER(TRIM(username)) = LOWER(?)
    )
    AND TRIM(password) = ?
    LIMIT 1
  `;

  db.query(sql, [username, username, username, password], (err, result) => {

    if (err) {
      console.log("❌ Login Error:", err);   // 🔥 FIX ADDED
      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        message: "Login successful",
        user: result[0]
      });
    } else {
      res.json({
        success: false,
        message: "Invalid username or password"
      });
    }

  });

});

/* Login by Debit Card */
app.post("/card-login", (req, res) => {

  const card = (req.body.card || "").trim();
  const pin = (req.body.pin || "").trim();

  const sql = "SELECT * FROM users WHERE TRIM(card)=? AND TRIM(pin)=? LIMIT 1";

  db.query(sql, [card, pin], (err, result) => {

    if (err) {
      console.log("❌ Card Login Error:", err); // 🔥 FIX
      return res.status(500).json({
        success: false,
        message: "Server Error"
      });
    }

    if (result.length > 0) {
      res.json({
        success: true,
        message: "Card login successful",
        user: result[0]
      });
    } else {
      res.json({
        success: false,
        message: "Invalid card details"
      });
    }

  });

});

/* Register New User */
app.post("/register", (req, res) => {

  const name = (req.body.name || "").trim();
  const email = (req.body.email || "").trim();
  const username = (req.body.username || "").trim();
  const password = (req.body.password || "").trim();
  const gender = (req.body.gender || "").trim();
  const card = (req.body.card || "").trim();
  const pin = (req.body.pin || "").trim();

  const sql =
    "INSERT INTO users(name,email,username,password,gender,card,pin,balance) VALUES(?,?,?,?,?,?,?,?)";

  db.query(
    sql,
    [name, email, username, password, gender, card, pin, 50000],
    (err) => {

      if (err) {
        console.log("❌ Register Error:", err); // 🔥 FIX
        return res.status(500).json({
          success: false,
          message: "Registration Failed"
        });
      }

      res.json({
        success: true,
        message: "Registration Successful"
      });

    }
  );

});

/* Forgot Password */
app.post("/forgot-password", (req, res) => {

  const email = (req.body.email || "").trim();

  if (!email) {
    return res.json({
      success: false,
      message: "Enter Email"
    });
  }

  db.query(
    "SELECT password FROM users WHERE TRIM(email)=TRIM(?) LIMIT 1",
    [email],
    (err, result) => {

      if (err) {
        console.log("❌ Forgot Password Error:", err); // 🔥 FIX
        return res.status(500).json({
          success: false,
          message: "Database Error"
        });
      }

      if (result.length > 0) {
        res.json({
          success: true,
          password: result[0].password,
          message: "Password Found"
        });
      } else {
        res.json({
          success: false,
          message: "Email Not Found"
        });
      }

    }
  );

});

/* Get All Users For Admin */
app.get("/users", (req, res) => {

  db.query("SELECT * FROM users", (err, result) => {

    if (err) {
      console.log("❌ Fetch Users Error:", err); // 🔥 FIX
      return res.json([]);
    }

    res.json(result);

  });

});

/* Delete User */
app.delete("/users/:id", (req, res) => {

  const id = req.params.id;

  db.query("DELETE FROM users WHERE id=?", [id], (err) => {

    if (err) {
      console.log("❌ Delete Error:", err); // 🔥 FIX
      return res.send("Delete Failed");
    }

    res.send("User Deleted");

  });

});

/* Dashboard */
app.get("/dashboard", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "dashboard.html"));
});

/* Start Server */
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});