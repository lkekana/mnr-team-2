import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// if you go to http://localhost:3000/api/test, it will return the data from the test_table in Supabase
export async function GET() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('test_table').select('*');
        console.log(data, error);

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json(data, { status: 200 });
    } catch (err) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}