import Database from "better-sqlite3";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid"; // To generate unique IDs

// Initialize the SQLite database
const db = new Database("expenses.db", { verbose: console.log });

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

// GET: Retrieve all expenses
export async function GET() {
  try {
    const stmt = db.prepare("SELECT * FROM expenses ORDER BY date DESC");
    const expenses = stmt.all();
    return NextResponse.json(expenses, { status: 200 });
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST: Add a new expense
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, description, category, date } = body;

    // Verify that all required fields are present
    if (!amount || !description || !category || !date) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }

    // Generate a unique ID for the new expense
    const id = uuidv4();

    const stmt = db.prepare(
      "INSERT INTO expenses (id, amount, description, category, date) VALUES (?, ?, ?, ?, ?)"
    );
    stmt.run(id, amount, description, category, date);

    return NextResponse.json(
      { message: "Expense added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE: Delete an expense
export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    // Verify that the ID is provided
    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required." },
        { status: 400 }
      );
    }

    const stmt = db.prepare("DELETE FROM expenses WHERE id = ?");
    stmt.run(id);

    return NextResponse.json(
      { message: "Expense deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Database error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
