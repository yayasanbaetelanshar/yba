import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, GraduationCap, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import LogoBaetElAnshar from "@/assets/logo yayasan.png";

type NavItem = {
  name: string;
  href: string;
  children?: NavItem[];
};

const navigation: NavItem[] = [
  { name: "Beranda", href: "/" },
  { name: "Tentang", href: "/tentang" },
  {
    name: "Lembaga",
    href: "/lembaga",
    children: [
      { name: "DTA Arrasyd", href: "/lembaga/dta" },
      { name: "SMP Baet El Anshar", href: "/lembaga/smp" },
      { name: "SMA Baet El Anshar", href: "/lembaga/sma" },
      { name: "Pesantren Tahfidz", href: "/lembaga/pesantren" },
    ],
  },
  { name: "Galeri", href: "/galeri" },
  { name: "Kontak", href: "/kontak" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Tutup mobile menu saat route berubah
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (href: string) => {
    if (href === "/") return location.pathname === "/";
    return location.pathname.startsWith(href);
  };

  const isParentActive = (item: NavItem) =>
    item.children?.some((child) => isActive(child.href)) ?? false;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3" aria-label="Home">
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex-shrink-0">
              <img
                src={LogoBaetElAnshar}
                alt="Logo Yayasan Baet El Anshar"
                className="w-full h-full object-contain"
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-serif text-xl font-bold text-foreground leading-tight">
                Baet El Anshar
              </h1>
              <p className="text-xs text-muted-foreground">
                Yayasan Pendidikan Islam
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) =>
              item.children ? (
                <DropdownMenu key={item.name}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className={`font-medium ${
                        isParentActive(item) || isActive(item.href)
                          ? "bg-accent text-accent-foreground"
                          : "text-foreground hover:bg-accent hover:text-accent-foreground"
                      }`}
                    >
                      {item.name}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="center" className="w-56">
                    {item.children.map((child) => (
                      <DropdownMenuItem key={child.name} asChild>
                        <Link
                          to={child.href}
                          className={`block w-full px-2 py-1.5 text-sm ${
                            isActive(child.href)
                              ? "bg-accent text-accent-foreground font-medium"
                              : ""
                          }`}
                        >
                          {child.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link key={item.name} to={item.href}>
                  <Button
                    variant="ghost"
                    className={`font-medium ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "text-foreground hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {item.name}
                  </Button>
                </Link>
              )
            )}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <Link to="/pendaftaran">
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold gap-2">
                <GraduationCap className="w-4 h-4" />
                Daftar Sekarang
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground gap-2"
              >
                <User className="w-4 h-4" />
                Login Wali
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6 text-foreground" />
            ) : (
              <Menu className="h-6 w-6 text-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-border bg-card animate-in slide-in-from-top-5 duration-300">
          <div className="container mx-auto px-4 py-5 space-y-6">
            {/* Logo di mobile */}
            <div className="flex items-center gap-3 pb-4 border-b border-border/50">
              <img
                src={LogoBaetElAnshar}
                alt="Logo Yayasan Baet El Anshar"
                className="w-12 h-12 object-contain"
              />
              <div>
                <h2 className="font-serif font-bold text-lg">Baet El Anshar</h2>
                <p className="text-xs text-muted-foreground">
                  Yayasan Pendidikan Islam
                </p>
              </div>
            </div>

            {/* Menu items */}
            <div className="space-y-2">
              {navigation.map((item) =>
                item.children ? (
                  <div key={item.name} className="space-y-1">
                    <div className="px-3 py-2 text-sm font-semibold text-muted-foreground">
                      {item.name}
                    </div>
                    <div className="pl-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`block px-4 py-2.5 rounded-md text-sm transition-colors ${
                            isActive(child.href)
                              ? "bg-accent text-accent-foreground font-medium"
                              : "hover:bg-accent/60"
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Link
                    to={item.href}
                    className={`block px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                      isActive(item.href)
                        ? "bg-accent text-accent-foreground"
                        : "hover:bg-accent/60"
                    }`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div>

            {/* Mobile CTA */}
            <div className="pt-4 space-y-3 border-t border-border/50">
              <Link to="/pendaftaran" className="block">
                <Button className="w-full bg-secondary text-secondary-foreground gap-2">
                  <GraduationCap className="w-4 h-4" />
                  Daftar Sekarang
                </Button>
              </Link>
              <Link to="/login" className="block">
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary gap-2"
                >
                  <User className="w-4 h-4" />
                  Login Wali
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}