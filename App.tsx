
import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, Calendar as CalendarIcon, Book, GraduationCap, FlaskConical, LogOut, Settings as SettingsIcon, User } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { Subjects } from './components/Subjects';
import { Calendar } from './components/Calendar';
import { Onboarding } from './components/Onboarding';
import { Login } from './components/Login';
import { SignUp } from './components/SignUp';
import { Settings } from './components/Settings';
import { LandingPage } from './components/LandingPage';
import { Subject, AttendanceRecord, UserProfile } from './types';
import { auth, db } from './services/firebase';
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import { doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const safeStringify = (obj: any): string => {
  try {
    return JSON.stringify(obj);
  } catch (e) {
    console.error("Stringify failed, circular structure detected:", e);
    return "{}";
  }
};

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all font-semibold text-sm relative ${
      isActive ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-100'
    }`}
  >
    {isActive && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-indigo-600 rounded-r-full"></div>}
    {icon}
    {label}
  </button>
);

const App: React.FC = () => {
  const [authState, setAuthState] = useState<'loading' | 'auth' | 'onboarding' | 'app'>('loading');
  const [authView, setAuthView] = useState<'landing' | 'login' | 'signup'>('landing');
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'calendar' | 'subjects' | 'labs'>('dashboard');
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  const syncTimeoutRef = useRef<number | null>(null);
  const loadTimeoutRef = useRef<number | null>(null);
  const lastSyncedRef = useRef<string>("");

  const sanitizeData = (profile: any, subs: any[], att: any[]) => {
    return {
      profile: profile ? { 
        name: String(profile.name || ''), 
        year: String(profile.year || ''), 
        semester: String(profile.semester || '') 
      } : null,
      subjects: Array.isArray(subs) ? subs.map(s => ({
        id: String(s.id),
        name: String(s.name),
        code: String(s.code || ''),
        color: String(s.color),
        targetAttendance: Number(s.targetAttendance || 75),
        type: (s.type === 'lab' ? 'lab' : 'theory') as 'theory' | 'lab',
        schedule: Array.isArray(s.schedule) ? s.schedule.map((slot: any) => ({
          dayOfWeek: Number(slot.dayOfWeek),
          startTime: String(slot.startTime),
          endTime: String(slot.endTime)
        })) : []
      })) : [],
      attendance: Array.isArray(att) ? att.map(a => ({
        id: String(a.id),
        subjectId: String(a.subjectId),
        date: String(a.date),
        startTime: String(a.startTime),
        status: String(a.status || 'present') as any
      })) : []
    };
  };

  useEffect(() => {
    let unsubscribeData: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeData) unsubscribeData();
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);

      if (user && user.email) {
        setUserEmail(user.email);
        unsubscribeData = onSnapshot(doc(db, "users", user.email), (snapshot) => {
          if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
          if (snapshot.exists()) {
            const data = snapshot.data();
            const sanitized = sanitizeData(data.profile, data.subjects || [], data.attendance || []);
            const dataString = safeStringify(sanitized);
            if (dataString !== lastSyncedRef.current) {
                lastSyncedRef.current = dataString;
                setUserProfile(sanitized.profile);
                setSubjects(sanitized.subjects);
                setAttendance(sanitized.attendance);
                setAuthState(sanitized.profile ? 'app' : 'onboarding');
            }
          } else {
            setAuthState('onboarding');
          }
        }, (error) => {
          if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current);
          if (error.code === 'permission-denied') setAuthState('auth');
        });
      } else {
        setUserEmail(null);
        setAuthState('auth');
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeData) unsubscribeData();
    };
  }, []);

  useEffect(() => {
    if (userEmail && authState === 'app' && userProfile) {
      const sanitized = sanitizeData(userProfile, subjects, attendance);
      const dataString = safeStringify(sanitized);
      if (dataString === lastSyncedRef.current) return;
      if (syncTimeoutRef.current) clearTimeout(syncTimeoutRef.current);
      syncTimeoutRef.current = window.setTimeout(async () => {
        try {
          await setDoc(doc(db, "users", userEmail), sanitized);
          lastSyncedRef.current = dataString;
        } catch (error) {
          console.warn("Cloud save deferred");
        }
      }, 800); 
    }
  }, [subjects, attendance, userProfile, userEmail, authState]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setAuthState('auth');
      setAuthView('landing');
      setIsSettingsOpen(false);
      setUserProfile(null);
      setSubjects([]);
      setAttendance([]);
      lastSyncedRef.current = "";
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  const handleOnboardingComplete = async (profile: UserProfile) => {
    if (userEmail) {
      try {
        const sanitized = sanitizeData(profile, [], []);
        await setDoc(doc(db, "users", userEmail), sanitized);
        setUserProfile(profile);
        setAuthState('app');
      } catch (e) {
        console.error("Onboarding Save Error:", e);
      }
    }
  };

  if (authState === 'loading') {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-slate-50 animate-fade-in">
        <div className="relative">
          <div className="w-20 h-20 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="text-indigo-600 w-8 h-8" />
          </div>
        </div>
        <p className="mt-6 text-slate-500 font-bold tracking-widest animate-pulse uppercase text-[10px]">Loading</p>
      </div>
    );
  }

  if (authState === 'auth') {
    if (authView === 'landing') {
      return (
        <LandingPage 
          onGetStarted={() => {
            console.log("Navigating to login...");
            setAuthView('login');
          }} 
          onLogin={() => setAuthView('login')} 
        />
      );
    }
    return authView === 'login' 
      ? <Login onSignUpClick={() => setAuthView('signup')} onLoginSuccess={() => setAuthState('loading')} onBack={() => setAuthView('landing')} />
      : <SignUp onLoginClick={() => setAuthView('login')} onSignUpSuccess={() => setAuthState('loading')} />;
  }
  
  if (authState === 'onboarding') {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const TABS = {
    dashboard: <Dashboard subjects={subjects} attendance={attendance} setActiveTab={setActiveTab} />,
    calendar: <Calendar subjects={subjects} attendance={attendance} setAttendance={setAttendance} setActiveTab={setActiveTab} />,
    subjects: <Subjects subjects={subjects} setSubjects={setSubjects} onDeleteSubject={id => setSubjects(prev => prev.filter(s => s.id !== id))} variant="theory" />,
    labs: <Subjects subjects={subjects} setSubjects={setSubjects} onDeleteSubject={id => setSubjects(prev => prev.filter(s => s.id !== id))} variant="lab" />,
  };
  
  const navItems = [
      { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
      { id: 'calendar', icon: CalendarIcon, label: 'Calendar' },
      { id: 'subjects', icon: Book, label: 'Subjects' },
      { id: 'labs', icon: FlaskConical, label: 'Labs' },
      { id: 'profile', icon: User, label: 'Profile', action: () => setIsSettingsOpen(true) },
  ];

  return (
    <>
      <div className="flex h-screen bg-slate-50 text-slate-800">
        <aside className="hidden md:flex w-64 bg-white border-r border-slate-200 flex-col z-20">
          <div className="p-5 flex items-center gap-3 border-b border-slate-100 h-16">
            <div className="bg-indigo-600 p-2 rounded-lg text-white">
              <GraduationCap size={20} />
            </div>
            <h1 className="text-sm font-extrabold text-slate-800 tracking-tight uppercase">Attendance Tracker</h1>
          </div>
          <nav className="flex-1 p-3 space-y-2">
            <NavButton label="Dashboard" icon={<LayoutDashboard size={18} />} isActive={activeTab === 'dashboard'} onClick={() => setActiveTab('dashboard')} />
            <NavButton label="Calendar" icon={<CalendarIcon size={18} />} isActive={activeTab === 'calendar'} onClick={() => setActiveTab('calendar')} />
            <NavButton label="Subjects" icon={<Book size={18} />} isActive={activeTab === 'subjects'} onClick={() => setActiveTab('subjects')} />
            <NavButton label="Labs" icon={<FlaskConical size={18} />} isActive={activeTab === 'labs'} onClick={() => setActiveTab('labs')} />
          </nav>
          <div className="p-4 border-t border-slate-100">
            <div className="flex flex-col gap-3 bg-slate-50 rounded-xl p-3 border border-slate-200">
              <div className="flex items-center justify-between">
                <div className="overflow-hidden">
                  <p className="text-sm font-bold text-slate-800 truncate">{userProfile?.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Year {userProfile?.year} • Sem {userProfile?.semester}</p>
                </div>
                <button onClick={() => setIsSettingsOpen(true)} className="p-2 rounded-lg text-slate-500 hover:bg-indigo-100 hover:text-indigo-600 transition-all">
                    <SettingsIcon size={18} />
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative h-full pb-24 md:pb-0">
          <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 px-4 md:px-8 py-3 flex justify-between items-center sticky top-0 z-10 h-16">
            <h2 className="text-xl font-bold text-slate-800 hidden md:block">
              {activeTab === 'dashboard' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
            </h2>
            <div className="flex items-center gap-2 md:hidden">
                <div className="bg-indigo-600 p-1.5 rounded-lg text-white"><GraduationCap size={16} /></div>
                <span className="font-extrabold text-sm tracking-tight uppercase">Attendance Tracker</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">Semester {userProfile?.semester}</span>
            </div>
          </header>
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{TABS[activeTab]}</div>
        </main>

        <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 flex justify-around p-1 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            const clickHandler = item.action ? item.action : () => setActiveTab(item.id as any);
            return (
              <button key={item.id} onClick={clickHandler} className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all w-full ${isActive ? 'text-indigo-600 bg-indigo-50/50' : 'text-slate-400'}`}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                <span className="text-[9px] font-extrabold uppercase tracking-tighter">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>
      
      {isSettingsOpen && (
        <Settings 
            userProfile={userProfile!}
            onUpdate={p => {setUserProfile(p); setIsSettingsOpen(false);}}
            onLogout={handleLogout}
            onClose={() => setIsSettingsOpen(false)}
        />
      )}
    </>
  );
};

export default App;
