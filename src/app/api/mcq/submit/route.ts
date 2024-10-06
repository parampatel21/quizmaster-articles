import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDb() {
  return open({
    filename: "./db/db.sqlite",
    driver: sqlite3.Database,
  });
}

export async function POST(request: Request) {
  const { mcq_id, selected_answer, is_correct } = await request.json();

  const db = await openDb();

  try {
    await db.run(
      "INSERT INTO mcq_submissions (mcq_id, selected_answer, is_correct) VALUES (?, ?, ?)",
      [mcq_id, selected_answer, is_correct]
    );

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error("Error submitting MCQ answer:", error);
    return NextResponse.json(
      { error: "Failed to submit answer" },
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}
