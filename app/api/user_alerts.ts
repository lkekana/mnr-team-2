import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for user_alerts table
export interface UserAlert {
  id?: number;
  user_id?: number | null;
  timestamp?: string | null; // ISO timestamp string
  alert_name?: string | null;
  alert_description?: string | null;
  alert_status?: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING' | null;
}

export interface UserAlertInsert {
  user_id?: number | null;
  timestamp?: string | null; // ISO timestamp string
  alert_name?: string | null;
  alert_description?: string | null;
  alert_status?: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING' | null;
}

export interface UserAlertUpdate {
  user_id?: number | null;
  timestamp?: string | null; // ISO timestamp string
  alert_name?: string | null;
  alert_description?: string | null;
  alert_status?: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING' | null;
}

export const UserAlertService = {
  // INSERT: Create a new user alert
  insertAlert: async (alert: UserAlertInsert) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .insert(alert)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting user alert:', error);
      return { data: null, error };
    }
  },

  // INSERT: Create multiple user alerts
  insertMultipleAlerts: async (alerts: UserAlertInsert[]) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .insert(alerts)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting multiple user alerts:', error);
      return { data: null, error };
    }
  },

  // INSERT: Create alert with auto timestamp
  insertAlertWithTimestamp: async (alert: Omit<UserAlertInsert, 'timestamp'>) => {
    try {
      const alertWithTimestamp = {
        ...alert,
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('user_alerts')
        .insert(alertWithTimestamp)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting user alert with timestamp:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get all user alerts
  fetchAllAlerts: async () => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching user alerts:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get user alert by ID
  fetchAlertById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching user alert by ID:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get user alerts by user ID
  fetchAlertsByUserId: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching user alerts by user ID:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get user alerts by status
  fetchAlertsByStatus: async (status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING') => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('alert_status', status)
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching user alerts by status:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get active alerts for a user
  fetchActiveAlerts: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('*')
        .eq('user_id', userId)
        .eq('alert_status', 'ACTIVE')
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching active alerts:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get unresolved alerts (ACTIVE, PENDING)
  fetchUnresolvedAlerts: async (userId?: number) => {
    try {
      let query = supabase
        .from('user_alerts')
        .select('*')
        .in('alert_status', ['ACTIVE', 'PENDING']);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      query = query.order('timestamp', { ascending: false });

      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching unresolved alerts:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get recent alerts (within specified hours)
  fetchRecentAlerts: async (hours: number = 24, userId?: number) => {
    try {
      const cutoffTime = new Date();
      cutoffTime.setHours(cutoffTime.getHours() - hours);
      
      let query = supabase
        .from('user_alerts')
        .select('*')
        .gte('timestamp', cutoffTime.toISOString());

      if (userId) {
        query = query.eq('user_id', userId);
      }

      query = query.order('timestamp', { ascending: false });

      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching recent alerts:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get alerts within date range
  fetchAlertsByDateRange: async (startDate: string, endDate: string, userId?: number) => {
    try {
      let query = supabase
        .from('user_alerts')
        .select('*')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      query = query.order('timestamp', { ascending: false });

      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching alerts by date range:', error);
      return { data: null, error };
    }
  },

  // FETCH: Search alerts with filters
  fetchAlertsWithFilters: async (filters: {
    userId?: number;
    alertName?: string;
    alertStatus?: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING';
    startDate?: string;
    endDate?: string;
    limit?: number;
    searchText?: string; // Search in alert_name and alert_description
  }) => {
    try {
      let query = supabase
        .from('user_alerts')
        .select('*');

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.alertName) {
        query = query.ilike('alert_name', `%${filters.alertName}%`);
      }
      if (filters.alertStatus) {
        query = query.eq('alert_status', filters.alertStatus);
      }
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }
      if (filters.searchText) {
        query = query.or(`alert_name.ilike.%${filters.searchText}%,alert_description.ilike.%${filters.searchText}%`);
      }

      // Apply ordering and limit
      query = query.order('timestamp', { ascending: false });
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching alerts with filters:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get alert count by status for a user
  fetchAlertStatusSummary: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .select('alert_status')
        .eq('user_id', userId);
      
      if (error) {
        return { data: null, error };
      }

      // Count occurrences of each status
      const summary = data.reduce((acc: any, item: any) => {
        const status = item.alert_status || 'UNKNOWN';
        acc[status] = (acc[status] || 0) + 1;
        return acc;
      }, {});

      return { data: summary, error: null };
    } catch (error) {
      console.error('Error fetching alert status summary:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Modify an existing user alert
  updateAlert: async (id: number, updates: UserAlertUpdate) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .update(updates)
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating user alert:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Update alert status
  updateAlertStatus: async (id: number, status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING') => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .update({ alert_status: status })
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating alert status:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Mark alert as resolved
  markAlertAsResolved: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .update({ alert_status: 'RESOLVED' })
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error marking alert as resolved:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Mark multiple alerts as resolved
  markMultipleAlertsAsResolved: async (alertIds: number[]) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .update({ alert_status: 'RESOLVED' })
        .in('id', alertIds)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error marking multiple alerts as resolved:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Mark all user alerts as resolved
  markAllUserAlertsAsResolved: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .update({ alert_status: 'RESOLVED' })
        .eq('user_id', userId)
        .neq('alert_status', 'RESOLVED')
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error marking all user alerts as resolved:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Bulk update alerts by status
  updateAlertsByStatus: async (
    currentStatus: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING',
    newStatus: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING',
    userId?: number
  ) => {
    try {
      let query = supabase
        .from('user_alerts')
        .update({ alert_status: newStatus })
        .eq('alert_status', currentStatus);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating alerts by status:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove a user alert by ID
  deleteAlert: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting user alert:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove multiple alerts by user ID
  deleteAlertsByUserId: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('user_alerts')
        .delete()
        .eq('user_id', userId)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting alerts by user ID:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove alerts by status
  deleteAlertsByStatus: async (status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING', userId?: number) => {
    try {
      let query = supabase
        .from('user_alerts')
        .delete()
        .eq('alert_status', status);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting alerts by status:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove old resolved alerts
  deleteOldResolvedAlerts: async (daysSinceResolved: number = 30, userId?: number) => {
    try {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysSinceResolved);

      let query = supabase
        .from('user_alerts')
        .delete()
        .eq('alert_status', 'RESOLVED')
        .lt('timestamp', cutoffDate.toISOString());

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting old resolved alerts:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove alerts older than specified date
  deleteOldAlerts: async (beforeDate: string, userId?: number) => {
    try {
      let query = supabase
        .from('user_alerts')
        .delete()
        .lt('timestamp', beforeDate);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { data, error } = await query.select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting old alerts:', error);
      return { data: null, error };
    }
  },

  // UTILITY: Count total user alerts
  countAlerts: async (userId?: number) => {
    try {
      let query = supabase
        .from('user_alerts')
        .select('*', { count: 'exact', head: true });

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { count, error } = await query;
      
      return { count, error };
    } catch (error) {
      console.error('Error counting user alerts:', error);
      return { count: null, error };
    }
  },

  // UTILITY: Count alerts by status
  countAlertsByStatus: async (status: 'ACTIVE' | 'INACTIVE' | 'RESOLVED' | 'PENDING', userId?: number) => {
    try {
      let query = supabase
        .from('user_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('alert_status', status);

      if (userId) {
        query = query.eq('user_id', userId);
      }

      const { count, error } = await query;
      
      return { count, error };
    } catch (error) {
      console.error('Error counting alerts by status:', error);
      return { count: null, error };
    }
  },

  // UTILITY: Get unread alert count (ACTIVE + PENDING)
  getUnreadAlertCount: async (userId: number) => {
    try {
      const { count, error } = await supabase
        .from('user_alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .in('alert_status', ['ACTIVE', 'PENDING']);
      
      return { count, error };
    } catch (error) {
      console.error('Error getting unread alert count:', error);
      return { count: null, error };
    }
  }
};
