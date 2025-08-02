'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { UserMetadata } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const supabase = createClient();
  const [claims, setClaims] = useState<UserMetadata | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchClaims = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        setError(error.message);
      } else {
        console.log(data);
        setClaims(data?.session?.user?.user_metadata || null);
        setFormData(prev => ({
          name: `${data?.session?.user?.user_metadata?.name} ${data?.session?.user?.user_metadata?.surname}` || 'John Doe',
          email: data?.session?.user?.user_metadata?.email || 'john@example.com',
          password: '',
          notificationThreshold: 5,
          emailNotifications: true
        }));
        setError(null);
      }
    };

    fetchClaims();
  }, [supabase]);

  const router = useRouter();
  
  const [formData, setFormData] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    password: '',
    notificationThreshold: 5,
    emailNotifications: true
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    // TODO: Add API call to save profile
    setTimeout(() => {
      setMessage('Profile updated successfully!')
      setLoading(false)
      // Clear password field after save
      setFormData(prev => ({ ...prev, password: '' }))
    }, 1000)
  }

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">User Profile & Preferences</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-600">
            Manage your account settings and notification preferences
          </p>
        </div>

        {/* Success Message */}
        {message && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-md p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Profile Form */}
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSave}>
            <div className="px-4 sm:px-6 py-4 sm:py-6 space-y-6">
              
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  
                  {/* Name Field */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* Email Field */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Security
                </h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  
                  {/* Password Field */}
                  <div className="sm:col-span-2">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      New Password
                    </label>
                    <p className="text-sm text-gray-500 mb-2">
                      Leave blank to keep your current password
                    </p>
                    <input
                      type="password"
                      id="password"
                      value={formData.password}
                      onChange={(e) => handleInputChange('password', e.target.value)}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter new password"
                    />
                  </div>
                </div>
              </div>

              {/* Preferences Section */}
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Notification Preferences
                </h3>
                <div className="space-y-6">
                  
                  {/* Notification Threshold */}
                  <div>
                    <label htmlFor="threshold" className="block text-sm font-medium text-gray-700">
                      Alert Notification Threshold
                    </label>
                    <p className="text-sm text-gray-500 mb-2">
                      Number of alerts before sending notification (1-20)
                    </p>
                    <div className="mt-1 flex items-center space-x-3">
                      <input
                        type="range"
                        id="threshold"
                        min="1"
                        max="20"
                        value={formData.notificationThreshold}
                        onChange={(e) => handleInputChange('notificationThreshold', parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <span className="text-sm font-medium text-gray-900 bg-gray-100 px-3 py-1 rounded-md min-w-[3rem] text-center">
                        {formData.notificationThreshold}
                      </span>
                    </div>
                  </div>

                  {/* Email Notifications Toggle */}
                  <div className="flex items-center justify-between">
                    <div>
                      <label htmlFor="email-notifications" className="text-sm font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-sm text-gray-500">
                        Receive alerts and updates via email
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleInputChange('emailNotifications', !formData.emailNotifications)}
                      className={`${
                        formData.emailNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                    >
                      <span
                        className={`${
                          formData.emailNotifications ? 'translate-x-5' : 'translate-x-0'
                        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-200 rounded-b-lg">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
                <p className="text-sm text-gray-500">
                  Changes will be saved to your account
                </p>
                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                  <button
                    type="button"
                    className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => {router.push('/home')}}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="spinner mr-2"></div>
                        Saving...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Navigation Links */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Navigate to: 
            <a href="/dashboard" className="text-blue-600 hover:underline ml-2">Dashboard</a> | 
            <a href="/home" className="text-blue-600 hover:underline ml-2">Home</a> |
            <a href="/destinations" className="text-blue-600 hover:underline ml-2">Destinations</a>
          </p>
        </div>
      </div>
    </div>
  )
}