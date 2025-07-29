import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Get count of audit logs
export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const action = searchParams.get('action');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });

    // Apply filters
    if (userId) {
        query = query.eq('user_Id', userId);
    }
    
    if (action) {
        query = query.eq('action', action);
    }
    
    if (startDate) {
        query = query.gte('timestamp', startDate);
    }
    
    if (endDate) {
        query = query.lte('timestamp', endDate);
    }

    const { count, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ count }, { status: 200 });
}
