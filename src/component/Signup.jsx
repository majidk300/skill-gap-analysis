import React, { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup data:", formData);
    setShowPopup(true);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 mt-15">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

          {/* Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-emerald-700">
              Create Account
            </h1>
            <p className="text-gray-600 mt-1">
              Sign up to start learning
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-xl border border-gray-300
                focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-emerald-600"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm password
              </label>

              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full px-4 py-2 rounded-xl border border-gray-300
                  focus:outline-none focus:ring-2 focus:ring-emerald-600 pr-10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-emerald-600"
                >
                  {showConfirmPassword ? (
                    <EyeSlashIcon className="w-5 h-5" />
                  ) : (
                    <EyeIcon className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-white
              bg-gradient-to-r from-emerald-700 to-emerald-600
              hover:from-emerald-600 hover:to-emerald-500
              transition-all duration-300 hover:scale-[1.02]"
            >
              Sign up
            </button>
          </form>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              className="text-emerald-700 font-semibold cursor-pointer hover:underline"
            >
              Login
            </span>
          </p>
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
          onClick={() => setShowPopup(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Feature Update
            </h2>

            <p className="text-gray-600 mb-6">
              This feature is currently unavailable.
              <br />
              We will update soon.
            </p>

            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-2 rounded-xl font-medium text-white
              bg-emerald-700 hover:bg-emerald-600 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Signup;