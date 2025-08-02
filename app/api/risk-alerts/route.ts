import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface Route {
    route_id: string;
    user_id: string;
    start_location: string;
    end_location: string;
    created_at: string; // ISO 8601 timestamp format
}

interface RouteRisk {
    risk_id: string;
    route: Route;
    risk_type: string;
    severity: string;
    route_risk_score: number;
}

function isValidRoute(route: any): route is Route {
    return (
        typeof route.route_id === 'string' &&
        typeof route.user_id === 'string' &&
        typeof route.start_location === 'string' &&
        typeof route.end_location === 'string' &&
        typeof route.created_at === 'string'
    );
}

export async function GET(request: Request) {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const userID = searchParams.get('userID');

    if (!userID) {
        return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
        .from('route_risks')
        .select(`
            risk_id,
            risk_type,
            severity,
            route_risk_score,
            route:route_id (
                route_id,
                user_id,
                start_location,
                end_location,
                created_at
            )
        `)
        .eq('route.user_id', userID); // Filter by userID in the route table

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
    
        // Ensure the data matches the RouteRisk[] type
        const formattedData: RouteRisk[] = (data || []).map((item: any) => {
            const route = Array.isArray(item.route) ? item.route[0] : item.route; // Handle array case
            if (isValidRoute(route)) {
                return {
                    risk_id: item.risk_id,
                    risk_type: item.risk_type,
                    severity: item.severity,
                    route_risk_score: item.route_risk_score,
                    route,
                };
            }
            throw new Error('Invalid route data');
        });
    
        return NextResponse.json(formattedData, { status: 200 });
    }