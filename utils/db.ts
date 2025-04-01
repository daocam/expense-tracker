import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

// Define the absolute path for the database
const dbPath = path.join(process.cwd(), "expenses.db");

// Check if the database file exists, otherwise create it
if (!fs.existsSync(dbPath)) {
  fs.writeFileSync(dbPath, ""); // Create an empty file if necessary
}

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

// Retrieve all expenses
export const getExpenses = () => {
  try {
    const stmt = db.prepare("SELECT * FROM expenses ORDER BY date DESC");
    return stmt.all();
  } catch (error) {
    console.error("Failed to fetch expenses:", error);
    return [];
  }
};

// Add a new expense
export const addExpense = (expense: {
  id: string;
  amount: number;
  description: string;
  category: string;
  date: string;
}) => {
  try {
    if (
      !expense.id ||
      !expense.amount ||
      !expense.description ||
      !expense.category ||
      !expense.date
    ) {
      throw new Error("All expense fields are required.");
    }
    const stmt = db.prepare(
      "INSERT INTO expenses (id, amount, description, category, date) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(
      expense.id,
      expense.amount,
      expense.description,
      expense.category,
      expense.date
    );
  } catch (error) {
    console.error("Failed to add expense:", error);
    throw error;
  }
};

// Delete an expense
export const deleteExpense = (id: string) => {
  try {
    if (!id) {
      throw new Error("Expense ID is required.");
    }
    const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
    stmt.run(id);
  } catch (error) {
    console.error("Failed to delete expense:", error);
    throw error;
  }
};
