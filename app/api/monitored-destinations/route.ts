import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    const { data, error } = await supabase
        .from('monitored_destination')
        .insert(body)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 201 });
}

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
        const { data, error } = await supabase
            .from('monitored_destination')
            .select('*')
            .eq('id', Number(id))
            .single();

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 404 });
        }
        return NextResponse.json(data, { status: 200 });
    } else {
        const { data, error } = await supabase
            .from('monitored_destination')
            .select('*');

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json(data, { status: 200 });
    }
}

export async function PUT(request: Request) {
    const supabase = await createClient();
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('monitored_destination')
        .update(updates)
        .eq('id', id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
}

export async function DELETE(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
        return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('monitored_destination')
        .delete()
        .eq('id', Number(id))
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
}