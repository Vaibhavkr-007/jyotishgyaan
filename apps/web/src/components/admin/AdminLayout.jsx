
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { 
  LayoutDashboard, CalendarDays, CreditCard, Users, 
  Clock, Tag, Calendar, Settings, LogOut, Menu, X, Sparkles,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const navItems = [
  // { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Bookings', path: '/admin/bookings', icon: CalendarDays },
  // { name: 'Payments', path: '/admin/payments', icon: CreditCard },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Availability', path: '/admin/availability', icon: Clock },
  // { name: 'Pricing', path: '/admin/pricing', icon: Tag },
  // { name: 'Calendar', path: '/admin/calendar', icon: Calendar },
  { name: 'Settings', path: '/admin/settings', icon: Settings },
];

const AdminLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { admin, logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Handle responsive sidebar state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true);
      } else if (window.innerWidth >= 1024) {
        setSidebarCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-admin-background flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Mobile Header (Visible only on < 768px) */}
      <div className="md:hidden bg-admin-card border-b border-admin-border p-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2 text-admin-primary font-bold text-xl">
          <Sparkles className="w-6 h-6" />
          <span>Admin</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="h-10 w-10"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </Button>
      </div>

      {/* Sidebar (Desktop & Tablet) */}
      <aside className={`
        fixed md:sticky top-0 left-0 z-40 h-[100dvh] bg-admin-card border-r border-admin-border
        transition-all duration-300 ease-in-out flex flex-col shadow-lg md:shadow-none
        ${mobileMenuOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0'}
        ${sidebarCollapsed && !mobileMenuOpen ? 'md:w-20' : 'md:w-64'}
      `}>
        <div className={`p-6 flex items-center border-b border-admin-border h-16 shrink-0
          ${sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-0' : 'justify-between gap-2'}
        `}>
          <div className="flex items-center gap-2 text-admin-primary font-bold text-xl overflow-hidden">
            <Sparkles className="w-6 h-6 shrink-0" />
            {(!sidebarCollapsed || mobileMenuOpen) && <span className="whitespace-nowrap">Divya Admin</span>}
          </div>
          
          {/* Desktop Collapse Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden md:flex h-8 w-8 shrink-0 text-admin-muted-foreground hover:text-admin-foreground"
          >
            {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={sidebarCollapsed && !mobileMenuOpen ? item.name : undefined}
                className={`flex items-center rounded-lg transition-colors min-h-[44px]
                  ${sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-0' : 'gap-3 px-3'}
                  ${isActive 
                    ? 'bg-admin-primary text-admin-primary-foreground font-medium shadow-sm' 
                    : 'text-admin-muted-foreground hover:bg-admin-muted hover:text-admin-foreground'
                }`}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {(!sidebarCollapsed || mobileMenuOpen) && (
                  <span className="whitespace-nowrap">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-admin-border shrink-0">
          <Button 
            variant="ghost" 
            className={`w-full min-h-[44px] text-admin-danger hover:text-admin-danger hover:bg-admin-danger/10
              ${sidebarCollapsed && !mobileMenuOpen ? 'justify-center px-0' : 'justify-start'}
            `}
            onClick={handleLogout}
            title={sidebarCollapsed && !mobileMenuOpen ? "Logout" : undefined}
          >
            <LogOut className={`w-5 h-5 shrink-0 ${(!sidebarCollapsed || mobileMenuOpen) ? 'mr-3' : ''}`} />
            {(!sidebarCollapsed || mobileMenuOpen) && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-[100dvh] overflow-hidden relative">
        {/* Desktop Header */}
        <header className="hidden md:flex h-16 bg-admin-card border-b border-admin-border items-center justify-end px-6 lg:px-8 sticky top-0 z-30 shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-admin-border">
                  <AvatarFallback className="bg-admin-primary/10 text-admin-primary font-medium">AD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">Administrator</p>
                  <p className="text-xs leading-none text-admin-muted-foreground">
                    {admin?.email || 'admin@astrology.com'}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/admin/settings" className="cursor-pointer">Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-admin-danger cursor-pointer">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </div>
      </main>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 md:hidden transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};

export default AdminLayout;
