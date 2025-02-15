import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Logo from './Logo';
import {
  ChartBarIcon,
  FireIcon,
  WalletIcon,
  BellIcon,
  ChartPieIcon,
  UserGroupIcon,
  Cog6ToothIcon,
  ChevronRightIcon,
  LockClosedIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';
import { Transition } from '@headlessui/react';

interface LayoutProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  isAvailable?: boolean;
  isPremium?: boolean;
}

interface NavSection {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  items: NavItem[];
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [showComingSoon, setShowComingSoon] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Handle scroll effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set initial expanded section based on current route
  useEffect(() => {
    const currentSection = navSections.find(section =>
      section.items.some(item => item.href === router.pathname)
    );
    if (currentSection) {
      setExpandedSection(currentSection.id);
    }
  }, [router.pathname]);

  const navSections: NavSection[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: ChartBarIcon,
      items: [
        { href: '/', label: 'Overview', isAvailable: true },
        { href: '/analytics', label: 'Analytics', isAvailable: false, isPremium: true },
        { href: '/performance', label: 'Performance', isAvailable: false },
      ]
    },
    {
      id: 'market',
      label: 'Market Insights',
      icon: ChartPieIcon,
      items: [
        { href: '/trending', label: 'Trending', isAvailable: true },
        { href: '/discover', label: 'Discover', isAvailable: false, isPremium: true },
        { href: '/watchlist', label: 'Watchlist', isAvailable: false },
      ]
    },
    {
      id: 'wallet',
      label: 'Wallet Tracking',
      icon: WalletIcon,
      items: [
        { href: '/wallet', label: 'Wallet Tracker', isAvailable: true },
        { href: '/portfolio', label: 'Portfolio', isAvailable: false, isPremium: true },
        { href: '/transactions', label: 'Transactions', isAvailable: false },
      ]
    },
    {
      id: 'social',
      label: 'Copy Trading',
      icon: UserGroupIcon,
      items: [
        { href: '/traders', label: 'Top Traders', isAvailable: true },
        { href: '/strategies', label: 'Strategies', isAvailable: false, isPremium: true },
        { href: '/signals', label: 'Signals', isAvailable: false, isPremium: true },
      ]
    },
    {
      id: 'alerts',
      label: 'Alerts & Notifications',
      icon: BellIcon,
      items: [
        { href: '/alerts', label: 'Price Alerts', isAvailable: false, isPremium: true },
        { href: '/notifications', label: 'Notifications', isAvailable: false },
        { href: '/watchlist-alerts', label: 'Watchlist Alerts', isAvailable: false, isPremium: true },
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Cog6ToothIcon,
      items: [
        { href: '/profile', label: 'Profile', isAvailable: true },
        { href: '/preferences', label: 'Preferences', isAvailable: true },
        { href: '/api-keys', label: 'API Keys', isAvailable: false, isPremium: true },
      ]
    },
  ];

  const handleNavigation = (item: NavItem, e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!item.isAvailable) {
      if (item.isPremium) {
        setShowComingSoon(`${item.label} - Premium Feature`);
      } else {
        setShowComingSoon(`${item.label} - Coming Soon`);
      }
      setTimeout(() => setShowComingSoon(null), 2000);
      return;
    }
    
    router.push(item.href);
  };

  const isActiveSection = (section: NavSection) => {
    return section.items.some(item => item.href === router.pathname);
  };

  const isActiveItem = (href: string) => {
    return router.pathname === href;
  };

  return (
    <div className="flex min-h-screen bg-primary text-text-primary relative overflow-hidden">
      {/* Premium Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-accent opacity-[0.07] rounded-full blur-[100px] animate-float"></div>
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-accent-light opacity-[0.05] rounded-full blur-[80px] animate-float" style={{ animationDelay: '-2s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-accent to-accent-light opacity-[0.03] rounded-full blur-[120px] animate-pulse-slow"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0" style={{
          backgroundImage: `
            linear-gradient(to right, rgba(139, 92, 246, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(139, 92, 246, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}></div>

        {/* Radial Gradient */}
        <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30"></div>
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 h-screen w-64 backdrop-blur-md z-50 transition-all duration-500 ${
        scrolled ? 'bg-secondary/40 shadow-xl shadow-accent/5' : 'bg-secondary/30'
      }`}>
        <div className="absolute inset-0 border-r border-border-color"></div>
        <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-accent/20 to-transparent"></div>

        {/* Logo Section with Enhanced Effects */}
        <div className="relative px-6 py-8 group">
          <div className="absolute inset-0 bg-gradient-to-r from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <Link href="/" className="flex items-center space-x-3 relative z-10">
            <Logo />
            <div className="relative">
              <span className="text-xl font-bold bg-gradient-primary text-transparent bg-clip-text">
                DataTrench
              </span>
              <div className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </Link>
        </div>

        {/* Enhanced Navigation */}
        <nav className="px-4 py-4 space-y-2 relative">
          {navSections.map((section) => (
            <div key={section.id} className="relative group">
              <button
                onClick={() => setExpandedSection(expandedSection === section.id ? null : section.id)}
                onMouseEnter={() => setHoveredItem(section.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-300 ${
                  expandedSection === section.id || isActiveSection(section)
                    ? 'bg-accent/10 text-accent shadow-lg shadow-accent/5' 
                    : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <section.icon className={`w-5 h-5 transition-transform duration-300 ${
                    (expandedSection === section.id || hoveredItem === section.id) 
                      ? 'scale-110 text-accent' 
                      : ''
                  }`} />
                  <span>{section.label}</span>
                </div>
                <ChevronRightIcon 
                  className={`w-4 h-4 transition-all duration-300 ${
                    expandedSection === section.id 
                      ? 'rotate-90 text-accent' 
                      : hoveredItem === section.id 
                        ? 'text-accent' 
                        : ''
                  }`}
                />
              </button>

              {/* Enhanced Submenu */}
              <Transition
                show={expandedSection === section.id}
                enter="transition-all duration-300 ease-out"
                enterFrom="opacity-0 max-h-0"
                enterTo="opacity-100 max-h-[500px]"
                leave="transition-all duration-200 ease-in"
                leaveFrom="opacity-100 max-h-[500px]"
                leaveTo="opacity-0 max-h-0"
                className="overflow-hidden"
              >
                <div className="px-4 py-2 space-y-1">
                  {section.items.map((item) => (
                    <a
                      key={item.href}
                      href={item.href}
                      onClick={(e) => handleNavigation(item, e)}
                      onMouseEnter={() => setHoveredItem(item.href)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`group flex items-center justify-between px-8 py-2 rounded-lg text-sm transition-all duration-300 relative overflow-hidden ${
                        isActiveItem(item.href) && item.isAvailable
                          ? 'bg-accent text-white shadow-lg shadow-accent/20'
                          : hoveredItem === item.href
                          ? 'bg-hover text-text-primary'
                          : 'text-text-secondary hover:text-text-primary hover:bg-hover'
                      }`}
                    >
                      <span className="relative z-10">{item.label}</span>
                      {!item.isAvailable && (
                        <div className="flex items-center space-x-2">
                          {item.isPremium && (
                            <SparklesIcon className={`w-4 h-4 transition-colors duration-300 ${
                              hoveredItem === item.href ? 'text-accent animate-pulse' : 'text-text-secondary'
                            }`} />
                          )}
                          <LockClosedIcon className={`w-4 h-4 transition-colors duration-300 ${
                            hoveredItem === item.href ? 'text-accent' : 'text-text-secondary'
                          }`} />
                        </div>
                      )}
                      
                      {/* Hover Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r from-accent/10 to-accent-light/10 transition-opacity duration-300 ${
                        hoveredItem === item.href ? 'opacity-100' : 'opacity-0'
                      }`} />
                    </a>
                  ))}
                </div>
              </Transition>
            </div>
          ))}
        </nav>

        {/* Enhanced Coming Soon Toast */}
        <Transition
          show={!!showComingSoon}
          enter="transition-all duration-300 ease-out"
          enterFrom="opacity-0 transform translate-y-2"
          enterTo="opacity-100 transform translate-y-0"
          leave="transition-all duration-200 ease-in"
          leaveFrom="opacity-100 transform translate-y-0"
          leaveTo="opacity-0 transform translate-y-2"
          className="absolute bottom-24 left-1/2 transform -translate-x-1/2 w-max z-50"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-20 blur-xl rounded-lg"></div>
            <div className="relative bg-secondary/90 text-text-primary px-6 py-3 rounded-lg shadow-xl backdrop-blur-sm border border-accent/20">
              <div className="flex items-center space-x-3">
                {showComingSoon?.includes('Premium') ? (
                  <SparklesIcon className="w-5 h-5 text-accent animate-pulse" />
                ) : (
                  <span className="text-accent animate-pulse">✨</span>
                )}
                <span className="text-sm font-medium">{showComingSoon}</span>
              </div>
            </div>
          </div>
        </Transition>

        {/* Enhanced Premium Badge */}
        <div className="absolute bottom-8 left-4 right-4">
          <div className="relative p-4 rounded-xl overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-10 group-hover:opacity-20 transition-opacity duration-500"></div>
            <div className="absolute inset-0 bg-gradient-radial from-accent/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="absolute inset-0 border border-accent/10 rounded-xl group-hover:border-accent/30 transition-colors duration-500"></div>
            <div className="relative z-10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-semibold text-accent">PREMIUM</span>
                  <span className="px-2 py-0.5 text-[10px] font-bold bg-accent/20 text-accent rounded-full">PRO</span>
                </div>
                <div className="w-2 h-2 rounded-full bg-accent animate-pulse"></div>
              </div>
              <p className="text-xs text-text-secondary">Unlock advanced features and real-time data</p>
              <div className="h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 ml-64">
        {/* Enhanced Social Links */}
        <div className="fixed top-8 right-8 flex items-center space-x-4 z-50">
          {/* Twitter/X Icon */}
          <a
            href="https://twitter.com/DataTrench"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-all duration-500 scale-0 group-hover:scale-100"></div>
            <div className="relative p-2 bg-secondary/30 hover:bg-secondary/50 rounded-lg backdrop-blur-sm border border-border-color transition-all duration-300 group-hover:border-accent/50 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20">
              <svg
                className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 rounded-lg transition-all duration-300"></div>
            </div>
          </a>

          {/* Telegram Icon */}
          <a
            href="https://t.me/DataTrench"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-accent to-accent-light opacity-0 group-hover:opacity-20 blur-xl rounded-full transition-all duration-500 scale-0 group-hover:scale-100"></div>
            <div className="relative p-2 bg-secondary/30 hover:bg-secondary/50 rounded-lg backdrop-blur-sm border border-border-color transition-all duration-300 group-hover:border-accent/50 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-accent/20">
              <svg
                className="w-5 h-5 text-text-secondary group-hover:text-accent transition-colors duration-300"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.51 2.78-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06-.01.13-.02.2z" />
              </svg>
              <div className="absolute inset-0 border border-accent/0 group-hover:border-accent/20 rounded-lg transition-all duration-300"></div>
            </div>
          </a>
        </div>

        {/* Enhanced Main Content Container */}
        <main className="min-h-screen relative">
          {/* Content Background Effects */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-radial from-accent/5 via-transparent to-transparent opacity-30"></div>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"></div>
          </div>

          {/* Content */}
          <div className="relative max-w-7xl mx-auto px-8 py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout; 