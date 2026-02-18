
import React, { useState, useEffect, useCallback } from 'react';
import { UserProfile } from '../types';
import { Save, X, User as UserIcon, LogOut, AlertCircle } from 'lucide-react';

interface SettingsProps {
  userProfile: UserProfile;
  onUpdate: (profile: UserProfile) => void;
  onLogout: () => void;
  onClose: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ userProfile, onUpdate, onLogout, onClose }) => {
  const [profile, setProfile] = useState<UserProfile>(userProfile);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    setProfile(userProfile);
  }, [userProfile]);

  const handleSave = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(profile);
  }, [onUpdate, profile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 animate-fade-in">
      <div className="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-sm border border-slate-200 relative overflow-hidden animate-slide-up">
        <div className="absolute top-4 right-4">
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
              <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center text-center mb-6 pt-2">
            <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3">
                <UserIcon className="w-7 h-7 text-indigo-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-800">Student Profile</h2>
            <p className="text-slate-500 text-xs font-medium">Keep your identity updated</p>
        </div>
        
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Full Name</label>
            <input 
              type="text" 
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Year</label>
              <select 
                name="year"
                value={profile.year} 
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-sm"
                required
              >
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 ml-1">Semester</label>
              <select 
                name="semester"
                value={profile.semester} 
                onChange={handleChange}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-sm"
                required
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(s => (
                  <option key={s} value={String(s)}>Sem {s}</option>
                ))}
              </select>
            </div>
          </div>

          <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 text-sm mt-4 active:scale-95"
          >
              <Save size={18} /> Save Changes
          </button>
        </form>

        <div className="mt-8 pt-5 border-t border-slate-100">
          <button 
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="w-full py-2.5 rounded-xl text-red-600 font-bold hover:bg-red-50 transition-all border border-red-50 flex items-center justify-center gap-2 text-xs"
          >
              <LogOut size={16} />
              <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Logout Confirmation Dialog - Also optimized */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center modal-backdrop p-4 animate-fade-in">
          <div className="bg-white p-7 rounded-2xl shadow-2xl w-full max-w-xs text-center border border-slate-200 animate-slide-up">
            <div className="bg-red-50 w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">Exit Tracker?</h3>
            <p className="text-xs text-slate-500 mb-6 font-medium">Are you sure you want to log out?</p>
            <div className="flex flex-col gap-2.5">
              <button 
                onClick={onLogout}
                className="w-full py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-md text-sm active:scale-95"
              >
                Yes, Logout
              </button>
              <button 
                onClick={() => setShowLogoutConfirm(false)}
                className="w-full py-2.5 rounded-xl text-slate-500 font-bold hover:bg-slate-100 transition-all text-sm active:scale-95"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};