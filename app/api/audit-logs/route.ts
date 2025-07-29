import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Insert new audit log
export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    // Add timestamp if not provided
    if (!body.timestamp) {
        body.timestamp = new Date().toISOString();
    }

    const { data, error } = await supabase
        .from('audit_logs')
        .insert(body)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 201 });
}

// GET - Fetch audit logs
export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');
    const action = searchParams.get('action');
    const limit = searchParams.get('limit');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');

    let query = supabase.from('audit_logs').select('*');

    // Filter by specific ID
    if (id) {
        query = query.eq('id', Number(id));
        
        const { data, error } = await query.single();
        
        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json(data, { status: 200 });
    }

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

    // Apply ordering (most recent first)
    query = query.order('timestamp', { ascending: false });

    // Apply limit if specified
    if (limit) {
        query = query.limit(Number(limit));
    }

    const { data, error } = await query;

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
}

// PUT - Update existing audit log
export async function PUT(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('audit_logs')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data && data.length === 0) {
        return NextResponse.json({ error: 'Audit log not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
}

// DELETE - Remove audit log
export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const userId = searchParams.get('user_id');
    const beforeDate = searchParams.get('before_date');
    const action = searchParams.get('action');

    let query = supabase.from('audit_logs').delete();

    // Delete by specific ID
    if (id) {
        query = query.eq('id', Number(id));
    }
    // Delete by user ID (all logs for a user)
    else if (userId) {
        query = query.eq('user_Id', userId);
    }
    // Delete logs before a certain date
    else if (beforeDate) {
        query = query.lt('timestamp', beforeDate);
        
        // Optionally filter by user if provided
        if (userId) {
            query = query.eq('user_Id', userId);
        }
    }
    // Delete by action type
    else if (action) {
        query = query.eq('action', action);
        
        // Optionally filter by user if provided
        if (userId) {
            query = query.eq('user_Id', userId);
        }
    }
    else {
        return NextResponse.json({ error: 'ID, user_id, before_date, or action is required' }, { status: 400 });
    }

    const { data, error } = await query.select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data && data.length === 0) {
        return NextResponse.json({ error: 'No audit logs found to delete' }, { status: 404 });
    }

    return NextResponse.json({ 
        message: `Successfully deleted ${data?.length || 0} audit log(s)`,
        deleted_records: data 
    }, { status: 200 });
}
