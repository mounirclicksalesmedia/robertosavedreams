'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import Image from 'next/image';
import clsx from 'clsx';

interface SidebarLinkProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  isActive: boolean;
  isSubItem?: boolean;
  onClick?: () => void;
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  text: string;
  subItems?: {
    href: string;
    text: string;
  }[];
}

// SidebarLink component
const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon, text, isActive, isSubItem = false, onClick }) => {
  return (
    <Link
      href={href}
      className={clsx(
        'flex items-center gap-2 px-3 py-2 rounded-md transition-colors',
        isActive
          ? 'bg-[#1D942C] text-white'
          : isSubItem
          ? 'text-gray-700 hover:bg-gray-100'
          : 'text-gray-700 hover:bg-gray-100',
        isSubItem && 'pl-10 text-sm'
      )}
      onClick={onClick}
    >
      {!isSubItem && <div className="w-5 h-5">{icon}</div>}
      <span>{text}</span>
    </Link>
  );
};

// Dashboard Header with Avatar dropdown
const DashboardHeader = () => {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    signOut({
      redirect: true,
      callbackUrl: '/signin'
    });
  };

  return (
    <header className="bg-white border-b border-gray-200 py-3 px-6 flex items-center justify-between sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>
      
      <div className="relative" ref={dropdownRef}>
        <button 
          className="flex items-center space-x-2 focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-700">{session?.user?.name || 'Admin User'}</p>
            <p className="text-xs text-gray-500">{session?.user?.email || 'admin@example.com'}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1D942C] flex items-center justify-center text-white font-medium overflow-hidden">
            {session?.user && 'image' in session.user && session.user.image ? (
              <Image 
                src={session.user.image as string} 
                alt="Profile" 
                width={40} 
                height={40}
                className="object-cover"
              />
            ) : (
              session?.user?.name?.charAt(0) || 'A'
            )}
          </div>
          <svg 
            className={`w-4 h-4 text-gray-500 transition-transform ${isDropdownOpen ? 'transform rotate-180' : ''}`}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
            <Link 
              href="/dashboard/profile" 
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Profile Settings
            </Link>
            <Link 
              href="/api/auth/signout?callbackUrl=/signin"
              className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              onClick={() => setIsDropdownOpen(false)}
            >
              Sign Out
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

// Dashboard Layout
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({
    website: true, // Default expanded
    loans: true, // Add loans to default expanded items
  });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Sidebar items with their sub-items
  const sidebarItems: SidebarItemProps[] = [
    {
      href: '/dashboard/overview',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
        </svg>
      ),
      text: 'Overview',
    },
    {
      href: '/dashboard/loanapplications',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
      text: 'Loans',
      subItems: [
        { href: '/dashboard/loanapplications', text: 'Loan Applications' },
        { href: '/dashboard/investments', text: 'Investment Applications' },
      ],
    },
    {
      href: '/dashboard/contact',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
        </svg>
      ),
      text: 'Contact',
    },
    {
      href: '/dashboard/webiste',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      ),
      text: 'Website',
      subItems: [
        { href: '/dashboard/webiste/home', text: 'Home' },
        { href: '/dashboard/webiste/about', text: 'About' },
        { href: '/dashboard/webiste/programs', text: 'Programs' },
        { href: '/dashboard/webiste/gallery', text: 'Gallery' },
        { href: '/dashboard/webiste/get-involved', text: 'Get Involved' },
        { href: '/dashboard/webiste/successstories', text: 'Success Stories' },
        { href: '/dashboard/webiste/grant', text: 'Grants' },
        { href: '/dashboard/webiste/donate', text: 'Donate' },
      ],
    },
    {
      href: '/dashboard/settings',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      text: 'Settings',
    },
  ];

  // Toggle expanded state for sidebar items with sub-items
  const toggleExpanded = (itemText: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemText.toLowerCase()]: !prev[itemText.toLowerCase()],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 rounded-md bg-white shadow-md text-gray-600"
        >
          <svg
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMobileSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <aside
          className={clsx(
            'fixed inset-y-0 left-0 bg-white w-64 border-r border-gray-200 transform transition-transform duration-200 ease-in-out z-40',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          )}
        >
          <div className="p-6">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/logo.png" alt="Logo" width={40} height={40} />
              <span className="text-xl font-bold">Roberto Save Dreams</span>
            </Link>
          </div>

          <nav className="mt-6 px-3 space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.href}>
                <SidebarLink
                  href={item.subItems ? '#' : item.href}
                  icon={item.icon}
                  text={item.text}
                  isActive={pathname === item.href}
                  onClick={item.subItems ? () => toggleExpanded(item.text) : undefined}
                />
                {item.subItems && expandedItems[item.text.toLowerCase()] && (
                  <div className="mt-1 space-y-1">
                    {item.subItems.map((subItem) => (
                      <SidebarLink
                        key={subItem.href}
                        href={subItem.href}
                        icon={null}
                        text={subItem.text}
                        isActive={pathname === subItem.href}
                        isSubItem={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <div className="flex-1 md:ml-64">
          {/* Dashboard header */}
          <DashboardHeader />
          
          {/* Main content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-600 bg-opacity-75 z-30 md:hidden" 
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
    </div>
  );
} 