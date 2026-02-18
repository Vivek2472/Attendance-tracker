
import React from 'react';
import { GraduationCap, ArrowRight, BarChart3, Calendar, Sparkles, ShieldCheck, Clock, BookOpen, FlaskConical } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string }> = ({ icon, title, description }) => (
  <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
    <div className="bg-indigo-50 w-14 h-14 rounded-xl flex items-center justify-center text-indigo-600 mb-6">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-800 mb-3">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{description}</p>
  </div>
);

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin }) => {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navigation */}
      <nav className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 p-2 rounded-lg text-white">
            <GraduationCap size={24} />
          </div>
          <span className="font-extrabold text-xl tracking-tighter text-slate-800 uppercase">Attendance Tracker</span>
        </div>
        <div className="hidden md:flex items-center gap-8">
          <button onClick={onLogin} className="text-slate-600 font-bold hover:text-indigo-600 transition-colors text-sm">Login</button>
          <button 
            onClick={onGetStarted}
            className="bg-indigo-600 text-white px-6 py-2.5 rounded-full font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-sm active:scale-95"
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 pb-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="animate-fade-in">
          <span className="inline-block bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6">
            Designed for Every Student
          </span>
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-8">
            Master Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Campus Attendance</span> with Precision.
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed mb-10 max-w-lg">
            A comprehensive platform to track theory classes, lab sessions, and academic progress. Join thousands of students staying ahead of the curve.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <button 
              onClick={onGetStarted}
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200 active:scale-95 group"
            >
              Start Tracking Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <div className="flex items-center gap-2 text-slate-400 text-sm px-4">
               <ShieldCheck size={18} className="text-green-500" />
               <span>Free for students</span>
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block animate-slide-up">
           <div className="absolute -inset-4 bg-indigo-100/50 rounded-3xl blur-3xl -z-10"></div>
           <div className="bg-slate-900 rounded-3xl p-4 shadow-2xl border border-slate-800">
              <div className="bg-white rounded-2xl p-6 min-h-[400px]">
                 <div className="flex justify-between items-center mb-8">
                    <div className="space-y-1">
                       <div className="h-2 w-24 bg-slate-100 rounded"></div>
                       <div className="h-4 w-32 bg-indigo-600 rounded"></div>
                    </div>
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-indigo-600 font-bold">75%</div>
                 </div>
                 <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4">
                       {[1,2,3,4].map(i => <div key={i} className="h-20 bg-slate-50 rounded-xl"></div>)}
                    </div>
                    <div className="h-2 w-full bg-slate-50 rounded-full overflow-hidden">
                       <div className="h-full w-2/3 bg-indigo-500"></div>
                    </div>
                    <div className="space-y-3">
                       <div className="h-12 w-full bg-indigo-50 rounded-xl"></div>
                       <div className="h-12 w-full bg-slate-50 rounded-xl"></div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="bg-slate-50/50 py-24 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Everything You Need to Succeed</h2>
            <p className="text-slate-500">Built for students, by students. Stop worrying about percentages and start focusing on your learning.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<BarChart3 size={28} />}
              title="Real-time Analytics"
              description="Get instant calculations of your attendance percentages across all sessions automatically."
            />
            <FeatureCard 
              icon={<Calendar size={28} />}
              title="Smart Scheduler"
              description="A specialized academic calendar that shows your specific weekly slots and keeps you organized."
            />
            <FeatureCard 
              icon={<Sparkles size={28} />}
              title="AI Coaching"
              description="Powered by Gemini, receive personalized insights and motivation based on your current tracking data."
            />
            <FeatureCard 
              icon={<Clock size={28} />}
              title="History Tracking"
              description="Review your entire semester's attendance history to understand your patterns and improvement."
            />
            <FeatureCard 
              icon={<BookOpen size={28} />}
              title="Subject Management"
              description="Easily organize multiple subjects with custom course codes, target goals, and color labels."
            />
            <FeatureCard 
              icon={<FlaskConical size={28} />}
              title="Session Flexibility"
              description="Whether it's a lecture, a practical, or a seminar, track every session with ease."
            />
          </div>
        </div>
      </section>

      {/* Footer / CTA */}
      <footer className="py-20 text-center px-6">
        <div className="bg-indigo-600 rounded-[3rem] p-16 max-w-5xl mx-auto text-white shadow-2xl shadow-indigo-100 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-20 opacity-10">
             <GraduationCap size={240} />
          </div>
          <h2 className="text-4xl font-bold mb-6">Ready to take control?</h2>
          <p className="text-indigo-100 mb-10 max-w-md mx-auto text-lg">Join thousands of students who have streamlined their academic life.</p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-indigo-600 px-10 py-4 rounded-2xl font-bold text-xl hover:bg-indigo-50 transition-all active:scale-95 shadow-xl relative z-10"
          >
            Get Started Free
          </button>
        </div>
        <p className="mt-12 text-slate-400 text-sm font-medium">© 2025 Attendance Tracker • The Ultimate Student Portal</p>
      </footer>
    </div>
  );
};
