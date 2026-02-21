import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "/logo.png";
import { useState, useEffect } from "react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(8, 8, 16, 0.85)' : 'rgba(8, 8, 16, 0.5)',
        backdropFilter: 'blur(20px) saturate(150%)',
        WebkitBackdropFilter: 'blur(20px) saturate(150%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
      }}
    >
      {/* Smooth animated bottom accent line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.4), rgba(168, 85, 247, 0.4), transparent)',
          backgroundSize: '200% auto',
          animation: 'shimmer 4s linear infinite',
        }}
      />

      <div className="container max-w-6xl mx-auto flex items-center justify-between h-14 px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img
            src={logo}
            alt="Blood Bridge Logo"
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <span className="font-heading text-lg font-bold text-white/90 group-hover:text-white transition-colors duration-300">
            Blood Bridge
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {[
            { path: "/", label: "Home" },
            { path: "/search", label: "Find Donors" },
            { path: "/register", label: "Become a Donor" },
          ].map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-4 py-1.5 text-sm font-medium rounded-lg transition-all duration-300 ${isActive(link.path)
                ? "bg-red-500/10 text-red-400 border border-red-500/15"
                : "text-white/45 hover:text-white/80 hover:bg-white/5"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-white/10"
          style={{ border: '1px solid rgba(255, 255, 255, 0.08)' }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          className="md:hidden mx-4 mb-2 rounded-xl overflow-hidden"
          style={{
            background: 'rgba(12, 12, 20, 0.95)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}
        >
          <div className="p-3 space-y-1">
            {[
              { path: "/", label: "Home" },
              { path: "/search", label: "Find Donors" },
              { path: "/register", label: "Become a Donor" },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`block text-sm py-2.5 px-4 rounded-lg transition-all duration-200 ${isActive(link.path)
                  ? "bg-red-500/10 text-red-400"
                  : "text-white/50 hover:text-white hover:bg-white/5"
                  }`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
