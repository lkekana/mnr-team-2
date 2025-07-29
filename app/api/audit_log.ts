import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// Type definitions for audit_logs table
export interface AuditLog {
  id?: number;
  user_id?: number | null;
  action?: string | null;
  timestamp?: string | null;
}

export interface AuditLogInsert {
  user_id?: number | null;
  action?: string | null;
  timestamp?: string | null;
}

export interface AuditLogUpdate {
  user_id?: number | null;
  action?: string | null;
  timestamp?: string | null;
}

export const AuditLogService = {
  // INSERT: Create a new audit log entry
  insertAuditLog: async (auditLog: AuditLogInsert) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(auditLog)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting audit log:', error);
      return { data: null, error };
    }
  },

  // INSERT: Create multiple audit log entries
  insertMultipleAuditLogs: async (auditLogs: AuditLogInsert[]) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert(auditLogs)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error inserting multiple audit logs:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get all audit logs
  fetchAllAuditLogs: async () => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching audit logs:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get audit log by ID
  fetchAuditLogById: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('id', id)
        .single();
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching audit log by ID:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get audit logs by user ID
  fetchAuditLogsByUserId: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('user_id', userId)
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching audit logs by user ID:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get audit logs by action
  fetchAuditLogsByAction: async (action: string) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .eq('action', action)
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching audit logs by action:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get audit logs within date range
  fetchAuditLogsByDateRange: async (startDate: string, endDate: string) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate)
        .order('timestamp', { ascending: false });
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching audit logs by date range:', error);
      return { data: null, error };
    }
  },

  // FETCH: Get recent audit logs (last N records)
  fetchRecentAuditLogs: async (limit: number = 50) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('timestamp', { ascending: false })
        .limit(limit);
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching recent audit logs:', error);
      return { data: null, error };
    }
  },

  // FETCH: Search audit logs with filters
  fetchAuditLogsWithFilters: async (filters: {
    userId?: number;
    action?: string;
    startDate?: string;
    endDate?: string;
    limit?: number;
  }) => {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*');

      // Apply filters
      if (filters.userId) {
        query = query.eq('user_id', filters.userId);
      }
      if (filters.action) {
        query = query.eq('action', filters.action);
      }
      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }

      // Apply ordering and limit
      query = query.order('timestamp', { ascending: false });
      
      if (filters.limit) {
        query = query.limit(filters.limit);
      }

      const { data, error } = await query;
      
      return { data, error };
    } catch (error) {
      console.error('Error fetching audit logs with filters:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Modify an existing audit log
  updateAuditLog: async (id: number, updates: AuditLogUpdate) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .update(updates)
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating audit log:', error);
      return { data: null, error };
    }
  },

  // UPDATE: Update multiple audit logs by user ID
  updateAuditLogsByUserId: async (userId: number, updates: AuditLogUpdate) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .update(updates)
        .eq('user_id', userId)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error updating audit logs by user ID:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove an audit log by ID
  deleteAuditLog: async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .eq('id', id)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting audit log:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove multiple audit logs by user ID
  deleteAuditLogsByUserId: async (userId: number) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .eq('user_id', userId)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting audit logs by user ID:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove audit logs older than specified date
  deleteOldAuditLogs: async (beforeDate: string) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .lt('timestamp', beforeDate)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting old audit logs:', error);
      return { data: null, error };
    }
  },

  // DELETE: Remove audit logs by action
  deleteAuditLogsByAction: async (action: string) => {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .delete()
        .eq('action', action)
        .select();
      
      return { data, error };
    } catch (error) {
      console.error('Error deleting audit logs by action:', error);
      return { data: null, error };
    }
  },

  // UTILITY: Count total audit logs
  countAuditLogs: async () => {
    try {
      const { count, error } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true });
      
      return { count, error };
    } catch (error) {
      console.error('Error counting audit logs:', error);
      return { count: null, error };
    }
  },

  // UTILITY: Count audit logs by user
  countAuditLogsByUser: async (userId: number) => {
    try {
      const { count, error } = await supabase
        .from('audit_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);
      
      return { count, error };
    } catch (error) {
      console.error('Error counting audit logs by user:', error);
      return { count: null, error };
    }
  }
};
