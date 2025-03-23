'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow } from 'date-fns';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function ContactPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState<boolean>(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<{
    type: 'success' | 'error';
    message: string;
    visible: boolean;
  } | null>(null);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('page', pagination.page.toString());
      queryParams.append('limit', pagination.limit.toString());
      if (statusFilter) {
        queryParams.append('status', statusFilter);
      }

      const response = await fetch(`/api/contact?${queryParams.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data.contacts);
        setPagination(data.data.pagination);
      } else {
        showToast('error', data.message || 'Failed to fetch contact messages');
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      showToast('error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [pagination.page, statusFilter]);

  const showToast = (type: 'success' | 'error', message: string) => {
    setToastMessage({ type, message, visible: true });
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleStatusChange = async (contactId: string, newStatus: string) => {
    setActionLoading(true);
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('success', 'Contact status updated successfully');
        
        // Update contacts list
        setContacts((prevContacts) =>
          prevContacts.map((contact) =>
            contact.id === contactId ? { ...contact, status: newStatus } : contact
          )
        );
      } else {
        showToast('error', data.message || 'Failed to update contact status');
      }
    } catch (error) {
      console.error('Error updating contact status:', error);
      showToast('error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteContact = async () => {
    if (!selectedContact) return;
    
    setActionLoading(true);
    try {
      const response = await fetch(`/api/contact/${selectedContact.id}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (data.success) {
        showToast('success', 'Contact message deleted successfully');
        
        // Update contacts list
        setContacts((prevContacts) =>
          prevContacts.filter((contact) => contact.id !== selectedContact.id)
        );
        
        setDeleteDialogOpen(false);
        setPagination((prev) => ({
          ...prev,
          total: prev.total - 1,
        }));
      } else {
        showToast('error', data.message || 'Failed to delete contact message');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      showToast('error', 'An unexpected error occurred. Please try again later.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewContact = async (contact: Contact) => {
    setSelectedContact(contact);
    setViewDialogOpen(true);
    
    // If the contact is unread, mark it as read
    if (contact.status === 'UNREAD') {
      handleStatusChange(contact.id, 'READ');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'UNREAD':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-500 text-white">Unread</span>;
      case 'READ':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-500 text-white">Read</span>;
      case 'REPLIED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-500 text-white">Replied</span>;
      case 'ARCHIVED':
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-500 text-white">Archived</span>;
      default:
        return <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-200 text-gray-800">{status}</span>;
    }
  };

  return (
    <div className="w-full">
      {/* Toast Messages */}
      {toastMessage && (
        <div 
          className={`fixed top-4 right-4 p-4 rounded-md shadow-lg z-50 ${
            toastMessage.type === 'success' ? 'bg-green-500' : 'bg-red-500'
          } text-white`}
        >
          {toastMessage.message}
        </div>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg border shadow-sm mb-8">
        <div className="p-6 flex flex-col md:flex-row md:items-center md:justify-between border-b">
          <h3 className="text-2xl font-semibold leading-none tracking-tight mb-4 md:mb-0">
            Contact Messages
          </h3>
          <div className="flex items-center">
            <div className="relative">
              <select 
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="w-full md:w-[180px] px-4 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">All Statuses</option>
                <option value="UNREAD">Unread</option>
                <option value="READ">Read</option>
                <option value="REPLIED">Replied</option>
                <option value="ARCHIVED">Archived</option>
              </select>
            </div>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700"></div>
            </div>
          ) : contacts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No contact messages found
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b">
                      <th className="px-4 py-3 font-medium">Name</th>
                      <th className="px-4 py-3 font-medium">Email</th>
                      <th className="px-4 py-3 font-medium">Subject</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium">Date</th>
                      <th className="px-4 py-3 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{contact.name}</td>
                        <td className="px-4 py-3">{contact.email}</td>
                        <td className="px-4 py-3 max-w-[200px] truncate">
                          {contact.subject}
                        </td>
                        <td className="px-4 py-3">{getStatusBadge(contact.status)}</td>
                        <td className="px-4 py-3">
                          {formatDistanceToNow(new Date(contact.createdAt), { addSuffix: true })}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewContact(contact)}
                              className="p-2 rounded-md border hover:bg-gray-100"
                              aria-label="View contact"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                            </button>
                            <button
                              onClick={() => {
                                setSelectedContact(contact);
                                setDeleteDialogOpen(true);
                              }}
                              className="p-2 rounded-md border text-red-500 hover:bg-red-50"
                              aria-label="Delete contact"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-4 w-4">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {pagination.pages > 1 && (
                <div className="flex justify-center mt-6">
                  <nav className="flex items-center">
                    {pagination.page > 1 && (
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page - 1,
                          }))
                        }
                        className="mx-1 px-3 py-1 rounded-md border hover:bg-gray-100"
                      >
                        Previous
                      </button>
                    )}
                    {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page,
                          }))
                        }
                        className={`mx-1 px-3 py-1 rounded-md ${
                          page === pagination.page
                            ? 'bg-green-600 text-white'
                            : 'border hover:bg-gray-100'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                    {pagination.page < pagination.pages && (
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            page: prev.page + 1,
                          }))
                        }
                        className="mx-1 px-3 py-1 rounded-md border hover:bg-gray-100"
                      >
                        Next
                      </button>
                    )}
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* View Contact Dialog */}
      {viewDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Contact Message Details</h2>
            </div>
            {selectedContact && (
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Name</p>
                    <p>{selectedContact.name}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-500">Email</p>
                    <p>{selectedContact.email}</p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-500">Subject</p>
                  <p>{selectedContact.subject}</p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-500">Message</p>
                  <div className="p-4 bg-gray-50 rounded-md whitespace-pre-wrap">
                    {selectedContact.message}
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-500">Received</p>
                  <p>
                    {new Date(selectedContact.createdAt).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-500">Status</p>
                  <select
                    value={selectedContact.status}
                    onChange={(e) => handleStatusChange(selectedContact.id, e.target.value)}
                    disabled={actionLoading}
                    className="mt-1 w-full md:w-[180px] px-3 py-2 bg-white border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="UNREAD">Unread</option>
                    <option value="READ">Read</option>
                    <option value="REPLIED">Replied</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>
            )}
            <div className="p-6 bg-gray-50 flex justify-end">
              <button
                onClick={() => setViewDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">Confirm Deletion</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete this contact message? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setDeleteDialogOpen(false)}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteContact}
                  disabled={actionLoading}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md text-white disabled:opacity-50 flex items-center"
                >
                  {actionLoading ? (
                    <>
                      <svg className="animate-spin mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    'Delete'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
