const express = require("express");
const { Pool } = require("pg");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const verifyToken = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ error: "Invalid token" });
    }
};

app.post("/register", async (req, res) => {
    const { name, username, email, password, birthdate, country } = req.body;

    try {
        const userExists = await pool.query("SELECT * FROM users WHERE email = $1 OR username = $2", [email, username]);
        if (userExists.rows.length > 0) return res.status(400).json({ error: "Email or username already taken" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            "INSERT INTO users (name, username, email, password, birthdate, country) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, name, username, email",
            [name, username, email, hashedPassword, birthdate, country]
        );

        res.json({ message: "User registered", user: newUser.rows[0] });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: "Invalid credentials" });

        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) return res.status(400).json({ error: "Invalid credentials" });

        const token = jwt.sign({ id: user.rows[0].id, email: user.rows[0].email }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ message: "Login successful", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/forgot-password", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (user.rows.length === 0) return res.status(400).json({ error: "Email not found" });

        const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "15m" });

        await pool.query("INSERT INTO password_reset_tokens (email, token) VALUES ($1, $2)", [email, resetToken]);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Password Reset",
            text: `Click the link to reset your password: http://localhost:3000/reset-password?token=${resetToken}`
        };
        await transporter.sendMail(mailOptions);

        res.json({ message: "Password reset email sent" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post("/reset-password", async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const email = decoded.email;

        const tokenExists = await pool.query("SELECT * FROM password_reset_tokens WHERE token = $1", [token]);
        if (tokenExists.rows.length === 0) return res.status(400).json({ error: "Invalid or expired token" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);

        await pool.query("DELETE FROM password_reset_tokens WHERE email = $1", [email]);

        res.json({ message: "Password reset successful" });
    } catch (err) {
        res.status(400).json({ error: "Invalid or expired token" });
    }
});

app.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await pool.query("SELECT id, name, username, email, birthdate, country FROM users WHERE id = $1", [req.user.id]);
        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5292;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));