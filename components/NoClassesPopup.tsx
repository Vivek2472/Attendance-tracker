import React from 'react';
import { CalendarPlus, ArrowRight } from 'lucide-react';

interface NoClassesPopupProps {
  onClose: () => void;
  onGoToSubjects: () => void;
}

export const NoClassesPopup: React.FC<NoClassesPopupProps> = ({ onClose, onGoToSubjects }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-sm text-center">
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ring-4 ring-slate-50">
          <CalendarPlus className="w-8 h-8 text-slate-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">No Classes Scheduled</h2>
        <p className="text-slate-500 mb-8">
          This day is free! Would you like to add a class to your schedule?
        </p>
        <div className="flex flex-col gap-3">
            <button 
                onClick={onGoToSubjects}
                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 group"
            >
                Go to Subjects <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button 
                onClick={onClose}
                className="w-full py-2.5 rounded-lg text-slate-500 font-semibold hover:bg-slate-100 transition-colors"
            >
                Close
            </button>
        </div>
      </div>
    </div>
  );
};
