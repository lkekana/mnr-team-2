import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
    const supabase = await createClient();
    try {
        // Perform a lightweight query to check database connectivity
        const { data, error } = await supabase.from('test_table').select('*').limit(1);

        if (error) {
            return new Response('Database query failed', { status: 500 });
        }

        return new Response('Database is healthy', { status: 200 });
    } catch (err) {
        return new Response('Internal Server Error', { status: 500 });
    }
}
