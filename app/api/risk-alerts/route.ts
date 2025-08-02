import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface RiskAlert {
    alert_id: string;
    user_id: string;
    alert_type: string;
    message: string;
    severity: string;
    timestamp: string;
    acknowledged: boolean;
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    const { userID, ...alertData }: { userID: string; alert: RiskAlert } = body;

    if (!userID) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('risk_alert')
        .insert({ ...alertData, user_id: userID })
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get('userID');

    if (!userID) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('risk_alert')
        .select('*')
        .eq('user_id', userID);

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
}

export async function PUT(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { userID, alert_id, ...updates }: { userID: string; alert_id: string; [key: string]: any } = body;

    if (!userID || !alert_id) {
        return NextResponse.json({ error: 'User ID and Alert ID are required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('risk_alert')
        .update(updates)
        .eq('user_id', userID)
        .eq('alert_id', alert_id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get('userID');
    const alert_id = searchParams.get('alert_id');

    if (!userID || !alert_id) {
        return NextResponse.json({ error: 'User ID and Alert ID are required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('risk_alert')
        .delete()
        .eq('user_id', userID)
        .eq('alert_id', alert_id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
}