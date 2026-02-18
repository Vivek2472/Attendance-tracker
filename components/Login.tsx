
import React, { useState } from 'react';
import { GraduationCap, LogIn, ChevronLeft, Eye, EyeOff } from 'lucide-react';
import { auth } from '../services/firebase';
import { signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

interface LoginProps {
  onSignUpClick: () => void;
  onLoginSuccess: (email: string) => void;
  onBack?: () => void;
}

export const Login: React.FC<LoginProps> = ({ onSignUpClick, onLoginSuccess, onBack }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
        setError('Please fill in all fields.');
        return;
    }
    
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLoginSuccess(email);
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-100 p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border-t-4 border-indigo-500 relative">
        {onBack && (
          <button 
            onClick={onBack}
            className="absolute top-4 left-4 text-slate-400 hover:text-indigo-600 transition-colors flex items-center gap-1 text-xs font-bold uppercase tracking-tight"
          >
            <ChevronLeft size={14} /> Back
          </button>
        )}
        
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-indigo-50 mt-4">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h2>
        <p className="text-slate-500 mb-8">Log in to track your attendance.</p>
        
        <form onSubmit={handleLogin} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@college.edu"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition pr-11"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition-colors p-1.5 rounded-md hover:bg-slate-100"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-4 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-50 active:scale-95"
          >
            {loading ? 'Logging in...' : 'Log In'} <LogIn size={18} />
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6">
          Don't have an account?{' '}
          <button onClick={onSignUpClick} className="font-semibold text-indigo-600 hover:underline">
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
};
