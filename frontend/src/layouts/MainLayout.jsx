import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Car, LayoutDashboard, BookOpen, LogOut, Menu, X } from "lucide-react";
import Chatbot from "../components/common/Chatbot";
import { useState, useEffect } from "react";

const MainLayout = ({ children }) => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Blur effect on scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-black/20 border-b border-white/5"
            : "bg-slate-900/80 backdrop-blur-md border-b border-white/5"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between h-18 py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 no-underline group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-105 transition-transform">
              <Car size={20} color="white" />
            </div>
            <div>
              <span className="text-white text-xl font-extrabold tracking-tight">
                Drive<span className="text-blue-400">Way</span>
              </span>
              <p className="text-slate-500 text-xs -mt-1 hidden md:block">
                Premium Car Rentals
              </p>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`flex items-center gap-1.5 text-sm font-medium no-underline transition-colors ${
                isActive("/")
                  ? "text-blue-400"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <Car size={15} /> Fleet
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`flex items-center gap-1.5 text-sm font-medium no-underline transition-colors ${
                    isActive("/my-bookings")
                      ? "text-blue-400"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <BookOpen size={15} /> My Bookings
                </Link>

                {isAdmin && (
                  <Link
                    to="/admin"
                    className={`flex items-center gap-1.5 text-sm font-medium no-underline transition-colors ${
                      isActive("/admin")
                        ? "text-amber-400"
                        : "text-amber-400/70 hover:text-amber-400"
                    }`}
                  >
                    <LayoutDashboard size={15} /> Admin
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 pl-4 border-l border-slate-700">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-slate-300 text-sm font-medium">
                    {user.name.split(" ")[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-slate-400 hover:text-red-400 text-sm font-medium bg-transparent border-none cursor-pointer transition-colors"
                  >
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white text-sm font-medium no-underline transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold no-underline transition-all hover:-translate-y-0.5 shadow-lg shadow-blue-500/25"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-slate-300 hover:text-white bg-transparent border-none cursor-pointer p-1"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 flex flex-col gap-4">
            <Link
              to="/"
              className={`flex items-center gap-2 text-sm font-medium no-underline py-2 ${
                isActive("/") ? "text-blue-400" : "text-slate-300"
              }`}
            >
              <Car size={16} /> Fleet
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className={`flex items-center gap-2 text-sm font-medium no-underline py-2 ${
                    isActive("/my-bookings")
                      ? "text-blue-400"
                      : "text-slate-300"
                  }`}
                >
                  <BookOpen size={16} /> My Bookings
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 text-sm font-medium no-underline py-2 text-amber-400"
                  >
                    <LayoutDashboard size={16} /> Admin
                  </Link>
                )}
                <div className="border-t border-slate-700 pt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-slate-300 text-sm">{user.name}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-red-400 text-sm bg-transparent border-none cursor-pointer"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex flex-col gap-3 pt-2 border-t border-slate-700">
                <Link
                  to="/login"
                  className="text-slate-300 text-sm font-medium no-underline py-1"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-bold no-underline text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Spacer for fixed navbar */}
      <div className="h-[72px]" />

      {/* Content */}
      <main className="flex-1">{children}</main>

      <Chatbot />

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-500 text-center py-6 text-sm border-t border-slate-800">
        © {new Date().getFullYear()} DriveWay Car Rentals. All rights reserved.
      </footer>
    </div>
  );
};

export default MainLayout;
