import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// POST - Insert new user alert
export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    // Add timestamp if not provided
    if (!body.timestamp) {
        body.timestamp = new Date().toISOString();
    }

    // Validate required fields
    if (!body.alert_name || !body.alert_description || !body.alert_status) {
        return NextResponse.json({ 
            error: 'alert_name, alert_description, and alert_status are required' 
        }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('user_alerts')
        .insert(body)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 201 });
}

// GET - Fetch user alerts
export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const alertStatus = searchParams.get('alert_status');
    const alertName = searchParams.get('alert_name');
    const limit = searchParams.get('limit');
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    const search = searchParams.get('search'); // Search in alert_name or alert_description

    let query = supabase.from('user_alerts').select('*');

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
    if (alertStatus) {
        query = query.eq('alert_status', alertStatus);
    }
    
    if (alertName) {
        query = query.ilike('alert_name', `%${alertName}%`);
    }
    
    if (search) {
        query = query.or(`alert_name.ilike.%${search}%,alert_description.ilike.%${search}%`);
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

// PUT - Update existing user alert
export async function PUT(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('user_alerts')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data && data.length === 0) {
        return NextResponse.json({ error: 'User alert not found' }, { status: 404 });
    }

    return NextResponse.json(data, { status: 200 });
}

// DELETE - Remove user alert
export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const alertStatus = searchParams.get('alert_status');
    const beforeDate = searchParams.get('before_date');
    const alertName = searchParams.get('alert_name');

    let query = supabase.from('user_alerts').delete();

    // Delete by specific ID
    if (id) {
        query = query.eq('id', Number(id));
    }
    // Delete by alert status
    else if (alertStatus) {
        query = query.eq('alert_status', alertStatus);
    }
    // Delete alerts before a certain date
    else if (beforeDate) {
        query = query.lt('timestamp', beforeDate);
    }
    // Delete by alert name
    else if (alertName) {
        query = query.eq('alert_name', alertName);
    }
    else {
        return NextResponse.json({ 
            error: 'ID, alert_status, before_date, or alert_name is required' 
        }, { status: 400 });
    }

    const { data, error } = await query.select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }

    if (data && data.length === 0) {
        return NextResponse.json({ error: 'No user alerts found to delete' }, { status: 404 });
    }

    return NextResponse.json({ 
        message: `Successfully deleted ${data?.length || 0} user alert(s)`,
        deleted_records: data 
    }, { status: 200 });
}
