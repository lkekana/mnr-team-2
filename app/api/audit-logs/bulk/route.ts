import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Insert multiple audit logs at once
export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    // Ensure body is an array
    if (!Array.isArray(body)) {
        return NextResponse.json({ error: 'Request body must be an array of audit logs' }, { status: 400 });
    }

    // Add timestamps if not provided
    const auditLogs = body.map(log => ({
        ...log,
        timestamp: log.timestamp || new Date().toISOString()
    }));

    const { data, error } = await supabase
        .from('audit_logs')
        .insert(auditLogs)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
        message: `Successfully inserted ${data?.length || 0} audit logs`,
        data
    }, { status: 201 });
}
