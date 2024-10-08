// helper functions for API services

import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { MCQSubmission } from '@/types/mcqTypes';

// open the database
async function openDb() {
  return open({
    filename: './db/db.sqlite',
    driver: sqlite3.Database,
  });
}

// retrieve all submissions for a specific MCQ
export async function getSubmissionsByMcqId(
  mcq_id: string
): Promise<MCQSubmission[]> {
  const db = await openDb();
  try {
    const submissions = await db.all(
      'SELECT * FROM mcq_submissions WHERE mcq_id = ?',
      [mcq_id]
    );
    return submissions;
  } finally {
    await db.close();
  }
}

// insert a new submission for a specific MCQ
export async function insertSubmission(
  mcq_id: string,
  selected_answer: string,
  is_correct: boolean
): Promise<void> {
  const db = await openDb();
  try {
    await db.run(
      'INSERT INTO mcq_submissions (mcq_id, selected_answer, is_correct) VALUES (?, ?, ?)',
      [mcq_id, selected_answer, is_correct]
    );
  } finally {
    await db.close();
  }
}

// delete all submissions for a specific MCQ
export async function deleteSubmissionsByMcqId(
  mcq_id: string
): Promise<number> {
  const db = await openDb();
  try {
    const result = await db.run(
      'DELETE FROM mcq_submissions WHERE mcq_id = ?',
      [mcq_id]
    );
    return result?.changes ?? 0;
  } finally {
    await db.close();
  }
}
