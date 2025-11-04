import { LiquidButton } from "./ui/liquid-glass-button";
import { Menu, X, User, LogOut } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Philosophy", href: "/philosophy" },
  { name: "Development", href: "/development" },
  { name: "Chat", href: "/chat" },
  { name: "Dashboard", href: "/dashboard" },
  { name: "Contact", href: "/contact" },
];

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 transition-all duration-300">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 animate-fade-in-down">
            <span className="w-8 h-8 rounded-full border-4 flex items-center justify-center" style={{ borderColor: 'rgb(134.9, 68.1, 79.1)' }}>
            </span>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              SYNFIN
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 animate-fade-in-down delay-200">
            {navigation.map((item, index) => (
              <Link
                key={item.name}
                to={item.href}
                className="group relative px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground transition-all duration-300 rounded-lg hover:bg-secondary/50"
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full border-2 border-current group-hover:bg-current transition-all duration-300" />
                  {item.name}
                </span>
                <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-primary group-hover:w-full group-hover:left-0 transition-all duration-300 rounded-full"></div>
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3 animate-fade-in-down delay-400">
            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{currentUser.displayName || "User"}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {currentUser.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors px-4 py-2 rounded-lg hover:bg-secondary/50"
                >
                  Login
                </Link>
                <LiquidButton 
                  variant="default"
                  size="lg"
                  className="font-medium"
                >
                  Get Started
                </LiquidButton>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border/50 animate-fade-in-down">
            <nav className="flex flex-col space-y-2 pt-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center gap-3 px-4 py-3 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all duration-300"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="w-2 h-2 rounded-full border-2 border-current group-hover:bg-current transition-all duration-300" />
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-3">
                {currentUser ? (
                  <div className="space-y-3">
                    <div className="px-4 py-3 bg-secondary/30 rounded-lg">
                      <p className="font-medium text-sm">{currentUser.displayName || "User"}</p>
                      <p className="text-xs text-muted-foreground truncate">{currentUser.email}</p>
                    </div>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        handleLogout();
                        setMobileMenuOpen(false);
                      }}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Log out
                    </Button>
                  </div>
                ) : (
                  <>
                    <Link
                      to="/login"
                      className="block text-center text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 px-4 py-3 rounded-lg transition-all duration-300"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Login
                    </Link>
                    <LiquidButton 
                      variant="default"
                      size="lg"
                      className="w-full font-medium"
                    >
                      Get Started
                    </LiquidButton>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
