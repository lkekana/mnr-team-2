// Example usage of MonitoredDestinationService functions
import { MonitoredDestinationService } from './monitored_destination';

// Example usage functions
export const monitoredDestinationExamples = {

  // Example 1: Add a new destination to monitor
  async addDestination() {
    const newDestination = {
      user_id: 1,
      location: 'Paris, France',
      last_checked: new Date().toISOString().split('T')[0], // Today's date
      risk_level: 'LOW' as const
    };

    const { data, error } = await MonitoredDestinationService.insertDestination(newDestination);
    
    if (error) {
      console.error('Failed to add destination:', error);
      return null;
    }
    
    console.log('Added destination:', data);
    return data;
  },

  // Example 2: Get all destinations for a user
  async getUserDestinations(userId: number) {
    const { data, error } = await MonitoredDestinationService.fetchDestinationsByUserId(userId);
    
    if (error) {
      console.error('Failed to fetch user destinations:', error);
      return null;
    }
    
    console.log(`Destinations for user ${userId}:`, data);
    return data;
  },

  // Example 3: Update risk level for a destination
  async updateDestinationRisk(destinationId: number, newRiskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') {
    const { data, error } = await MonitoredDestinationService.updateRiskLevel(destinationId, newRiskLevel);
    
    if (error) {
      console.error('Failed to update risk level:', error);
      return null;
    }
    
    console.log('Updated destination risk level:', data);
    return data;
  },

  // Example 4: Get destinations that need risk assessment update
  async getDestinationsNeedingUpdate() {
    const { data, error } = await MonitoredDestinationService.fetchDestinationsNeedingUpdate(7); // 7 days old
    
    if (error) {
      console.error('Failed to fetch destinations needing update:', error);
      return null;
    }
    
    console.log('Destinations needing update:', data);
    return data;
  },

  // Example 5: Get high-risk destinations
  async getHighRiskDestinations(userId?: number) {
    const { data, error } = await MonitoredDestinationService.fetchHighRiskDestinations(userId);
    
    if (error) {
      console.error('Failed to fetch high-risk destinations:', error);
      return null;
    }
    
    console.log('High-risk destinations:', data);
    return data;
  },

  // Example 6: Search destinations with filters
  async searchDestinations() {
    const filters = {
      riskLevel: 'HIGH' as const,
      location: 'Paris',
      limit: 10
    };

    const { data, error } = await MonitoredDestinationService.fetchDestinationsWithFilters(filters);
    
    if (error) {
      console.error('Failed to search destinations:', error);
      return null;
    }
    
    console.log('Search results:', data);
    return data;
  },

  // Example 7: Add multiple destinations at once
  async addMultipleDestinations(userId: number) {
    const destinations = [
      {
        user_id: userId,
        location: 'Tokyo, Japan',
        last_checked: new Date().toISOString().split('T')[0],
        risk_level: 'LOW' as const
      },
      {
        user_id: userId,
        location: 'London, UK',
        last_checked: new Date().toISOString().split('T')[0],
        risk_level: 'MEDIUM' as const
      },
      {
        user_id: userId,
        location: 'Kiev, Ukraine',
        last_checked: new Date().toISOString().split('T')[0],
        risk_level: 'HIGH' as const
      }
    ];

    const { data, error } = await MonitoredDestinationService.insertMultipleDestinations(destinations);
    
    if (error) {
      console.error('Failed to add multiple destinations:', error);
      return null;
    }
    
    console.log('Added multiple destinations:', data);
    return data;
  },

  // Example 8: Get risk level statistics
  async getRiskStatistics(userId?: number) {
    const { data, error } = await MonitoredDestinationService.getRiskLevelStatistics(userId);
    
    if (error) {
      console.error('Failed to get risk statistics:', error);
      return null;
    }
    
    console.log('Risk level statistics:', data);
    return data;
  },

  // Example 9: Remove a destination
  async removeDestination(destinationId: number) {
    const { data, error } = await MonitoredDestinationService.deleteDestination(destinationId);
    
    if (error) {
      console.error('Failed to remove destination:', error);
      return null;
    }
    
    console.log('Removed destination:', data);
    return data;
  },

  // Example 10: Update destination details
  async updateDestinationDetails(destinationId: number) {
    const updates = {
      location: 'Berlin, Germany',
      risk_level: 'MEDIUM' as const,
      last_checked: new Date().toISOString().split('T')[0]
    };

    const { data, error } = await MonitoredDestinationService.updateDestination(destinationId, updates);
    
    if (error) {
      console.error('Failed to update destination:', error);
      return null;
    }
    
    console.log('Updated destination:', data);
    return data;
  }
};

// Utility functions for common operations
export const destinationUtils = {
  
  // Add a destination and log the action
  async addAndLogDestination(userId: number, location: string, riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL') {
    const destination = {
      user_id: userId,
      location: location,
      last_checked: new Date().toISOString().split('T')[0],
      risk_level: riskLevel
    };

    const { data, error } = await MonitoredDestinationService.insertDestination(destination);
    
    if (!error && data) {
      console.log(`✅ Added destination: ${location} with risk level: ${riskLevel}`);
    }
    
    return { data, error };
  },

  // Check if user is monitoring a specific location
  async isLocationMonitored(userId: number, location: string) {
    const { data, error } = await MonitoredDestinationService.fetchDestinationsWithFilters({
      userId,
      location
    });

    if (error) {
      return { isMonitored: false, error };
    }

    return { 
      isMonitored: data && data.length > 0, 
      destinations: data,
      error: null 
    };
  },

  // Get destinations that need immediate attention (HIGH/CRITICAL risk)
  async getDestinationsNeedingAttention(userId: number) {
    const { data, error } = await MonitoredDestinationService.fetchHighRiskDestinations(userId);
    
    if (error) {
      return { urgent: [], error };
    }

    const urgent = data?.filter(dest => dest.risk_level === 'CRITICAL') || [];
    const warning = data?.filter(dest => dest.risk_level === 'HIGH') || [];

    return {
      urgent,
      warning,
      total: (urgent.length + warning.length),
      error: null
    };
  }
};
