import React, { useState } from 'react';
import { GraduationCap, ArrowRight } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [name, setName] = useState('');
  const [year, setYear] = useState('');
  const [semester, setSemester] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name && year && semester) {
      onComplete({ name, year, semester });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md text-center border-t-4 border-indigo-500">
        <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-indigo-50">
          <GraduationCap className="w-8 h-8 text-indigo-600" />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Welcome!</h2>
        <p className="text-slate-500 mb-8">Let's get your attendance tracker set up.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Your Name</label>
            <input 
              type="text" 
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Year</label>
              <select 
                value={year} 
                onChange={(e) => setYear(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              >
                <option value="">Select</option>
                <option value="1">1st</option>
                <option value="2">2nd</option>
                <option value="3">3rd</option>
                <option value="4">4th</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Semester</label>
              <select 
                value={semester} 
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
                required
              >
                <option value="">Select</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={String(s)}>Sem {s}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors mt-6 shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
          >
            Get Started <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </button>
        </form>
      </div>
    </div>
  );
};