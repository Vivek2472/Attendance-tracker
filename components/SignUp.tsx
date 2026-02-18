
import React, { useState } from 'react';
import { GraduationCap, UserPlus } from 'lucide-react';
import { auth } from '../services/firebase';
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

interface SignUpProps {
  onLoginClick: () => void;
  onSignUpSuccess: (email: string) => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onLoginClick, onSignUpSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if(password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    
    setLoading(true);
    setError('');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      onSignUpSuccess(email);
    } catch (err: any) {
      setError(err.message || 'Error creating account.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-100 p-4 animate-fade-in">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center border-t-4 border-indigo-500">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-indigo-50">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
        <p className="text-slate-500 mb-8">Start your journey to better attendance.</p>
        
        <form onSubmit={handleSignUp} className="space-y-4 text-left">
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
            <input 
              type="password" 
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
            <input 
              type="password" 
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          {error && <p className="text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 font-medium">{error}</p>}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-4 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Account'} <UserPlus size={18} />
          </button>
        </form>

        <p className="text-sm text-slate-500 mt-6">
          Already have an account?{' '}
          <button onClick={onLoginClick} className="font-semibold text-indigo-600 hover:underline">
            Log In
          </button>
        </p>
      </div>
    </div>
  );
};
