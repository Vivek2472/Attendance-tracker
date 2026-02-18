
import React, { useState, useEffect, useCallback } from 'react';
import { Subject, TimeSlot } from '../types';
import { daysOfWeek, formatTime } from '../utils/dateUtils';
import { Plus, Trash2, Clock, BookOpen, Save, X, FlaskConical, AlertTriangle, Edit2, Calendar, Target, Hash } from 'lucide-react';

interface SubjectsProps {
  subjects: Subject[];
  setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
  onDeleteSubject?: (id: string) => void;
  variant?: 'theory' | 'lab';
}

const COLORS = ['#6366f1', '#ec4899', '#8b5cf6', '#14b8a6', '#f59e0b', '#3b82f6', '#10b981', '#ef4444'];

export const Subjects: React.FC<SubjectsProps> = ({ subjects, setSubjects, onDeleteSubject, variant = 'theory' }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formState, setFormState] = useState<Partial<Subject>>({
    name: '',
    code: '',
    targetAttendance: 75,
    schedule: [],
    color: COLORS[0],
    type: variant
  });

  const [tempSchedule, setTempSchedule] = useState<TimeSlot>({
    dayOfWeek: 1,
    startTime: '09:00',
    endTime: '10:00'
  });

  const resetForm = useCallback(() => {
    setIsAdding(false);
    setEditingId(null);
    setFormState({
      name: '',
      code: '',
      targetAttendance: 75,
      schedule: [],
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      type: variant
    });
  }, [variant]);

  const displayedSubjects = subjects.filter(s => (s.type || 'theory') === variant);

  const handleEditClick = (subject: Subject) => {
    setEditingId(subject.id);
    setFormState({ ...subject });
    setIsAdding(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSubject = () => {
    if (!formState.name) return;
    
    if (editingId) {
      setSubjects(prev => prev.map(s => s.id === editingId ? { ...s, ...formState } as Subject : s));
    } else {
      const subject: Subject = {
        id: crypto.randomUUID(),
        name: formState.name!,
        code: formState.code,
        color: formState.color || COLORS[0],
        targetAttendance: formState.targetAttendance || 75,
        schedule: formState.schedule || [],
        type: variant as 'theory' | 'lab'
      };
      setSubjects([...subjects, subject]);
    }
    resetForm();
  };

  const addScheduleToForm = () => {
    setFormState(prev => ({ ...prev, schedule: [...(prev.schedule || []), tempSchedule] }));
  };

  const removeScheduleFromForm = (index: number) => {
    setFormState(prev => {
      const updated = [...(prev.schedule || [])];
      updated.splice(index, 1);
      return { ...prev, schedule: updated };
    });
  };

  const handleDelete = () => {
    if (deleteId) {
      if (onDeleteSubject) {
        onDeleteSubject(deleteId);
      } else {
        setSubjects(subjects.filter(s => s.id !== deleteId));
      }
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-10">
      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center modal-backdrop p-6 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl border border-slate-100 animate-slide-up text-center">
            <div className="bg-red-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle className="w-8 h-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Course?</h3>
            <p className="text-slate-500 text-sm mb-8 leading-relaxed">
              Are you sure you want to remove <strong>{subjects.find(s => s.id === deleteId)?.name}</strong>? All attendance history will be lost.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2.5 rounded-xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all text-sm">Cancel</button>
              <button onClick={handleDelete} className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-all text-sm shadow-lg shadow-red-100">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Section Header */}
      <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{variant === 'lab' ? 'Laboratory Courses' : 'Academic Subjects'}</h2>
          <p className="text-xs font-semibold text-slate-400 mt-0.5">{displayedSubjects.length} records available</p>
        </div>
        {!editingId && (
            <button 
              onClick={() => setIsAdding(!isAdding)} 
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all font-bold text-sm ${isAdding ? 'bg-slate-100 text-slate-600' : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-95'}`}
            >
                {isAdding ? <X size={18} /> : <Plus size={18} />}
                <span>{isAdding ? 'Close' : `Add ${variant === 'lab' ? 'Lab' : 'Subject'}`}</span>
            </button>
        )}
      </div>

      {/* Inline Add/Edit Form */}
      {isAdding && (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl border border-slate-200 animate-slide-up">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
              {editingId ? <Edit2 size={18} className="text-indigo-600" /> : <Plus size={18} className="text-indigo-600" />}
              {editingId ? 'Modify' : 'New'} {variant === 'lab' ? 'Lab' : 'Subject'}
            </h3>
            {editingId && (
              <button onClick={resetForm} className="text-slate-400 hover:text-slate-600 p-2 rounded-lg">
                <X size={20} />
              </button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Subject Name</label>
              <input 
                type="text" 
                value={formState.name} 
                onChange={e => setFormState(prev => ({...prev, name: e.target.value}))} 
                placeholder="e.g. Computer Networks" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-semibold text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Course Code</label>
              <input 
                type="text" 
                value={formState.code} 
                onChange={e => setFormState(prev => ({...prev, code: e.target.value}))} 
                placeholder="e.g. CS401" 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-semibold text-sm" 
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Target Attendance (%)</label>
              <input 
                type="number" 
                value={formState.targetAttendance} 
                onChange={e => setFormState(prev => ({...prev, targetAttendance: Number(e.target.value)}))} 
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition font-semibold text-sm" 
              />
            </div>
             <div className="md:col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Color Label</label>
              <div className="flex flex-wrap gap-2.5">
                {COLORS.map(c => (
                  <button 
                    key={c} 
                    onClick={() => setFormState(prev => ({...prev, color: c}))} 
                    className={`w-7 h-7 rounded-full border-2 transition-all ${formState.color === c ? 'border-slate-800 ring-4 ring-slate-100' : 'border-transparent hover:scale-110'}`} 
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-6">
            <h4 className="text-sm font-bold text-slate-700 flex items-center gap-2 mb-4">
                <Clock size={16} className="text-slate-400" />
                Schedule Slots
            </h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end mb-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Day</label>
                <select 
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none" 
                  value={tempSchedule.dayOfWeek} 
                  onChange={e => setTempSchedule(prev => ({...prev, dayOfWeek: Number(e.target.value)}))}
                >
                  {daysOfWeek.map((d, i) => <option key={i} value={i}>{d}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Start</label>
                <input 
                  type="time" 
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none" 
                  value={tempSchedule.startTime} 
                  onChange={e => setTempSchedule(prev => ({...prev, startTime: e.target.value}))} 
                />
              </div>
              <div>
                 <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">End</label>
                 <input 
                  type="time" 
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold outline-none" 
                  value={tempSchedule.endTime} 
                  onChange={e => setTempSchedule(prev => ({...prev, endTime: e.target.value}))} 
                 />
              </div>
              <button 
                onClick={addScheduleToForm} 
                className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 py-2 rounded-lg transition-all flex items-center justify-center font-bold text-xs border border-indigo-200"
              >
                Add Slot
              </button>
            </div>
            
            <div className="flex flex-wrap gap-2 min-h-[40px]">
              {formState.schedule?.map((s, idx) => (
                <div key={idx} className="bg-slate-50 text-slate-600 text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-3 border border-slate-200">
                  <span>{daysOfWeek[s.dayOfWeek]} {formatTime(s.startTime)} — {formatTime(s.endTime)}</span>
                  <button onClick={() => removeScheduleFromForm(idx)} className="text-slate-300 hover:text-red-500 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end mt-8 pt-6 border-t border-slate-100 gap-3">
            <button onClick={resetForm} className="px-4 py-2 rounded-lg text-slate-500 font-bold hover:bg-slate-50 transition-all text-sm">Cancel</button>
            <button 
              onClick={handleSaveSubject} 
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all shadow-md text-sm active:scale-95"
            >
              {editingId ? 'Save Changes' : (variant === 'lab' ? 'Add lab' : 'Add subject')}
            </button>
          </div>
        </div>
      )}

      {/* Grid of Subject Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {displayedSubjects.map(subject => (
          <div key={subject.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all relative flex flex-col h-full overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: subject.color }}></div>
            
            <div className="flex justify-between items-start mb-4 pl-3">
              <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-bold text-slate-800 text-base leading-tight truncate" title={subject.name}>{subject.name}</h3>
                  {subject.type === 'lab' && (
                      <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded border border-purple-100">
                          LAB
                      </span>
                  )}
                </div>
                <div className="flex items-center gap-4 text-xs font-semibold text-slate-400 uppercase tracking-tighter">
                    {subject.code && <span>{subject.code}</span>}
                    <div className="flex items-center gap-1">
                       <Target size={12} className="opacity-50" />
                       <span>Target: {subject.targetAttendance}%</span>
                    </div>
                </div>
              </div>
              
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEditClick(subject)} className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all" title="Edit">
                  <Edit2 size={16} />
                </button>
                <button onClick={() => setDeleteId(subject.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>

            <div className="pl-3 space-y-4 mt-auto">
              <div className="flex flex-wrap gap-1.5">
                  {subject.schedule.length > 0 ? (
                    subject.schedule.map((s, i) => (
                      <div key={i} className="text-[10px] font-bold bg-slate-50 border border-slate-100 px-2 py-1 rounded text-slate-500 flex items-center gap-1.5">
                        <Clock size={10} className="opacity-50" />
                        {daysOfWeek[s.dayOfWeek]} {formatTime(s.startTime)}
                      </div>
                    ))
                  ) : (
                    <span className="text-xs text-slate-300 italic">No schedule set</span>
                  )}
              </div>
              
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-700" style={{ width: `${subject.targetAttendance}%`, backgroundColor: subject.color }}></div>
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {displayedSubjects.length === 0 && !isAdding && (
          <div className="col-span-full py-16 text-center bg-white rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center">
            <div className="bg-slate-50 p-6 rounded-full mb-4">
                {variant === 'lab' ? <FlaskConical size={48} className="text-slate-200" /> : <BookOpen size={48} className="text-slate-200" />}
            </div>
            <p className="font-bold text-slate-800 mb-1">No {variant === 'lab' ? 'labs' : 'subjects'} configured</p>
            <p className="text-slate-400 text-sm mb-6 max-w-xs px-4">Begin tracking your academic goals by adding your first {variant === 'lab' ? 'lab' : 'subject'}.</p>
            <button 
              onClick={() => setIsAdding(true)} 
              className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-md text-sm active:scale-95"
            >
                <Plus size={18} /> {variant === 'lab' ? 'Add lab' : 'Add subject'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};