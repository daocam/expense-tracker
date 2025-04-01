import Database from "better-sqlite3";
import path from "path";
import { NextApiRequest, NextApiResponse } from "next";

// Define the absolute path for the database
const dbPath = path.join(process.cwd(), "expenses.db");

// Initialize the SQLite database
const db = new Database(dbPath, { verbose: console.log });

// Create the table if it does not exist
db.exec(`
  CREATE TABLE IF NOT EXISTS expenses (
    id TEXT PRIMARY KEY,
    amount REAL NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL
  )
`);

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method === "GET") {
      // Retrieve all expenses
      const stmt = db.prepare("SELECT * FROM expenses ORDER BY date DESC");
      const expenses = stmt.all();
      res.status(200).json(expenses);
    } else if (req.method === "POST") {
      // Add a new expense
      const { id, amount, description, category, date } = req.body;
      if (!id || !amount || !description || !category || !date) {
        res.status(400).json({ error: "All fields are required." });
        return;
      }
      const stmt = db.prepare(
        "INSERT INTO expenses (id, amount, description, category, date) VALUES (?, ?, ?, ?, ?)"
      );
      stmt.run(id, amount, description, category, date);
      res.status(201).json({ message: "Expense added successfully" });
    } else if (req.method === "DELETE") {
      // Delete an expense
      const { id } = req.body;
      if (!id) {
        res.status(400).json({ error: "Expense ID is required." });
        return;
      }
      const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
      stmt.run(id);
      res.status(200).json({ message: "Expense deleted successfully" });
    } else {
      res.setHeader("Allow", ["GET", "POST", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("Database error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
