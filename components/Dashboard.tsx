import React, { useMemo, useState, useEffect } from 'react';
import { Subject, AttendanceRecord } from '../types';
import { AlertCircle, CheckCircle, TrendingUp, BarChartHorizontalBig } from 'lucide-react';
import { WelcomePopup } from './WelcomePopup';

interface DashboardProps {
  subjects: Subject[];
  attendance: AttendanceRecord[];
  setActiveTab: (tab: 'dashboard' | 'calendar' | 'subjects' | 'labs') => void;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; color: string;}> = ({ title, value, icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between">
    <div>
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="text-3xl font-bold text-slate-800">{value}</p>
    </div>
    <div className={`p-3 rounded-lg bg-${color}-100 text-${color}-600`}>
      {icon}
    </div>
  </div>
);

export const Dashboard: React.FC<DashboardProps> = ({ subjects, attendance, setActiveTab }) => {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (subjects.length === 0 && !sessionStorage.getItem('welcomePopupShown')) {
        setShowWelcome(true);
        sessionStorage.setItem('welcomePopupShown', 'true');
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [subjects]);

  const stats = useMemo(() => {
    return subjects.map(sub => {
      const records = attendance.filter(r => r.subjectId === sub.id && r.status !== 'cancelled');
      const total = records.length;
      const present = records.filter(r => r.status === 'present' || r.status === 'late').length;
      const percentage = total > 0 ? (present / total) * 100 : 0;
      
      return {
        id: sub.id,
        name: sub.name,
        code: sub.code,
        percentage: Math.round(percentage),
        total,
        present,
        color: sub.color,
        target: sub.targetAttendance,
        type: sub.type || 'theory'
      };
    }).sort((a, b) => a.percentage - b.percentage);
  }, [subjects, attendance]);

  const overallAttendance = useMemo(() => {
    const totalClasses = stats.reduce((acc, curr) => acc + curr.total, 0);
    const totalPresent = stats.reduce((acc, curr) => acc + curr.present, 0);
    return totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
  }, [stats]);
  
  const atRiskCount = stats.filter(s => s.percentage < s.target && s.total > 0).length;

  const handleGoToSubjects = () => {
    setActiveTab('subjects');
    setShowWelcome(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 md:pb-0">
      {showWelcome && (
        <WelcomePopup 
          onClose={() => setShowWelcome(false)}
          onGoToSubjects={handleGoToSubjects}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard 
          title="Overall Attendance" 
          value={`${overallAttendance}%`} 
          icon={<TrendingUp size={24} />} 
          color={overallAttendance >= 75 ? 'green' : 'red'}
        />
        <StatCard 
          title="Total Classes Marked" 
          value={stats.reduce((acc, curr) => acc + curr.total, 0)} 
          icon={<CheckCircle size={24} />} 
          color="blue"
        />
        <StatCard 
          title="Subjects At Risk" 
          value={atRiskCount} 
          icon={<AlertCircle size={24} />} 
          color={atRiskCount > 0 ? 'orange' : 'slate'}
        />
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
           <BarChartHorizontalBig size={20} className="text-indigo-500" />
           Attendance Breakdown
        </h3>
        <div className="space-y-3">
          {stats.map((subject) => (
            <div key={subject.id} className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm transition-all hover:shadow-md hover:border-indigo-100">
               <div className="flex items-center justify-between mb-2">
                  <div>
                     <p className="font-bold text-slate-800">{subject.name}</p>
                     {subject.code && <p className="text-xs text-slate-400 font-medium uppercase tracking-tighter">{subject.code}</p>}
                  </div>
                  <div className="text-right">
                    <p className={`font-bold text-lg ${subject.percentage >= subject.target ? 'text-green-600' : 'text-red-500'}`}>{subject.percentage}%</p>
                    <p className="text-xs text-slate-400">{subject.present}/{subject.total} classes</p>
                  </div>
               </div>
               <div className="w-full bg-slate-100 rounded-full h-2 relative">
                  <div 
                    className="h-2 rounded-full transition-all duration-500" 
                    style={{ width: `${subject.percentage}%`, backgroundColor: subject.color }}
                  ></div>
                   <div 
                    className="h-full w-px bg-slate-400 absolute top-0" 
                    style={{ left: `${subject.target}%`}}
                    title={`Target: ${subject.target}%`}
                  ></div>
               </div>
            </div>
          ))}
          {stats.length === 0 && (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-xl border-2 border-dashed border-slate-200">
              <p className="font-medium">No subjects or labs added yet.</p>
              <p className="text-sm">Add some in the 'Subjects' tab to see your progress.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};