import { NextResponse } from 'next/server';

// simple Hello World
// go to http://localhost:3000/api to see
export async function GET() {
    return NextResponse.json({ message: 'Hello, World!' });
}