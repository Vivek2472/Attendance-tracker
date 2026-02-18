import React, { useState } from 'react';
import { Sparkles, Loader2, MessageSquareQuote } from 'lucide-react';
import { getAttendanceInsights } from '../services/geminiService';
import { Subject, AttendanceRecord } from '../types';

interface AIInsightProps {
  subjects: Subject[];
  attendance: AttendanceRecord[];
}

export const AIInsight: React.FC<AIInsightProps> = ({ subjects, attendance }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGetInsight = async () => {
    setLoading(true);
    setInsight(null);
    const result = await getAttendanceInsights(subjects, attendance);
    setInsight(result);
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
      <div className="absolute -top-4 -right-4 p-8 opacity-10">
        <Sparkles size={120} />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="bg-white/20 p-2 rounded-lg backdrop-blur-sm">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <h3 className="text-lg font-bold">AI Attendance Coach</h3>
        </div>

        {!insight && !loading && (
          <>
            <p className="text-indigo-100 mb-5 text-sm max-w-lg">
              Get personalized feedback on your attendance. I'll analyze your patterns and give you actionable advice.
            </p>
            <button 
              onClick={handleGetInsight}
              className="bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-indigo-50 transition-colors shadow-sm flex items-center gap-2 text-sm"
            >
              Analyze My Attendance
            </button>
          </>
        )}

        {loading && (
          <div className="flex items-center gap-3 py-4 text-indigo-100">
            <Loader2 className="animate-spin w-5 h-5" />
            <span className="text-sm font-medium">Analyzing your records...</span>
          </div>
        )}

        {insight && (
          <div className="animate-fade-in">
             <div className="flex gap-3">
               <MessageSquareQuote className="w-10 h-10 text-indigo-200 shrink-0 mt-1" />
               <p className="text-white font-medium leading-relaxed">
                 {insight}
               </p>
             </div>
             <button 
               onClick={handleGetInsight} 
               className="text-xs text-indigo-200 mt-4 hover:text-white underline font-semibold"
             >
               Regenerate
             </button>
          </div>
        )}
      </div>
    </div>
  );
};
