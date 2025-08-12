import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useThemeContext } from "./ThemeProvider";
import { LanguageSelector } from "./LanguageSelector";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  GraduationCap, 
  Moon, 
  Sun, 
  Menu, 
  X,
  BookOpen,
  Lightbulb,
  Users,
  Calendar,
  Mail
} from "lucide-react";

export function Navigation() {
  const [location] = useLocation();
  const { user, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useThemeContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems = [
    { href: "/", label: "Accueil", icon: GraduationCap },
    { 
      label: "Programme", 
      icon: BookOpen,
      items: [
        { href: "/program", label: "Vue d'ensemble" },
        { href: "/courses", label: "Matières" },
        { href: "/faculty", label: "Équipe pédagogique" },
      ]
    },
    { href: "/projects", label: "Projets", icon: Lightbulb },
    { href: "/news", label: "Actualités", icon: Calendar },
    { href: "/events", label: "Événements", icon: Calendar },
    { href: "/admissions", label: "Admissions", icon: Users },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <header className="bg-white dark:bg-slate-800 shadow-lg border-b border-slate-200 dark:border-slate-700 sticky top-0 z-50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center space-x-3 cursor-pointer" data-testid="logo">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-800 rounded-xl flex items-center justify-center">
                <GraduationCap className="text-white text-xl" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-slate-900 dark:text-white">Master BDSI</h1>
                <p className="text-sm text-slate-600 dark:text-slate-400">FS Dhar El Mehraz</p>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {navigationItems.map((item) => (
                <NavigationMenuItem key={item.label}>
                  {item.items ? (
                    <>
                      <NavigationMenuTrigger 
                        className="text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400"
                        data-testid={`nav-trigger-${item.label.toLowerCase()}`}
                      >
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <div className="grid gap-3 p-6 w-[400px]">
                          {item.items.map((subItem) => (
                            <NavigationMenuLink key={subItem.href} asChild>
                              <Link
                                href={subItem.href}
                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                data-testid={`nav-link-${subItem.label.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                <div className="text-sm font-medium leading-none">{subItem.label}</div>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </NavigationMenuContent>
                    </>
                  ) : (
                    <NavigationMenuLink asChild>
                      <Link
                        href={item.href!}
                        className={`text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors px-3 py-2 ${
                          location === item.href ? 'text-primary-600 dark:text-primary-400' : ''
                        }`}
                        data-testid={`nav-link-${item.label.toLowerCase()}`}
                      >
                        {item.label}
                      </Link>
                    </NavigationMenuLink>
                  )}
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* Controls */}
          <div className="flex items-center space-x-4">
            <LanguageSelector />

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600"
              data-testid="theme-toggle"
            >
              {isDark ? (
                <Sun className="h-5 w-5 text-accent-400" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </Button>

            {isAuthenticated && user?.role === 'admin' && (
              <Link href="/admin">
                <Button variant="outline" size="sm" data-testid="admin-link">
                  Admin
                </Button>
              </Link>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              data-testid="mobile-menu-toggle"
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="h-5 w-5 text-slate-700 dark:text-slate-200" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-slate-200 dark:border-slate-700" data-testid="mobile-menu">
            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <div key={item.label}>
                  {item.items ? (
                    <div>
                      <div className="px-3 py-2 font-medium text-slate-700 dark:text-slate-200">
                        {item.label}
                      </div>
                      <div className="ml-4 space-y-1">
                        {item.items.map((subItem) => (
                          <Link
                            key={subItem.href}
                            href={subItem.href}
                            className="block px-3 py-2 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400"
                            onClick={() => setIsMobileMenuOpen(false)}
                            data-testid={`mobile-nav-link-${subItem.label.toLowerCase().replace(/\s+/g, '-')}`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      href={item.href!}
                      className={`block px-3 py-2 font-medium transition-colors ${
                        location === item.href
                          ? 'text-primary-600 dark:text-primary-400'
                          : 'text-slate-700 dark:text-slate-200 hover:text-primary-600 dark:hover:text-primary-400'
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      data-testid={`mobile-nav-link-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
