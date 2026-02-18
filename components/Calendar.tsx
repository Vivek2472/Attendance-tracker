
import React, { useState, useMemo } from 'react';
import { Subject, AttendanceRecord, AttendanceStatus } from '../types';
import { daysOfWeek, getDaysInMonth, getFirstDayOfMonth, isSameDay } from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, BarChart3, TrendingUp, Calendar as CalendarIcon, CheckCircle, XCircle, Slash, Palmtree } from 'lucide-react';
import { DailyCheckIn } from './DailyCheckIn';

interface CalendarProps {
  subjects: Subject[];
  attendance: AttendanceRecord[];
  setAttendance: React.Dispatch<React.SetStateAction<AttendanceRecord[]>>;
  setActiveTab: (tab: 'dashboard' | 'calendar' | 'subjects' | 'labs') => void;
}

export const Calendar: React.FC<CalendarProps> = ({ subjects, attendance, setAttendance, setActiveTab }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const date = new Date(year, month, day);
    setSelectedDate(date);
  };

  const handleUpdateAttendance = (subjectId: string, dateStr: string, status: AttendanceStatus | null, startTime: string) => {
    setAttendance(prev => {
      // Filter out existing record for this specific subject slot on this day
      const filtered = prev.filter(r => !(r.subjectId === subjectId && r.date === dateStr && r.startTime === startTime));
      
      // If status is null, we are just removing the mark (de-selecting)
      if (status === null) {
        return filtered;
      }
      
      // Otherwise, add the new mark
      return [...filtered, { id: crypto.randomUUID(), subjectId, date: dateStr, status, startTime }];
    });
  };

  const monthlyStats = useMemo(() => {
    const currentMonthPrefix = `${year}-${String(month + 1).padStart(2, '0')}`;
    const recordsInMonth = attendance.filter(r => r.date.startsWith(currentMonthPrefix) && r.status !== 'cancelled' && r.status !== 'holiday');
    const totalClasses = recordsInMonth.length;
    const presentCount = recordsInMonth.filter(r => r.status === 'present' || r.status === 'late').length;
    const overallPercentage = totalClasses > 0 ? Math.round((presentCount / totalClasses) * 100) : 0;
    
    const subjectBreakdown = subjects.map(sub => {
       const subRecords = recordsInMonth.filter(r => r.subjectId === sub.id);
       const subTotal = subRecords.length;
       const subPresent = subRecords.filter(r => r.status === 'present' || r.status === 'late').length;
       const subPercentage = subTotal > 0 ? Math.round((subPresent / subTotal) * 100) : 0;
       return { id: sub.id, name: sub.name, code: sub.code, color: sub.color, total: subTotal, present: subPresent, percentage: subPercentage, type: sub.type };
    }).filter(s => s.total > 0).sort((a, b) => b.percentage - a.percentage);
    
    return { totalClasses, presentCount, overallPercentage, subjectBreakdown };
  }, [attendance, subjects, year, month]);

  const renderDays = () => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-slate-50/50"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const scheduledSlots = subjects.flatMap(s => 
        s.schedule.filter(slot => slot.dayOfWeek === date.getDay()).map(slot => ({ ...s, slot }))
      );
      const records = attendance.filter(r => r.date === dateStr);
      const isToday = isSameDay(date, new Date());
      
      const allMarked = scheduledSlots.length > 0 && records.length >= scheduledSlots.length;
      const anyAbsent = records.some(r => r.status === 'absent');
      const anyCancelled = records.some(r => r.status === 'cancelled');
      const anyHoliday = records.some(r => r.status === 'holiday');
      const allPresentOrCancelled = allMarked && !anyAbsent;

      days.push(
        <div key={day} onClick={() => handleDateClick(day)} className={`p-2 h-28 flex flex-col cursor-pointer transition-colors relative group hover:bg-indigo-50 border-r border-b border-slate-100 ${isToday ? 'bg-indigo-50' : 'bg-white'}`}>
          <div className="flex justify-between items-center mb-1">
             <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${isToday ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-700'}`}>{day}</span>
              {
                anyAbsent ? <XCircle size={14} className="text-red-500" /> :
                anyHoliday ? <Palmtree size={14} className="text-sky-500" /> :
                allPresentOrCancelled && anyCancelled ? <Slash size={14} className="text-slate-500" /> :
                allPresentOrCancelled ? <CheckCircle size={14} className="text-green-500" /> : null
              }
          </div>
          <div className="flex flex-col gap-1 overflow-hidden">
             {scheduledSlots.slice(0, 3).map((item, idx) => {
                const record = records.find(r => r.subjectId === item.id && r.startTime === item.slot.startTime);
                const isMarked = !!record;
                const isAttended = record && (record.status === 'present' || record.status === 'late');
                return (
                 <div key={`${item.id}-${idx}`} className="text-[9px] truncate px-1 py-0.5 rounded flex items-center gap-1 bg-slate-50 border border-slate-100" title={`${item.name} @ ${item.slot.startTime}`}>
                    <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: item.color, opacity: isMarked ? 1 : 0.2 }}></div>
                    <span className={`font-bold uppercase tracking-tighter ${isMarked ? 'text-slate-800' : 'text-slate-300'}`}>{item.code || item.name}</span>
                 </div>
                );
             })}
             {scheduledSlots.length > 3 && <span className="text-[9px] text-slate-400 pl-1 mt-0.5 font-bold">+{scheduledSlots.length - 3} MORE</span>}
             {scheduledSlots.length === 0 && records.length > 0 && (
               <div className="text-[9px] font-bold text-slate-400 mt-1 uppercase italic opacity-60">Manual Logs</div>
             )}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 md:pb-0">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <CalendarIcon size={18} className="text-indigo-600" />
            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </h2>
          <div className="flex gap-1">
            <button onClick={handlePrevMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronLeft size={18} /></button>
            <button onClick={handleNextMonth} className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"><ChevronRight size={18} /></button>
          </div>
        </div>
        <div className="grid grid-cols-7 text-center border-b border-slate-100 bg-slate-50/50">
          {daysOfWeek.map(day => <div key={day} className="py-2.5 text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{day}</div>)}
        </div>
        <div className="grid grid-cols-7 border-l border-t border-slate-100">
          {renderDays()}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <BarChart3 size={18} className="text-indigo-600" />
            Monthly Summary
        </h3>
        {monthlyStats.totalClasses > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-200 flex flex-col items-center justify-center text-center">
                <div className={`w-20 h-20 rounded-full border-4 flex items-center justify-center mb-4 ${monthlyStats.overallPercentage >= 75 ? 'border-green-100 text-green-600' : 'border-red-100 text-red-600'}`}>
                    <span className="text-2xl font-black">{monthlyStats.overallPercentage}%</span>
                </div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Attendance</p>
                <p className="text-sm font-bold text-slate-800">{monthlyStats.presentCount} of {monthlyStats.totalClasses} classes</p>
            </div>
            
            <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
              {monthlyStats.subjectBreakdown.map(sub => (
                <div key={sub.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-200 transition-all">
                  <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: sub.color }}></div>
                  <div className="pl-2">
                    <div className="flex justify-between items-start mb-2">
                       <div className="max-w-[70%]">
                         <h4 className="font-bold text-slate-800 text-xs truncate" title={sub.name}>{sub.name}</h4>
                         {sub.code && <p className="text-[10px] text-slate-400 font-bold uppercase">{sub.code}</p>}
                       </div>
                       <span className={`text-sm font-black ${sub.percentage >= 75 ? 'text-green-600' : 'text-red-600'}`}>{sub.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2"><div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${sub.percentage}%`, backgroundColor: sub.color }}></div></div>
                    <p className="text-[10px] text-slate-500 font-medium">Attended {sub.present}/{sub.total}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-400">
            <p className="font-bold text-slate-800">No logs for {currentDate.toLocaleString('default', { month: 'long' })}</p>
            <p className="text-sm mt-1">Select a date above to manually mark your attendance.</p>
          </div>
        )}
      </div>

      {selectedDate && (
        <DailyCheckIn 
          date={selectedDate} 
          subjects={subjects} 
          attendance={attendance} 
          onClose={() => setSelectedDate(null)} 
          onUpdateAttendance={handleUpdateAttendance} 
        />
      )}
    </div>
  );
};
