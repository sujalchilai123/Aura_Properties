// import React from 'react'
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../components/OAuth";


export default function SignUp() {
  const [formData, setFormData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success === false) {
        setLoading(false);
        setError(data.message);
        return;
      }
      setLoading(false);
      setError(null)
      navigate('/sign-in')
    } catch (error) {
      setLoading(false);
      setError(error.message)
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left side: Premium Image Display (hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-900 border-r border-slate-200">
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80")`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />

        <div className="relative z-10 p-20 flex flex-col justify-end w-full h-full text-white">
          <h2 className="text-4xl font-bold tracking-tight mb-4">
            Curated Excellence.
          </h2>
          <p className="text-lg text-slate-300 font-light max-w-md">
            Create an account to gain priority access to off-market listings and investment opportunities.
          </p>
        </div>
      </div>

      {/* Right side: Modern Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative bg-slate-50">
        <div className="w-full max-w-md relative z-10 glass-panel p-8 sm:p-10 shadow-2xl shadow-slate-200/40">
          <div className="mb-10 lg:mb-12 text-left">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">
              Create Account
            </h1>
            <p className="text-slate-500 font-medium">Join the Aura Properties network.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Full Name</label>
              <input
                type="text"
                placeholder="John Doe"
                className="input-premium"
                id="username"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Email Address</label>
              <input
                type="email"
                placeholder="name@company.com"
                className="input-premium"
                id="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-slate-700 ml-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-premium"
                id="password"
                onChange={handleChange}
                required
              />
            </div>

            <button
              disabled={loading}
              className="business-btn-primary mt-4 w-full"
            >
              {loading ? "Creating Profile..." : "Create Account"}
            </button>

            <div className="relative flex items-center py-4 my-2">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase font-bold tracking-wider">Or continue with</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            <OAuth />
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center items-center gap-2 text-sm text-slate-600 font-medium">
            <p>Already have an account?</p>
            <Link to={"/sign-in"} className="text-emerald-600 hover:text-emerald-700 font-bold transition-colors">
              Sign In
            </Link>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50/80 border border-red-100 text-red-600 rounded-xl text-center text-sm font-medium">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
