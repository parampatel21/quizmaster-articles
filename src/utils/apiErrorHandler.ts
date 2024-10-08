// standardized error response from the API

import { NextResponse } from 'next/server';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
  }
}

export function handleError(error: ApiError) {
  return NextResponse.json({ error: error.message }, { status: error.status });
}
