// Example usage of AuditLogService functions
import { AuditLogService } from './audit_log';

// Example usage functions
export const auditLogExamples = {

  // Example 1: Insert a new audit log
  async createAuditLog() {
    const newAuditLog = {
      user_id: 1,
      action: 'USER_LOGIN',
      timestamp: new Date().toISOString()
    };

    const { data, error } = await AuditLogService.insertAuditLog(newAuditLog);
    
    if (error) {
      console.error('Failed to create audit log:', error);
      return null;
    }
    
    console.log('Created audit log:', data);
    return data;
  },

  // Example 2: Fetch recent audit logs
  async getRecentLogs() {
    const { data, error } = await AuditLogService.fetchRecentAuditLogs(10);
    
    if (error) {
      console.error('Failed to fetch recent logs:', error);
      return null;
    }
    
    console.log('Recent audit logs:', data);
    return data;
  },

  // Example 3: Fetch logs by user
  async getUserLogs(userId: number) {
    const { data, error } = await AuditLogService.fetchAuditLogsByUserId(userId);
    
    if (error) {
      console.error('Failed to fetch user logs:', error);
      return null;
    }
    
    console.log(`Audit logs for user ${userId}:`, data);
    return data;
  },

  // Example 4: Update an audit log
  async updateAuditLog(id: number) {
    const updates = {
      action: 'USER_LOGOUT',
      timestamp: new Date().toISOString()
    };

    const { data, error } = await AuditLogService.updateAuditLog(id, updates);
    
    if (error) {
      console.error('Failed to update audit log:', error);
      return null;
    }
    
    console.log('Updated audit log:', data);
    return data;
  },

  // Example 5: Delete old logs (older than 30 days)
  async cleanupOldLogs() {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const { data, error } = await AuditLogService.deleteOldAuditLogs(
      thirtyDaysAgo.toISOString()
    );
    
    if (error) {
      console.error('Failed to cleanup old logs:', error);
      return null;
    }
    
    console.log('Deleted old audit logs:', data);
    return data;
  },

  // Example 6: Search with filters
  async searchLogs() {
    const filters = {
      action: 'USER_LOGIN',
      startDate: '2024-01-01T00:00:00.000Z',
      endDate: '2024-12-31T23:59:59.999Z',
      limit: 20
    };

    const { data, error } = await AuditLogService.fetchAuditLogsWithFilters(filters);
    
    if (error) {
      console.error('Failed to search logs:', error);
      return null;
    }
    
    console.log('Search results:', data);
    return data;
  },

  // Example 7: Batch insert multiple logs
  async createMultipleLogs() {
    const logs = [
      {
        user_id: 1,
        action: 'LOGIN',
        timestamp: new Date().toISOString()
      },
      {
        user_id: 1,
        action: 'VIEW_PROFILE',
        timestamp: new Date().toISOString()
      },
      {
        user_id: 1,
        action: 'UPDATE_PROFILE',
        timestamp: new Date().toISOString()
      }
    ];

    const { data, error } = await AuditLogService.insertMultipleAuditLogs(logs);
    
    if (error) {
      console.error('Failed to create multiple logs:', error);
      return null;
    }
    
    console.log('Created multiple audit logs:', data);
    return data;
  }
};

// Example of how to use in a React component or API route
export const logUserAction = async (userId: number, action: string) => {
  const auditLog = {
    user_id: userId,
    action: action,
    timestamp: new Date().toISOString()
  };

  const { data, error } = await AuditLogService.insertAuditLog(auditLog);
  
  if (error) {
    console.error('Failed to log user action:', error);
  }
  
  return { data, error };
};
