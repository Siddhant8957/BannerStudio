
const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 4000;

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET missing in backend/.env");
}

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const db = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "bannerstudio",
  waitForConnections: true,
  connectionLimit: 10
});

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

function authenticate(req, res, next) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Please log in first" });
  }

  try {
    req.user = jwt.verify(
      header.slice(7),
      process.env.JWT_SECRET
    );
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// Health check + database check
app.get("/api/health", async (req, res) => {
  try {
    await db.query("SELECT 1");
    res.json({
      status: "ok",
      database: "connected",
      message: "BannerStudio backend is running"
    });
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({
      status: "error",
      database: "disconnected"
    });
  }
});

// Signup
app.post("/api/auth/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({
        message: "Name, valid email and password (at least 8 characters) are required"
      });
    }

    const cleanEmail = email.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name.trim(), cleanEmail, passwordHash]
    );

    const user = {
      id: result.insertId,
      name: name.trim(),
      email: cleanEmail
    };

    res.status(201).json({
      message: "Account created successfully",
      token: createToken(user),
      user
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ message: "Email is already registered" });
    }

    console.error("Signup error:", error.message);
    res.status(500).json({ message: "Could not create account" });
  }
});

// Login
app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const [rows] = await db.execute(
      "SELECT id, name, email, password_hash FROM users WHERE email = ?",
      [email.trim().toLowerCase()]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = rows[0];
    const matches = await bcrypt.compare(password, user.password_hash);

    if (!matches) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      token: createToken(user),
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Login error:", error.message);
    res.status(500).json({ message: "Could not log in" });
  }
});

// Get the currently logged-in user's profile
app.get("/api/auth/me", authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      "SELECT id, name, email, created_at FROM users WHERE id = ?",
      [req.user.id]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ user: rows[0] });
  } catch (error) {
    console.error("Profile error:", error.message);
    res.status(500).json({ message: "Could not load profile" });
  }
});

// Save a banner
app.post("/api/banners", authenticate, async (req, res) => {
  try {
    const {
      shop_name,
      occasion,
      offer_text,
      phone,
      template_key
    } = req.body;

    if (!shop_name?.trim() || !template_key?.trim()) {
      return res.status(400).json({
        message: "Shop name and template are required"
      });
    }

    const [result] = await db.execute(
      `INSERT INTO banners
       (user_id, shop_name, occasion, offer_text, phone, template_key)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        req.user.id,
        shop_name.trim(),
        occasion || null,
        offer_text || null,
        phone || null,
        template_key.trim()
      ]
    );

    res.status(201).json({
      message: "Banner saved successfully",
      id: result.insertId
    });
  } catch (error) {
    console.error("Save banner error:", error.message);
    res.status(500).json({ message: "Could not save banner" });
  }
});

// List only this user's banners
app.get("/api/banners", authenticate, async (req, res) => {
  try {
    const [rows] = await db.execute(
      `SELECT id, shop_name, occasion, offer_text, phone,
              template_key, created_at
       FROM banners
       WHERE user_id = ?
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json({ banners: rows });
  } catch (error) {
    console.error("List banners error:", error.message);
    res.status(500).json({ message: "Could not load banners" });
  }
});

// Delete only this user's banner
app.delete("/api/banners/:id", authenticate, async (req, res) => {
  try {
    const bannerId = Number(req.params.id);

    if (!Number.isInteger(bannerId) || bannerId < 1) {
      return res.status(400).json({ message: "Invalid banner ID" });
    }

    const [result] = await db.execute(
      "DELETE FROM banners WHERE id = ? AND user_id = ?",
      [bannerId, req.user.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ message: "Banner not found" });
    }

    res.json({ message: "Banner deleted successfully" });
  } catch (error) {
    console.error("Delete banner error:", error.message);
    res.status(500).json({ message: "Could not delete banner" });
  }
});

// Handle unknown API routes
app.use("/api", (req, res) => {
  res.status(404).json({ message: "API route not found" });
});

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
