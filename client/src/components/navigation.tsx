import { Link, useLocation } from "wouter";
import { Search, Moon, Sun, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useThemeContext } from "./theme-provider";

export function Navigation() {
  const [location] = useLocation();
  const { theme, toggleTheme } = useThemeContext();

  const navItems = [
    { href: "/", label: "Dashboard", key: "dashboard" },
    { href: "/courses", label: "Courses", key: "courses" },
    { href: "/community", label: "Community", key: "community" },
    { href: "/certificates", label: "Certificates", key: "certificates" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return location === "/";
    return location.startsWith(href);
  };

  return (
    <nav className="bg-card shadow-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <Link href="/">
              <div className="flex items-center space-x-2 cursor-pointer">
                <div className="w-8 h-8 bg-medical-blue rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">R</span>
                </div>
                <span className="text-xl font-bold text-medical-blue-600 dark:text-medical-blue-400">
                  RadAcademy
                </span>
              </div>
            </Link>
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link key={item.key} href={item.href}>
                  <span className={`font-medium transition-colors cursor-pointer ${
                    isActive(item.href)
                      ? "text-medical-blue-600 dark:text-medical-blue-400 border-b-2 border-medical-blue-500 pb-4"
                      : "text-gray-600 dark:text-gray-300 hover:text-medical-blue-600 dark:hover:text-medical-blue-400"
                  }`}>
                    {item.label}
                  </span>
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                type="search"
                placeholder="Search courses..."
                className="w-64 pl-10 bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <div className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg cursor-pointer">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-medical-blue text-white text-sm font-medium">
                  DR
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:block text-sm font-medium">Dr. Sarah Chen</span>
              <ChevronDown className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
