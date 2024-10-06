import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function openDb() {
  return open({
    filename: "./db/db.sqlite",
    driver: sqlite3.Database,
  });
}

export async function GET(
  request: Request,
  { params }: { params: { mcq_id: string } }
) {
  const { mcq_id } = params;
  const db = await openDb();

  try {
    const submissions = await db.all(
      "SELECT * FROM mcq_submissions WHERE mcq_id = ?",
      [mcq_id]
    );

    if (submissions.length === 0) {
      return NextResponse.json(
        { message: `No submissions found for mcq_id: ${mcq_id}` },
        { status: 404 }
      );
    }

    return NextResponse.json({ submissions }, { status: 200 });
  } catch (error) {
    console.error("Error retrieving submissions:", error);
    return NextResponse.json(
      { error: "Failed to retrieve submissions" },
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}
