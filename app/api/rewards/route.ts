import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface UserReward {
    reward_id: string;
    route_id: string;
    reward_value: number;
    avoided_risks: number;
    claim_prevention_estimate: number;
    created_at: string;
}

export async function POST(request: Request) {
    const supabase = await createClient();
    const body = await request.json();

    const { userID, ...rewardData } : { userID: string; reward: UserReward } = body;

    if (!userID) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('reward')
        .insert({ ...rewardData, user_id: userID })
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
        .from('reward')
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
    const { userID, reward_id, ...updates }: { userID: string; reward_id: string; [key: string]: any } = body;

    if (!userID || !reward_id) {
        return NextResponse.json({ error: 'User ID and Reward ID are required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('reward')
        .update(updates)
        .eq('user_id', userID)
        .eq('reward_id', reward_id)
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
    const reward_id = searchParams.get('reward_id');

    if (!userID || !reward_id) {
        return NextResponse.json({ error: 'User ID and Reward ID are required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('reward')
        .delete()
        .eq('user_id', userID)
        .eq('reward_id', reward_id)
        .select();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data, { status: 200 });
}