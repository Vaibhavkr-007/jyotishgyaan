import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { Menu, Sparkles, UserCircle, LayoutDashboard, LogOut } from 'lucide-react';
import BookingModal from './BookingModal.jsx';
import ProtectedActionButton from './ProtectedActionButton.jsx';
import { useAuth } from '@/hooks/useAuth.js';

const Header = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = React.useState(false);
  const { isAuthenticated, currentUser, logout } = useAuth();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/consultations', label: 'Consultations' },
    { path: '/astrology', label: 'Astrology' },
    { path: '/meditation', label: 'Meditation' },
    { path: '/reiki', label: 'Reiki Healing' },
    { path: '/tarot', label: 'Tarot Reading' },
    { path: '/awards', label: 'Awards' },
    { path: '/certificates', label: 'Certifications' },
    { path: '/blog', label: 'Blog' },
    { path: '/contact', label: 'Contact' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent hidden sm:inline-block">
              Jyotish Gyan
            </span>
          </Link>

          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-2 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-primary bg-accent/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <BookingModal
              trigger={
                <ProtectedActionButton className="hidden sm:flex" size="sm">
                  Book Consultation
                </ProtectedActionButton>
              }
            />

            {/* Auth section */}
            <div className="hidden sm:block">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2 ml-2 border-l border-border/40 pl-4">
                  <Button asChild variant="ghost" size="sm" className="hidden lg:flex">
                    <Link to="/login">Log in</Link>
                  </Button>
                  <Button asChild variant="secondary" size="sm">
                    <Link to="/signup">Sign up</Link>
                  </Button>
                </div>
              ) : (
                <div className="ml-2 border-l border-border/40 pl-4">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent/10">
                        <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold text-xs">
                          {currentUser?.name?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <span className="text-sm font-medium max-w-[100px] truncate">
                          {currentUser?.name?.split(' ')[0]}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 bg-card border-border/50">
                      <div className="p-2 px-3 pb-3">
                        <p className="font-medium text-sm text-card-foreground truncate">{currentUser?.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{currentUser?.email}</p>
                      </div>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/dashboard" className="w-full flex items-center">
                          <LayoutDashboard className="w-4 h-4 mr-2" /> Dashboard
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer">
                        <Link to="/profile" className="w-full flex items-center">
                          <UserCircle className="w-4 h-4 mr-2" /> Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-border/50" />
                      <DropdownMenuItem className="cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10" onClick={logout}>
                        <LogOut className="w-4 h-4 mr-2" /> Sign out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="xl:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px] overflow-y-auto">
                <nav className="flex flex-col gap-3 mt-8">
                  {/* Mobile Auth Menu items */}
                  {isAuthenticated && (
                    <div className="mb-4 pb-4 border-b border-border p-2 bg-muted/30 rounded-xl">
                      <p className="font-medium text-foreground">{currentUser?.name}</p>
                      <p className="text-xs text-muted-foreground mb-3">{currentUser?.email}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button asChild variant="outline" size="sm" onClick={() => setIsOpen(false)}>
                          <Link to="/dashboard">Dashboard</Link>
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => { logout(); setIsOpen(false); }}>
                          Log out
                        </Button>
                      </div>
                    </div>
                  )}

                  {!isAuthenticated && (
                    <div className="grid grid-cols-2 gap-2 mb-4 pb-4 border-b border-border">
                      <Button asChild variant="outline" onClick={() => setIsOpen(false)}>
                        <Link to="/login">Log in</Link>
                      </Button>
                      <Button asChild onClick={() => setIsOpen(false)}>
                        <Link to="/signup">Sign up</Link>
                      </Button>
                    </div>
                  )}

                  {navLinks.map((link) => (
                    <Link
                      key={link.path}
                      to={link.path}
                      onClick={() => setIsOpen(false)}
                      className={`px-4 py-3 text-base font-medium rounded-lg transition-all duration-200 ${
                        isActive(link.path)
                          ? 'text-primary bg-accent/20'
                          : 'text-muted-foreground hover:text-foreground hover:bg-accent/10'
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 mt-2 border-t border-border">
                    <BookingModal
                      trigger={
                        <ProtectedActionButton className="w-full" size="lg">
                          Book Consultation
                        </ProtectedActionButton>
                      }
                    />
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;