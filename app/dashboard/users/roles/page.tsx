'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Link from 'next/link';

// Define available roles and their permissions
const ROLES_AND_ACCESS = {
  ADMIN: {
    name: 'Administrator',
    description: 'Full access to all features and settings',
    access: ['Overview', 'Loans', 'Grants', 'Investments', 'Contact', 'Website', 'User Management', 'Settings']
  },
  MANAGER: {
    name: 'Manager',
    description: 'Can manage most content and applications',
    access: ['Overview', 'Loans', 'Grants', 'Investments', 'Contact', 'Website']
  },
  STAFF: {
    name: 'Staff',
    description: 'Limited access to handle basic tasks',
    access: ['Overview', 'Contact', 'Website']
  },
  USER: {
    name: 'User',
    description: 'Basic user with minimal access',
    access: []
  },
  INVESTOR: {
    name: 'Investor',
    description: 'Access to investment opportunities only',
    access: ['Overview', 'Investments']
  },
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function RolesPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const { data: session, status } = useSession();
  const router = useRouter();

  // Check if user is admin
  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [session, status, router]);

  // Fetch users
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        
        // Fetch users
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          throw new Error('Failed to fetch users');
        }
        const usersData = await usersResponse.json();
        
        setUsers(usersData.users);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (status === 'authenticated' && session?.user?.role === 'ADMIN') {
      fetchData();
    }
  }, [status, session]);

  // Handle user selection
  const handleUserSelect = (userId: string) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(userId);
    
    if (user) {
      setSelectedRole(user.role);
    } else {
      setSelectedRole('');
    }
  };

  // Save user role
  const saveUserRole = async () => {
    if (!selectedUser || !selectedRole) return;
    
    try {
      setIsSaving(true);
      setSaveMessage('');
      
      const response = await fetch(`/api/users/${selectedUser}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: selectedRole }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update role');
      }
      
      // Update local state
      setUsers(prev => 
        prev.map(user => {
          if (user.id === selectedUser) {
            return {
              ...user,
              role: selectedRole
            };
          }
          return user;
        })
      );
      
      setSaveMessage('Role updated successfully!');
    } catch (err) {
      console.error('Error saving role:', err);
      setSaveMessage(err instanceof Error ? `Failed to update role: ${err.message}` : 'Failed to update role. Please try again.');
    } finally {
      setIsSaving(false);
      
      // Clear message after 3 seconds
      setTimeout(() => {
        setSaveMessage('');
      }, 3000);
    }
  };

  if (status === 'loading' || (status === 'authenticated' && session?.user?.role !== 'ADMIN')) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Roles & Access</h1>
        <Link href="/dashboard/users" className="text-green-600 hover:text-green-700 flex items-center gap-1">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
          Back to Users
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {saveMessage && (
        <div className={`${saveMessage.includes('Failed') ? 'bg-red-100 border border-red-400 text-red-700' : 'bg-green-100 border border-green-400 text-green-700'} px-4 py-3 rounded relative mb-4`} role="alert">
          <div className="flex items-center">
            {saveMessage.includes('Failed') ? (
              <svg className="h-5 w-5 mr-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            )}
            <span className="block sm:inline">{saveMessage}</span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User selection column */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Select User</h2>
          
          {isLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map(user => (
                <button
                  key={user.id}
                  onClick={() => handleUserSelect(user.id)}
                  className={`w-full text-left px-4 py-2 rounded-md ${selectedUser === user.id ? 'bg-green-50 border border-green-200' : 'hover:bg-gray-50'}`}
                >
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-gray-500">{user.email}</div>
                  <div className="mt-1">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 
                      user.role === 'MANAGER' ? 'bg-blue-100 text-blue-800' : 
                      user.role === 'STAFF' ? 'bg-green-100 text-green-800' : 
                      user.role === 'INVESTOR' ? 'bg-amber-100 text-amber-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Role assignment column */}
        <div className="md:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">User Role</h2>
          
          {!selectedUser ? (
            <div className="text-center py-8 text-gray-500">
              Select a user to manage their role
            </div>
          ) : (
            <>
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.keys(ROLES_AND_ACCESS).map(role => (
                    <div key={role} className="border rounded-lg p-4 hover:border-green-300">
                      <label className="flex items-start">
                        <input
                          type="radio"
                          name="role"
                          checked={selectedRole === role}
                          onChange={() => setSelectedRole(role)}
                          className="mt-1 h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300"
                        />
                        <div className="ml-2">
                          <div className="font-medium text-gray-700">
                            {ROLES_AND_ACCESS[role as keyof typeof ROLES_AND_ACCESS].name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {ROLES_AND_ACCESS[role as keyof typeof ROLES_AND_ACCESS].description}
                          </div>
                          <div className="mt-2">
                            <span className="text-xs font-semibold text-gray-500">Access to:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {ROLES_AND_ACCESS[role as keyof typeof ROLES_AND_ACCESS].access.map(item => (
                                <span key={item} className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-md">
                                  {item}
                                </span>
                              ))}
                              {ROLES_AND_ACCESS[role as keyof typeof ROLES_AND_ACCESS].access.length === 0 && (
                                <span className="text-xs text-gray-500">No dashboard access</span>
                              )}
                            </div>
                          </div>
                        </div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={saveUserRole}
                  disabled={isSaving}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Save Role
                    </>
                  )}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 