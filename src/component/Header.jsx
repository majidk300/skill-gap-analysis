import React from "react";
import { Link } from "react-router-dom";

const brandColor = "rgb(16, 108, 80)";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold tracking-tight" style={{ color: brandColor }}>
          SkillGap
        </Link>


        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-4">
          <button
            className="px-4 py-2 font-medium transition"
            style={{ color: brandColor }}
          >
            Login
          </button>

          <button
            className="px-5 py-2 rounded-lg text-white font-medium transition hover:opacity-90"
            style={{ backgroundColor: brandColor }}
          >
            Sign Up
          </button>
        </div>

        {/* Mobile Menu Icon */}
        <div className="md:hidden text-2xl cursor-pointer" style={{ color: brandColor }}>
          ☰
        </div>

      </div>
    </header>
  );
};

export default Header;
