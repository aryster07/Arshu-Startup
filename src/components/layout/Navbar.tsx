import { useState, useEffect } from "react";
import { Scale } from "lucide-react";
import { Button } from "../ui/button";

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["home", "about", "team", "contact"];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "team", label: "Our Team" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="border-b border-slate-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Scale className="w-8 h-8 text-primary-blue-600" style={{ color: "#2563eb" }} />
            <span className="text-slate-900 font-serif-legal" style={{ fontSize: "20px", fontWeight: 600 }}>
              Law Bandhu
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`relative px-4 py-2 transition-all duration-200 ${
                  activeSection === item.id
                    ? "text-primary"
                    : "text-slate-700 hover:text-primary hover:bg-blue-50"
                }`}
                style={{
                  borderRadius: "8px",
                  color: activeSection === item.id ? "#2563eb" : undefined,
                }}
              >
                {item.label}
                {activeSection === item.id && (
                  <span
                    className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-primary"
                    style={{ backgroundColor: "#2563eb" }}
                  />
                )}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            <Button
              onClick={onLoginClick}
              className="bg-primary hover:bg-blue-700 transition-all hover:scale-105 active:scale-95"
              style={{ borderRadius: "8px" }}
            >
              Login / Sign Up
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
