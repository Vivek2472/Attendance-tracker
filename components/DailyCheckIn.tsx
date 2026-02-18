
import React from 'react';
import { Subject, AttendanceStatus, AttendanceRecord } from '../types';
import { fullDaysOfWeek, formatTime } from '../utils/dateUtils';
import { X, Check, XCircle, Slash, Clock, Lock, Palmtree } from 'lucide-react';

interface DailyCheckInProps {
  date: Date;
  subjects: Subject[];
  attendance: AttendanceRecord[];
  onClose: () => void;
  onUpdateAttendance: (subjectId: string, date: string, status: AttendanceStatus | null, startTime: string) => void;
}

export const DailyCheckIn: React.FC<DailyCheckInProps> = ({ 
  date, 
  subjects, 
  attendance, 
  onClose,
  onUpdateAttendance
}) => {
  const dayOfWeek = date.getDay();
  const dateStr = date.toISOString().split('T')[0];

  const today = new Date();
  today.setHours(0,0,0,0);
  const checkInDate = new Date(date);
  checkInDate.setHours(0,0,0,0);
  const isFuture = checkInDate > today;

  const scheduledSlots = subjects.flatMap(subject => 
    subject.schedule
      .filter(slot => slot.dayOfWeek === dayOfWeek)
      .map(slot => {
        const record = attendance.find(r => 
          r.subjectId === subject.id && 
          r.date === dateStr && 
          r.startTime === slot.startTime
        );
        return { subject, slot, record };
      })
  ).sort((a, b) => a.slot.startTime.localeCompare(b.slot.startTime));

  const handleStatusClick = (subjectId: string, status: AttendanceStatus, currentStatus?: AttendanceStatus, startTime: string = "") => {
    if (currentStatus === status) {
      onUpdateAttendance(subjectId, dateStr, null, startTime);
    } else {
      onUpdateAttendance(subjectId, dateStr, status, startTime);
    }
  };

  const markAll = (status: AttendanceStatus) => {
    scheduledSlots.forEach(({ subject, slot }) => {
      onUpdateAttendance(subject.id, dateStr, status, slot.startTime);
    });
  };

  const StatusButton: React.FC<{
    status: AttendanceStatus;
    currentStatus?: AttendanceStatus;
    onClick: () => void;
    disabled: boolean;
    icon: React.ReactNode;
    label: string;
    activeStyles: string;
  }> = ({ status, currentStatus, onClick, disabled, icon, label, activeStyles }) => {
    const isActive = currentStatus === status;
    return (
      <button
        onClick={onClick}
        disabled={disabled}
        className={`flex flex-col items-center justify-center gap-1.5 py-2.5 rounded-xl border transition-all duration-200 flex-1
          ${disabled ? 'opacity-30 cursor-not-allowed bg-slate-50' : 'hover:bg-slate-50 active:scale-95'}
          ${isActive 
            ? `${activeStyles} border-transparent shadow-md font-semibold` 
            : 'bg-white border-slate-200 text-slate-500 font-medium'}
        `}
      >
        <div className={`transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}>
          {icon}
        </div>
        <span className="text-[9px] font-black uppercase tracking-tighter">{label}</span>
      </button>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center modal-backdrop p-4 animate-fade-in">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200 animate-slide-up">
        {/* Header */}
        <div className="p-6 flex justify-between items-center shrink-0 border-b border-indigo-900 bg-indigo-950 text-white">
          <div>
            <h2 className="font-black text-xl text-white tracking-tight uppercase">{fullDaysOfWeek[dayOfWeek]}</h2>
            <p className="text-indigo-300 text-xs font-bold uppercase tracking-widest mt-0.5">
              {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl transition-all text-indigo-300 hover:text-white hover:bg-white/10">
            <X size={24} strokeWidth={3} />
          </button>
        </div>

        <div className="p-5 overflow-y-auto flex-1 space-y-6 bg-slate-50/50">
          {/* Global Bulk Actions Section */}
          {!isFuture && scheduledSlots.length > 0 && (
            <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm border-dashed">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4 text-center">Mark Full Day As</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    <button 
                      onClick={() => markAll('present')} 
                      className="group flex flex-col items-center gap-2 bg-green-50 text-green-700 p-3 rounded-xl border border-green-100 hover:bg-green-600 hover:text-white transition-all shadow-sm"
                    >
                      <Check size={20} strokeWidth={3} />
                      <span className="font-black text-[9px] uppercase">All Present</span>
                    </button>
                    <button 
                      onClick={() => markAll('absent')} 
                      className="group flex flex-col items-center gap-2 bg-red-50 text-red-700 p-3 rounded-xl border border-red-100 hover:bg-red-600 hover:text-white transition-all shadow-sm"
                    >
                      <XCircle size={20} strokeWidth={3} />
                      <span className="font-black text-[9px] uppercase">All Absent</span>
                    </button>
                    <button 
                      onClick={() => markAll('holiday')} 
                      className="group flex flex-col items-center gap-2 bg-sky-50 text-sky-700 p-3 rounded-xl border border-sky-100 hover:bg-sky-600 hover:text-white transition-all shadow-sm"
                    >
                      <Palmtree size={20} strokeWidth={3} />
                      <span className="font-black text-[9px] uppercase">Holiday</span>
                    </button>
                    <button 
                      onClick={() => markAll('cancelled')} 
                      className="group flex flex-col items-center gap-2 bg-slate-50 text-slate-700 p-3 rounded-xl border border-slate-100 hover:bg-slate-600 hover:text-white transition-all shadow-sm"
                    >
                      <Slash size={20} strokeWidth={3} />
                      <span className="font-black text-[9px] uppercase">Cancelled</span>
                    </button>
                </div>
            </div>
          )}

          {isFuture && (
            <div className="bg-amber-50 text-amber-700 p-4 rounded-2xl flex items-center gap-3 border border-amber-100">
              <Lock size={18} className="shrink-0" />
              <span className="text-xs font-bold uppercase tracking-tight">Logs are locked for future dates.</span>
            </div>
          )}

          {/* Scheduled Slots */}
          <div className="space-y-4">
            {scheduledSlots.length > 0 ? (
              <>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Scheduled sessions</p>
                {scheduledSlots.map(({ subject, slot, record }, index) => (
                  <div key={`${subject.id}-${slot.startTime}-${index}`} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm transition-all hover:border-indigo-100">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-1.5 h-10 rounded-full shrink-0" style={{backgroundColor: subject.color}}></div>
                      <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                              <h3 className="font-bold text-slate-800 text-sm truncate uppercase tracking-tight">{subject.name}</h3>
                              {subject.type === 'lab' && <span className="text-[8px] font-black text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded border border-purple-100 uppercase">LAB</span>}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                            <Clock size={12} className="opacity-50" />
                            <span>{formatTime(slot.startTime)} — {formatTime(slot.endTime)}</span>
                          </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <StatusButton 
                        status="present" currentStatus={record?.status} onClick={() => handleStatusClick(subject.id, 'present', record?.status, slot.startTime)} disabled={isFuture} 
                        icon={<Check size={18} strokeWidth={3} />} label="Present" activeStyles="bg-green-600 text-white"
                      />
                      <StatusButton 
                        status="absent" currentStatus={record?.status} onClick={() => handleStatusClick(subject.id, 'absent', record?.status, slot.startTime)} disabled={isFuture} 
                        icon={<XCircle size={18} strokeWidth={3} />} label="Absent" activeStyles="bg-red-600 text-white"
                      />
                      <StatusButton 
                        status="cancelled" currentStatus={record?.status} onClick={() => handleStatusClick(subject.id, 'cancelled', record?.status, slot.startTime)} disabled={isFuture} 
                        icon={<Slash size={18} strokeWidth={3} />} label="Cancel" activeStyles="bg-slate-600 text-white"
                      />
                      <StatusButton 
                        status="holiday" currentStatus={record?.status} onClick={() => handleStatusClick(subject.id, 'holiday', record?.status, slot.startTime)} disabled={isFuture} 
                        icon={<Palmtree size={18} strokeWidth={3} />} label="Holiday" activeStyles="bg-sky-500 text-white"
                      />
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="text-center py-16 bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center">
                <div className="bg-slate-50 p-5 rounded-full mb-4">
                  <Clock size={32} className="text-slate-300" />
                </div>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest">No classes scheduled for this day</p>
                <p className="text-[10px] text-slate-300 font-bold uppercase mt-1">Check your subject schedule in the Subjects tab</p>
              </div>
            )}
          </div>
        </div>

        <div className="p-6 bg-white border-t border-slate-100 flex justify-end shrink-0">
            <button 
              onClick={onClose} 
              className="bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-800 text-[10px] font-black px-8 py-3 rounded-xl transition-all uppercase tracking-widest active:scale-95"
            >
              Done
            </button>
        </div>
      </div>
    </div>
  );
};
