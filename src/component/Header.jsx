import React, { useState } from "react";
import { Link } from "react-router-dom";

const brandColor = "rgb(16, 108, 80)";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold tracking-tight"
          style={{ color: brandColor }}
          onClick={() => setMenuOpen(false)}
        >
          SkillGap
        </Link>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/login"
            className="px-4 py-2 font-medium transition"
            style={{ color: brandColor }}
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="px-5 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Icon */}
        <div
          className="md:hidden text-2xl cursor-pointer"
          style={{ color: brandColor }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-md border-t">
          <div className="flex flex-col px-4 py-3 gap-3">
            <Link
              to="/login"
              className="font-medium"
              style={{ color: brandColor }}
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>

            <Link
              to="/signup"
              className="px-4 py-2 rounded-lg text-white font-medium text-center"
              style={{ backgroundColor: brandColor }}
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;