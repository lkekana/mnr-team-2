// Example usage of UserAlertService functions
import { UserAlertService } from './user_alerts';

// Example usage functions
export const userAlertExamples = {

  // Example 1: Create a new alert
  async createAlert() {
    const newAlert = {
      user_id: 1,
      alert_name: 'Travel Risk Alert',
      alert_description: 'High risk detected for your monitored destination: Paris, France',
      alert_status: 'ACTIVE' as const,
      timestamp: new Date().toISOString()
    };

    const { data, error } = await UserAlertService.insertAlert(newAlert);
    
    if (error) {
      console.error('Failed to create alert:', error);
      return null;
    }
    
    console.log('Created alert:', data);
    return data;
  },

  // Example 2: Create alert with auto timestamp
  async createAlertWithAutoTimestamp() {
    const alert = {
      user_id: 1,
      alert_name: 'Security Update',
      alert_description: 'Your account security settings have been updated',
      alert_status: 'ACTIVE' as const
    };

    const { data, error } = await UserAlertService.insertAlertWithTimestamp(alert);
    
    if (error) {
      console.error('Failed to create alert with timestamp:', error);
      return null;
    }
    
    console.log('Created alert with auto timestamp:', data);
    return data;
  },

  // Example 3: Get active alerts for a user
  async getUserActiveAlerts(userId: number) {
    const { data, error } = await UserAlertService.fetchActiveAlerts(userId);
    
    if (error) {
      console.error('Failed to fetch active alerts:', error);
      return null;
    }
    
    console.log(`Active alerts for user ${userId}:`, data);
    return data;
  },

  // Example 4: Get unread alert count
  async getUnreadCount(userId: number) {
    const { count, error } = await UserAlertService.getUnreadAlertCount(userId);
    
    if (error) {
      console.error('Failed to get unread count:', error);
      return null;
    }
    
    console.log(`Unread alerts for user ${userId}:`, count);
    return count;
  },

  // Example 5: Mark alert as resolved
  async resolveAlert(alertId: number) {
    const { data, error } = await UserAlertService.markAlertAsResolved(alertId);
    
    if (error) {
      console.error('Failed to resolve alert:', error);
      return null;
    }
    
    console.log('Resolved alert:', data);
    return data;
  },

  // Example 6: Get recent alerts (last 24 hours)
  async getRecentAlerts(userId: number) {
    const { data, error } = await UserAlertService.fetchRecentAlerts(24, userId);
    
    if (error) {
      console.error('Failed to fetch recent alerts:', error);
      return null;
    }
    
    console.log('Recent alerts (24h):', data);
    return data;
  },

  // Example 7: Search alerts with filters
  async searchAlerts(userId: number) {
    const filters = {
      userId: userId,
      alertStatus: 'ACTIVE' as const,
      searchText: 'travel',
      limit: 10
    };

    const { data, error } = await UserAlertService.fetchAlertsWithFilters(filters);
    
    if (error) {
      console.error('Failed to search alerts:', error);
      return null;
    }
    
    console.log('Search results:', data);
    return data;
  },

  // Example 8: Get alert status summary
  async getAlertSummary(userId: number) {
    const { data, error } = await UserAlertService.fetchAlertStatusSummary(userId);
    
    if (error) {
      console.error('Failed to get alert summary:', error);
      return null;
    }
    
    console.log('Alert status summary:', data);
    return data;
  },

  // Example 9: Mark all alerts as resolved
  async resolveAllAlerts(userId: number) {
    const { data, error } = await UserAlertService.markAllUserAlertsAsResolved(userId);
    
    if (error) {
      console.error('Failed to resolve all alerts:', error);
      return null;
    }
    
    console.log('Resolved all alerts:', data);
    return data;
  },

  // Example 10: Create multiple alerts
  async createMultipleAlerts(userId: number) {
    const alerts = [
      {
        user_id: userId,
        alert_name: 'Travel Alert',
        alert_description: 'New travel advisory for your destination',
        alert_status: 'ACTIVE' as const,
        timestamp: new Date().toISOString()
      },
      {
        user_id: userId,
        alert_name: 'Security Alert',
        alert_description: 'Suspicious login attempt detected',
        alert_status: 'PENDING' as const,
        timestamp: new Date().toISOString()
      },
      {
        user_id: userId,
        alert_name: 'System Notification',
        alert_description: 'System maintenance scheduled',
        alert_status: 'ACTIVE' as const,
        timestamp: new Date().toISOString()
      }
    ];

    const { data, error } = await UserAlertService.insertMultipleAlerts(alerts);
    
    if (error) {
      console.error('Failed to create multiple alerts:', error);
      return null;
    }
    
    console.log('Created multiple alerts:', data);
    return data;
  },

  // Example 11: Clean up old resolved alerts
  async cleanupOldAlerts(userId: number) {
    const { data, error } = await UserAlertService.deleteOldResolvedAlerts(30, userId); // 30 days old
    
    if (error) {
      console.error('Failed to cleanup old alerts:', error);
      return null;
    }
    
    console.log('Cleaned up old alerts:', data);
    return data;
  }
};

// Utility functions for common alert operations
export const alertUtils = {
  
  // Create a travel risk alert
  async createTravelRiskAlert(userId: number, location: string, riskLevel: string) {
    const alert = {
      user_id: userId,
      alert_name: 'Travel Risk Alert',
      alert_description: `Risk level ${riskLevel} detected for ${location}`,
      alert_status: 'ACTIVE' as const
    };

    const { data, error } = await UserAlertService.insertAlertWithTimestamp(alert);
    
    if (!error && data) {
      console.log(`✅ Created travel risk alert for ${location}`);
    }
    
    return { data, error };
  },

  // Create a security alert
  async createSecurityAlert(userId: number, description: string) {
    const alert = {
      user_id: userId,
      alert_name: 'Security Alert',
      alert_description: description,
      alert_status: 'ACTIVE' as const
    };

    const { data, error } = await UserAlertService.insertAlertWithTimestamp(alert);
    
    if (!error && data) {
      console.log(`🔒 Created security alert: ${description}`);
    }
    
    return { data, error };
  },

  // Get notification badge count (unread alerts)
  async getNotificationBadgeCount(userId: number) {
    const { count, error } = await UserAlertService.getUnreadAlertCount(userId);
    
    if (error) {
      return { count: 0, error };
    }

    return { count: count || 0, error: null };
  },

  // Mark alerts as read (resolve them)
  async markAlertsAsRead(alertIds: number[]) {
    const { data, error } = await UserAlertService.markMultipleAlertsAsResolved(alertIds);
    
    if (!error && data) {
      console.log(`📖 Marked ${data.length} alerts as read`);
    }
    
    return { data, error };
  },

  // Get alerts for notification display
  async getAlertsForNotification(userId: number, limit: number = 5) {
    const { data, error } = await UserAlertService.fetchAlertsWithFilters({
      userId,
      alertStatus: 'ACTIVE',
      limit
    });

    if (error) {
      return { alerts: [], error };
    }

    return { 
      alerts: data || [],
      hasMore: (data && data.length === limit),
      error: null 
    };
  },

  // Check if user has any critical alerts
  async hasCriticalAlerts(userId: number) {
    const { data, error } = await UserAlertService.fetchAlertsWithFilters({
      userId,
      alertStatus: 'ACTIVE',
      searchText: 'critical'
    });

    if (error) {
      return { hasCritical: false, error };
    }

    return { 
      hasCritical: data && data.length > 0,
      criticalAlerts: data || [],
      error: null 
    };
  }
};
