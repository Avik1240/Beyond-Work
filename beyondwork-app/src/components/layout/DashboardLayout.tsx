'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from '@/lib/firebase/auth';
import { useAuthStore } from '@/lib/stores/auth-store';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Events', href: '/events' },
  { label: 'Communities', href: '/communities' },
  { label: 'Leaderboard', href: '/leaderboard' },
  { label: 'Bookings', href: '/bookings' },
  { label: 'Facilities', href: '/facilities' },
];

const CORPORATE_NAV: NavItem[] = [
  { label: 'Corporate', href: '/corporate' },
  { label: 'Employees', href: '/corporate/employees' },
  { label: 'Events', href: '/corporate/events' },
  { label: 'Leaderboard', href: '/corporate/leaderboard' },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
}

/**
 * DashboardLayout - Sidebar navigation for authenticated pages
 * Provides consistent navigation and user context
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { userProfile } = useAuthStore();
  
  const isCorporateAdmin = userProfile?.role === 'CORPORATE_ADMIN';
  const isCorporatePage = pathname?.startsWith('/corporate');

  const handleLogout = async () => {
    await signOut();
    router.push('/');
  };

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href;
    return (
      <Link
        href={item.href}
        className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
          isActive
            ? 'bg-accent/10 text-accent border border-accent/20'
            : 'text-text-secondary hover:bg-background-subtle hover:text-text-primary'
        }`}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className="w-64 bg-background-card border-r border-border flex flex-col">
        {/* Logo / Brand */}
        <div className="p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-text-primary">ByondWork</h2>
          <p className="text-xs text-text-secondary mt-1">Sports & Wellness</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {/* Main Navigation */}
          <div className="mb-6">
            {NAV_ITEMS.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Corporate Admin Section */}
          {isCorporateAdmin && (
            <div className="pt-6 border-t border-border">
              <p className="px-4 py-2 text-xs font-semibold text-text-secondary uppercase tracking-wider">
                Corporate Admin
              </p>
              {CORPORATE_NAV.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </div>
          )}
        </nav>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 mb-3 px-2">
            <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center">
              <span className="text-accent font-medium text-sm">
                {userProfile?.name?.[0] || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                {userProfile?.name || 'User'}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {userProfile?.email}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn-secondary text-sm"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-content mx-auto px-8 py-6">
          {/* Corporate Admin Visual Indicator */}
          {isCorporatePage && (
            <div className="mb-6 px-4 py-2.5 bg-accent/10 border border-accent/20 rounded-lg">
              <p className="text-sm text-text-primary">
                <span className="font-semibold text-accent">Corporate Admin Mode</span> — Managing company resources
              </p>
            </div>
          )}
          
          {children}
        </div>
      </main>
    </div>
  );
}
