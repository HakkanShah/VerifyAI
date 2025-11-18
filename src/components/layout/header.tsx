
'use client';
import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  ShieldCheck,
  LogOut,
  User as UserIcon,
  Home,
  Info,
  Newspaper,
  Mail,
  Loader2,
} from 'lucide-react';
import { useUser } from '@/firebase';
import { getAuth, signOut } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { MobileNav } from './mobile-nav';

export function Header() {
  const { user, isUserLoading } = useUser();
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  const navLinks = [
    { href: '/', icon: Home, label: 'Home', auth: false },
    { href: '/profile', icon: UserIcon, label: 'Profile', auth: true },
    { href: '/about', icon: Info, label: 'About', auth: false },
    { href: '/blogs', icon: Newspaper, label: 'Blogs', auth: false },
    { href: '/contact', icon: Mail, label: 'Contact Us', auth: false },
  ];

  const renderNavLinks = () => {
    if (!isClient) return null;
    
    return navLinks
      .filter(link => {
        if (!link.auth) return true;
        if (!isUserLoading && user) return true;
        return false;
      })
      .map(link => (
        <Button key={link.href} asChild variant="link">
          <Link
            href={link.href}
            className="flex items-center gap-2 text-muted-foreground transition-all hover:text-primary"
          >
            <link.icon className="h-4 w-4" />
            {link.label}
          </Link>
        </Button>
      ));
  };

  return (
    <header className="sticky top-4 z-50 mx-4">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center rounded-2xl border border-primary/20 bg-background/80 px-4 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="flex-1 flex items-center justify-start">
          <Link href="/" className="mr-6 flex items-center space-x-2">
              <ShieldCheck className="h-6 w-6 text-primary animate-pulse" />
              <span className="font-bold sm:inline-block">VerifyAI</span>
          </Link>
        </div>

        <nav className="hidden md:flex flex-1 items-center justify-center space-x-2">
          {renderNavLinks()}
        </nav>

        <div className="flex-1 flex items-center justify-end space-x-2">
          {isClient ? (
              isUserLoading ? (
              <div className="hidden sm:flex h-8 w-8 items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
              </div>
              ) : user ? (
              <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                      <AvatarImage
                          src={user.photoURL ?? undefined}
                          alt={user.displayName ?? 'User'}
                      />
                      <AvatarFallback>
                          {user.email?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                      </Avatar>
                  </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                          {user.displayName}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                      </p>
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                      <Link href="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      Profile
                      </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Log out</span>
                  </DropdownMenuItem>
                  </DropdownMenuContent>
              </DropdownMenu>
              ) : (
                <div className="hidden sm:flex items-center gap-2">
                  <Button asChild variant="ghost" size="sm">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button asChild size="sm">
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </div>
              )
          ) : null}
          <ThemeToggle />
          <div className="md:hidden">
              <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Open menu</span>
              </Button>
          </div>
        </div>
      </div>
      <MobileNav
          isOpen={isMobileMenuOpen}
          setIsOpen={setIsMobileMenuOpen}
          navLinks={navLinks}
      />
    </header>
  );
}
