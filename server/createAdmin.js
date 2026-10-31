
require("dotenv").config();

const bcrypt = require("bcryptjs");
const pool = require("./db");
const readline = require("readline/promises");
const { stdin, stdout } = require("process");

async function createAdmin() {
  const rl = readline.createInterface({ input: stdin, output: stdout });

  try {
    const name = await rl.question("Admin name: ");
    const email = (await rl.question("Admin email: "))
      .trim()
      .toLowerCase();
    const password = await rl.question("Admin password: ");

    if (!name.trim() || !email || password.length < 8) {
      throw new Error("Enter a name, valid email, and password of at least 8 characters.");
    }

    const existing = await pool.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      throw new Error("This email already exists. Choose another email.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const result = await pool.query(
      `INSERT INTO users (name, email, password_hash, role)
       VALUES ($1, $2, $3, 'admin')
       RETURNING id, name, email, role`,
      [name.trim(), email, passwordHash]
    );

    console.log("Admin account created successfully!");
    console.log(result.rows[0]);
  } catch (error) {
    console.error("Admin setup failed:", error.message);
  } finally {
    rl.close();
    await pool.end();
  }
}

createAdmin();
