"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter, usePathname } from 'next/navigation';
import { 
  ChevronRightIcon, 
  ChevronLeftIcon,
  HomeIcon,
  RocketIcon,
  PersonIcon,
  GearIcon,
  ExitIcon,
  IdCardIcon,
  HamburgerMenuIcon,
  Cross1Icon
} from "@radix-ui/react-icons";
import { toast } from "react-hot-toast";
import { useLocalStorage } from "@/hooks/useLocalStorage";

interface SidebarProps {
  children: React.ReactNode;
}

/**
 * Navigation item structure
 */
interface NavItem {
  path: string;
  icon: JSX.Element;
  text: string;
  ariaLabel?: string;
}

/**
 * EntrepreneurSidebar Component
 * Provides navigation and layout for entrepreneur users
 */
export default function EntrepreneurSidebar({ children }: SidebarProps) {
  // State for mobile sidebar visibility
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  
  // Persist collapsed state in localStorage
  const [isCollapsed, setIsCollapsed] = useLocalStorage('entrepreneur-sidebar-collapsed', false);
  
  const router = useRouter();
  const pathname = usePathname();
  
  // Handle client-side hydration
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  /**
   * Close sidebar when navigating on mobile
   */
  useEffect(() => {
    if (isMobileOpen) {
      setIsMobileOpen(false);
    }
  }, [pathname]);

  /**
   * Close sidebar when ESC key is pressed
   */
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileOpen) {
        setIsMobileOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isMobileOpen]);

  /**
   * Toggle mobile sidebar visibility
   */
  const toggleMobileSidebar = useCallback(() => {
    setIsMobileOpen(prev => !prev);
  }, []);

  /**
   * Toggle sidebar collapsed state
   */
  const toggleCollapse = useCallback(() => {
    setIsCollapsed(prev => !prev);
  }, [setIsCollapsed]);

  /**
   * Handle logout with confirmation
   */
  const handleLogout = useCallback(() => {
    if (window.confirm('Are you sure you want to log out?')) {
      try {
        // Clear all auth-related data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.clear();
        
        // Show success message
        toast.success('Logged out successfully');
        
        // Redirect to sign in page
        router.push('/auth/signin');
      } catch (error) {
        console.error('Logout error:', error);
        toast.error('Error logging out. Please try again.');
      }
    }
  }, [router]);

  // Wait for client-side hydration to avoid hydration mismatch
  if (!isMounted) {
    return null;
  }

  /**
   * Generate CSS class for navigation links
   */
  const linkClass = (path: string) => `
    flex items-center p-3 rounded-lg transition-all duration-200
    ${pathname === path 
      ? 'bg-indigo-600 text-white font-medium shadow-sm' 
      : 'hover:bg-gray-100 text-gray-700'
    }
    ${isCollapsed ? 'justify-center' : 'justify-start'}
    focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50
  `;

  /**
   * Navigation items configuration
   */
  const navItems: NavItem[] = [
    { 
      path: '/entrepreneur/home', 
      icon: <HomeIcon className="w-5 h-5" />, 
      text: 'Home',
      ariaLabel: 'Go to Home page' 
    },
    { 
      path: '/entrepreneur/profile', 
      icon: <IdCardIcon className="w-5 h-5" />, 
      text: 'Profile',
      ariaLabel: 'Go to Profile page' 
    },
    { 
      path: '/entrepreneur/startups', 
      icon: <RocketIcon className="w-5 h-5" />, 
      text: 'Startups',
      ariaLabel: 'Manage your Startups' 
    },
    { 
      path: '/entrepreneur/investors', 
      icon: <PersonIcon className="w-5 h-5" />, 
      text: 'Investors',
      ariaLabel: 'View potential Investors' 
    },
    { 
      path: '/entrepreneur/settings', 
      icon: <GearIcon className="w-5 h-5" />, 
      text: 'Settings',
      ariaLabel: 'Account Settings' 
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Backdrop for mobile - click to close */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={toggleMobileSidebar}
          aria-hidden="true"
          data-testid="sidebar-backdrop"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full flex flex-col overflow-x-hidden ${
          isCollapsed ? 'w-20' : 'w-72'
        } bg-white border-r border-gray-200 shadow-lg transform transition-all duration-300 ease-in-out ${
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0 z-50`}
        aria-label="Entrepreneur navigation"
        role="navigation"
        data-testid="entrepreneur-sidebar"
      >
        {/* Logo and Toggle Section */}
        <div className="h-16 border-b border-gray-200 flex items-center justify-between relative">
          <div className="flex items-center pl-4 sidebar-logo">
            <Link 
              href="/entrepreneur/home" 
              className="flex items-center focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50 rounded-md"
              aria-label="Go to Entrepreneur Dashboard"
            >
              <div className="flex-shrink-0">
                <Image
                  src="/logo.png"
                  alt=""
                  width={36}
                  height={36}
                  className="w-9 h-9"
                  aria-hidden="true"
                />
              </div>
              <span className={`text-xl font-bold whitespace-nowrap ml-3 text-gray-900 ${
                isCollapsed ? 'hidden' : 'block'
              }`}>
                StartNet
              </span>
            </Link>
          </div>
          
          {/* Desktop Collapse Toggle */}
          <div className="sidebar-toggle">
            <button
              type="button"
              onClick={toggleCollapse}
              className="hidden lg:flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors absolute right-2 mr-1"
              aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              data-testid="collapse-toggle"
            >
              {isCollapsed ? (
                <ChevronRightIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
              ) : (
                <ChevronLeftIcon className="w-5 h-5 text-gray-500" aria-hidden="true" />
              )}
            </button>
          </div>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={toggleMobileSidebar}
            className="lg:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 transition-colors absolute right-2"
            aria-label="Close sidebar"
            title="Close sidebar"
            data-testid="mobile-close-button"
          >
            <Cross1Icon className="w-5 h-5 text-gray-500" aria-hidden="true" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 overflow-y-auto scrollbar-thin" aria-label="Entrepreneur menu">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path} 
                  className={linkClass(item.path)}
                  aria-label={item.ariaLabel}
                  aria-current={pathname === item.path ? "page" : undefined}
                  title={isCollapsed ? item.text : undefined}
                  data-testid={`nav-link-${item.text.toLowerCase()}`}
                >
                  <span className="flex-shrink-0" aria-hidden="true">{item.icon}</span>
                  <span className={`transition-all duration-300 ${
                    isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100 w-auto ml-3'
                  }`}>
                    {item.text}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Info Section */}
        <div className={`p-3 ${isCollapsed ? 'hidden' : 'block'}`}>
          <div className="space-y-1">
            <p className="text-xs uppercase text-gray-500 tracking-wider font-medium">
              Account
            </p>
            <div className="flex items-center space-x-3 rounded-lg p-2 bg-gray-50">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                {/* Show first letter of user's name or default */}
                <span className="text-sm font-medium">E</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Entrepreneur
                </p>
                <p className="text-xs text-gray-500 truncate">
                  entrepreneur@example.com
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logout Button */}
        <div className="mt-auto p-3 border-t border-gray-200">
          <button
            type="button"
            onClick={handleLogout}
            className={`w-full flex items-center justify-center rounded-lg bg-red-500 p-3 text-sm font-semibold text-white hover:bg-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-700 focus:ring-opacity-50 ${
              isCollapsed ? 'px-2' : 'px-4'
            }`}
            aria-label="Logout from your account"
            data-testid="logout-button"
          >
            <ExitIcon className="w-5 h-5 flex-shrink-0" aria-hidden="true" />
            <span className={`transition-all duration-300 ${
              isCollapsed ? 'opacity-0 w-0 absolute' : 'opacity-100 w-auto ml-2'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        type="button"
        onClick={toggleMobileSidebar}
        className="fixed top-4 left-4 p-3 bg-white rounded-lg border border-gray-200 shadow-lg lg:hidden z-50 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-opacity-50"
        aria-label={isMobileOpen ? "Close sidebar menu" : "Open sidebar menu"}
        aria-expanded={isMobileOpen}
        aria-controls="entrepreneur-sidebar"
        data-testid="mobile-menu-button"
      >
        {isMobileOpen ? (
          <ChevronLeftIcon className="w-5 h-5" aria-hidden="true" />
        ) : (
          <HamburgerMenuIcon className="w-5 h-5" aria-hidden="true" />
        )}
      </button>

      {/* Main Content */}
      <main 
        className={`flex-1 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-72'
        } w-full`}
        id="main-content"
        role="main"
      >
        {/* This prevents content from being hidden behind the mobile menu button */}
        <div className="pt-12 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}