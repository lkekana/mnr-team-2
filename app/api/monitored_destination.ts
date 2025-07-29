import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for monitored_destination table
export interface MonitoredDestination {
  id?: number;
  user_id?: number | null;
  location?: string | null;
  last_checked?: string | null; // Date as ISO string
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
}

export interface MonitoredDestinationInsert {
  user_id?: number | null;
  location?: string | null;
  last_checked?: string | null; // Date as ISO string
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
}

export interface MonitoredDestinationUpdate {
  user_id?: number | null;
  location?: string | null;
  last_checked?: string | null; // Date as ISO string
  risk_level?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' | null;
}

export const MonitoredDestinationService = {
  // INSERT: Create a new monitored destination
  insertDestination: async (destination: MonitoredDestinationInsert) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .insert(destination)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting monitored destination:', error);
      return { data: null, error };
    }
  },

  // INSERT: Create multiple monitored destinations
  insertMultipleDestinations: async (destinations: MonitoredDestinationInsert[]) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .insert(destinations)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting multiple monitored destinations:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get all monitored destinations
  fetchAllDestinations: async () => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .select('*')
        .order('last_checked', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching monitored destinations:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get monitored destination by ID
  fetchDestinationById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching monitored destination by ID:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get monitored destinations by user ID
  fetchDestinationsByUserId: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .select('*')
        .eq('user_id', userId)
        .order('last_checked', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching monitored destinations by user ID:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get monitored destinations by location
  fetchDestinationsByLocation: async (location: string) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .select('*')
        .eq('location', location)
        .order('last_checked', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching monitored destinations by location:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get monitored destinations by risk level
  fetchDestinationsByRiskLevel: async (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .select('*')
        .eq('risk_level', riskLevel)
        .order('last_checked', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching monitored destinations by risk level:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get destinations that need checking (older than specified days)
  fetchDestinationsNeedingUpdate: async (daysSinceLastCheck: number = 7) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastCheck);
      const cutoffDateString = cutoffDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD

      const { data, error } = await supabase
        .from('monitored_destination')
        .select('*')
        .or(`last_checked.is.null,last_checked.lt.${cutoffDateString}`)
        .order('last_checked', { ascending: true, nullsFirst: true });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching destinations needing update:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get monitored destinations within date range
  fetchDestinationsByDateRange: async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .select('*')
        .gte('last_checked', startDate)
        .lte('last_checked', endDate)
        .order('last_checked', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching monitored destinations by date range:', error);
      return { data: null, error };
    }
  },

  // FETCH: Search destinations with filters
  fetchDestinationsWithFilters: async (filters: {
    userId?: number;
    location?: string;
    riskLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    try {
      let query = supabase
        .from('monitored_destination')
        .select('*');

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`);
      }
      if (filters.riskLevel) {
        query = query.eq('risk_level', filters.riskLevel);
      }
      if (filters.startDate) {
        query = query.gte('last_checked', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('last_checked', filters.endDate);
      }

      // Apply ordering and limit
      query = query.order('last_checked', { ascending: false });
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching monitored destinations with filters:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get high-risk destinations for a user
  fetchHighRiskDestinations: async (userId?: number) => {
    try {
      let query = supabase
        .from('monitored_destination')
        .select('*')
        .in('risk_level', ['HIGH', 'CRITICAL']);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      query = query.order('risk_level', { ascending: false });

      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching high-risk destinations:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Modify an existing monitored destination
  updateDestination: async (id: number, updates: MonitoredDestinationUpdate) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .update(updates)
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating monitored destination:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Update risk level for a destination
  updateRiskLevel: async (id: number, riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .update({ 
          risk_level: riskLevel,
          last_checked: new Date().toISOString().split('T')[0] // Update last_checked to today
        })
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating risk level:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Update last checked date
  updateLastChecked: async (id: number, lastChecked?: string) => {
    try {
      const checkDate = lastChecked || new Date().toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('monitored_destination')
        .update({ last_checked: checkDate })
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating last checked date:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Bulk update destinations for a user
  updateDestinationsByUserId: async (userId: number, updates: MonitoredDestinationUpdate) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .update(updates)
        .eq('user_id', userId)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating destinations by user ID:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove a monitored destination by ID
  deleteDestination: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .delete()
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting monitored destination:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove multiple destinations by user ID
  deleteDestinationsByUserId: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .delete()
        .eq('user_id', userId)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting destinations by user ID:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove destinations by location
  deleteDestinationsByLocation: async (location: string) => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .delete()
        .eq('location', location)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting destinations by location:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove destinations with specific risk level
  deleteDestinationsByRiskLevel: async (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    try {
      const { data, error } = await supabase
        .from('monitored_destination')
        .delete()
        .eq('risk_level', riskLevel)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting destinations by risk level:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove old destinations (not checked for specified days)
  deleteStaleDestinations: async (daysSinceLastCheck: number = 90) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysSinceLastCheck);
      const cutoffDateString = cutoffDate.toISOString().split('T')[0];

      const { data, error } = await supabase
        .from('monitored_destination')
        .delete()
        .lt('last_checked', cutoffDateString)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting stale destinations:', error);
      return { data: null, error };
    }
  },

  // UTILITY: Count total monitored destinations
  countDestinations: async () => {
    try {
      const { count, error } = await supabase
        .from('monitored_destination')
        .select('*', { count: 'exact', head: true });
      
      return { count, error };
    } catch (error) {
      console.error('Error counting monitored destinations:', error);
      return { count: null, error };
    }
  },

  // UTILITY: Count destinations by user
  countDestinationsByUser: async (userId: number) => {
    try {
      const { count, error } = await supabase
        .from('monitored_destination')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      return { count, error };
    } catch (error) {
      console.error('Error counting destinations by user:', error);
      return { count: null, error };
    }
  },

  // UTILITY: Count destinations by risk level
  countDestinationsByRiskLevel: async (riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') => {
    try {
      const { count, error } = await supabase
        .from('monitored_destination')
        .select('*', { count: 'exact', head: true })
        .eq('risk_level', riskLevel);
      
      return { count, error };
    } catch (error) {
      console.error('Error counting destinations by risk level:', error);
      return { count: null, error };
    }
  },

  // UTILITY: Get risk level statistics
  getRiskLevelStatistics: async (userId?: number) => {
    try {
      let query = supabase
        .from('monitored_destination')
        .select('risk_level');

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query;
      
      if (error) {
        return { data: null, error };
      }

      // Count occurrences of each risk level
      const stats = data.reduce((acc: any, item: any) => {
        const level = item.risk_level || 'UNKNOWN';
        acc[level] = (acc[level] || 0) + 1;
        return acc;
      }, {});

      return { data: stats, error: null };
    } catch (error) {
      console.error('Error getting risk level statistics:', error);
      return { data: null, error };
    }
  }
};
