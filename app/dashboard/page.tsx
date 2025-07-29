'use client'
import { useState } from 'react'

interface Alert {
  id: number
  title: string
  status: 'active' | 'resolved' | 'pending'
  timestamp: string
  description?: string
}

const sampleAlerts: Alert[] = [
  { 
    id: 1, 
    title: 'High Blood Pressure Reading', 
    status: 'active', 
    timestamp: '2025-07-29T10:30:00Z',
    description: 'Blood pressure reading of 180/120 detected'
  },
  { 
    id: 2, 
    title: 'Missed Medication Reminder', 
    status: 'resolved', 
    timestamp: '2025-07-29T09:15:00Z',
    description: 'Patient missed morning medication dose'
  },
  { 
    id: 3, 
    title: 'Abnormal Heart Rate', 
    status: 'active', 
    timestamp: '2025-07-29T08:45:00Z',
    description: 'Heart rate above 120 BPM for extended period'
  },
  { 
    id: 4, 
    title: 'Temperature Spike Alert', 
    status: 'pending', 
    timestamp: '2025-07-28T22:30:00Z',
    description: 'Body temperature reached 39.2°C (102.6°F)'
  },
  { 
    id: 5, 
    title: 'Low Oxygen Saturation', 
    status: 'active', 
    timestamp: '2025-07-28T20:15:00Z',
    description: 'SpO2 levels dropped below 90%'
  },
  { 
    id: 6, 
    title: 'Medication Interaction Warning', 
    status: 'resolved', 
    timestamp: '2025-07-28T16:20:00Z',
    description: 'Potential interaction between prescribed medications'
  },
]

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>(sampleAlerts)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'pending'>('all')
  const [sortBy, setSortBy] = useState<'timestamp' | 'title' | 'status'>('timestamp')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter alerts based on status
  const filteredAlerts = filter === 'all' 
    ? alerts 
    : alerts.filter(alert => alert.status === filter)

  // Sort alerts
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    let comparison = 0
    
    if (sortBy === 'timestamp') {
      comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    } else if (sortBy === 'title') {
      comparison = a.title.localeCompare(b.title)
    } else if (sortBy === 'status') {
      comparison = a.status.localeCompare(b.status)
    }
    
    return sortOrder === 'asc' ? comparison : -comparison
  })

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-red-100 text-red-800 border-red-200'
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200'
      case 'pending': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'resolved':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'pending':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
          </svg>
        )
      default:
        return null
    }
  }

  const handleResolve = (id: number) => {
    setAlerts(alerts.map(alert => 
      alert.id === id ? { ...alert, status: 'resolved' as const } : alert
    ))
  }

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this alert?')) {
      setAlerts(alerts.filter(alert => alert.id !== id))
    }
  }

  const getAlertCounts = () => {
    return {
      total: alerts.length,
      active: alerts.filter(a => a.status === 'active').length,
      pending: alerts.filter(a => a.status === 'pending').length,
      resolved: alerts.filter(a => a.status === 'resolved').length,
    }
  }

  const counts = getAlertCounts()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Alerts Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Monitor and manage all system alerts and notifications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Total Alerts</dt>
                    <dd className="text-lg font-medium text-gray-900">{counts.total}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Active</dt>
                    <dd className="text-lg font-medium text-gray-900">{counts.active}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                    <dd className="text-lg font-medium text-gray-900">{counts.pending}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">Resolved</dt>
                    <dd className="text-lg font-medium text-gray-900">{counts.resolved}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white shadow rounded-lg mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
              
              {/* Filter */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by Status:</label>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All ({counts.total})</option>
                  <option value="active">Active ({counts.active})</option>
                  <option value="pending">Pending ({counts.pending})</option>
                  <option value="resolved">Resolved ({counts.resolved})</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Sort by:</label>
                <select
                  value={`${sortBy}-${sortOrder}`}
                  onChange={(e) => {
                    const [field, order] = e.target.value.split('-')
                    setSortBy(field as any)
                    setSortOrder(order as any)
                  }}
                  className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="timestamp-desc">Newest First</option>
                  <option value="timestamp-asc">Oldest First</option>
                  <option value="title-asc">Title A-Z</option>
                  <option value="title-desc">Title Z-A</option>
                  <option value="status-asc">Status A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Alerts Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedAlerts.map((alert) => (
                  <tr key={alert.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{alert.title}</div>
                        {alert.description && (
                          <div className="text-sm text-gray-500 mt-1">{alert.description}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(alert.status)}`}>
                        <span className="mr-1">{getStatusIcon(alert.status)}</span>
                        {alert.status.charAt(0).toUpperCase() + alert.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(alert.timestamp)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {alert.status !== 'resolved' && (
                          <button
                            onClick={() => handleResolve(alert.id)}
                            className="text-green-600 hover:text-green-900 px-2 py-1 rounded text-xs bg-green-50 hover:bg-green-100"
                          >
                            Resolve
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(alert.id)}
                          className="text-red-600 hover:text-red-900 px-2 py-1 rounded text-xs bg-red-50 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {sortedAlerts.length === 0 && (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No alerts found</h3>
              <p className="mt-1 text-sm text-gray-500">
                No alerts match the selected filter criteria.
              </p>
            </div>
          )}
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Navigate to:
            <a href="/dashboard" className="text-blue-600 hover:underline ml-2">Dashboard</a> | 
            <a href="/user" className="text-blue-600 hover:underline ml-2">Profile</a> |
            <a href="/destinations" className="text-blue-600 hover:underline ml-2">Destinations</a>
          </p>
        </div>
      </div>
    </div>
  )
}