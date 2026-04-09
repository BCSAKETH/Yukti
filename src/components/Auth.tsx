import React, { useRef, useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  LogIn, Zap, Rocket, Target, ShieldCheck, BarChart3, Sparkles,
  ArrowRight, Globe, Users, Check, Brain, FileText, Landmark, Heart,
  ChevronLeft, ChevronRight, Activity, TrendingUp, Presentation, Coffee,
  X
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export function LoginView() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    setMousePosition({
      x: (e.clientX - window.innerWidth / 2) / 40,
      y: (e.clientY - window.innerHeight / 2) / 40,
    });
  };

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  const navItems = ['Platform', 'Methodology', 'Details', 'Simulations', 'About'];

  return (
    <div 
      onMouseMove={handleMouseMove}
      className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white selection:bg-teal-500/20 relative transition-colors duration-500"
    >
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen">
        <motion.div 
          animate={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/80 via-slate-50 to-emerald-50/50 dark:from-teal-900/20 dark:via-slate-950 dark:to-emerald-900/20"
        />
        
        <motion.div
           animate={{ x: mousePosition.x * 1.5, y: mousePosition.y * 1.5 }}
           className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] bg-teal-300/20 dark:bg-teal-500/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-lighten"
        />
        <motion.div
           animate={{ x: -mousePosition.x * 2, y: -mousePosition.y * 2 }}
           className="absolute bottom-[10%] right-[10%] w-[45rem] h-[45rem] bg-emerald-300/20 dark:bg-emerald-500/10 blur-[130px] rounded-full mix-blend-multiply dark:mix-blend-lighten"
        />

        <div className="absolute inset-0 bg-white/40 dark:bg-slate-950/40 backdrop-blur-[8px]" />
      </div>

      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 dark:bg-slate-950/60 backdrop-blur-2xl border-b border-slate-200/50 dark:border-white/5 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-[0_8px_24px_rgba(13,148,136,0.25)] group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-headline font-black tracking-tighter text-teal-950 dark:text-white">Yukti</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-white/40 hover:text-teal-700 dark:hover:text-teal-400 transition-colors relative group">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-teal-500 dark:bg-teal-400 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <button 
            onClick={signIn}
            className="bg-slate-900 dark:bg-white px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white dark:text-slate-950 hover:bg-teal-600 dark:hover:bg-teal-400 hover:shadow-[0_0_30px_rgba(13,148,136,0.3)] transition-all flex items-center gap-2 group"
          >
            Access Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      <div className="relative z-10 pt-40 pb-32">
        <motion.section 
          id="platform"
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="min-h-[85vh] flex items-center max-w-7xl mx-auto px-6 origin-top"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
            <div className="space-y-10 relative">
              <motion.div 
                 animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
                 className="absolute -top-16 -left-10 w-24 h-24 bg-white/60 dark:bg-white/5 backdrop-blur-md rounded-3xl border border-white/50 dark:border-white/10 shadow-xl flex items-center justify-center hidden lg:flex"
              >
                  <Target size={32} className="text-teal-500" />
              </motion.div>
              <motion.div 
                 animate={{ x: mousePosition.y * 1.5, y: mousePosition.x * 1.5 }}
                 className="absolute bottom-10 -right-12 w-32 h-32 bg-white/80 dark:bg-white/5 backdrop-blur-lg rounded-[2.5rem] border border-white dark:border-white/10 shadow-2xl flex flex-col items-center justify-center hidden lg:flex"
              >
                  <TrendingUp size={32} className="text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400 dark:text-white/40">+140% Impact</span>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-3 bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/50 dark:border-white/10 px-5 py-2.5 rounded-full shadow-sm"
              >
                 <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-800 dark:text-teal-400">The Ultimate Execution Engine</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
                className="text-[5.5rem] lg:text-[7rem] font-headline font-black text-slate-900 dark:text-white leading-[0.85] tracking-tighter"
              >
                Simulate <br />
                <span className="bg-gradient-to-br from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent italic pr-2">Impact Mastery.</span>
              </motion.h1>

              <p className="text-xl text-slate-600 dark:text-white/60 leading-relaxed max-w-lg font-medium">
                A world-class strategic laboratory for social architects. Bridge the gap between vision and reality with high-fidelity behavioral simulations.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-5 pt-6">
                <button 
                  onClick={signIn}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(13,148,136,0.25)] hover:scale-105 transition-all flex items-center justify-center gap-4 group"
                >
                  Enter Simulation <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <a 
                  href="#details" 
                  className="w-full sm:w-auto bg-white/50 dark:bg-white/5 backdrop-blur-md border border-slate-200 dark:border-white/10 text-slate-700 dark:text-white/70 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white dark:hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  Explore Details
                </a>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              className="relative perspective-1000"
            >
               <QuantumStrategyOrb mousePosition={mousePosition} />
            </motion.div>
          </div>
        </motion.section>

        <section id="details" className="py-32 max-w-7xl mx-auto px-6 relative">
           <div className="text-center max-w-3xl mx-auto mb-20">
             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-600 dark:text-teal-400 mb-6">Safe Space for Youth</h3>
             <h2 className="text-5xl md:text-6xl font-headline font-black text-slate-900 dark:text-white tracking-tighter leading-tight">
                Not Just a Tool. <br/>
                <span className="italic font-light text-slate-500 dark:text-white/40">A Strategic Sandbox.</span>
             </h2>
           </div>

           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 dark:from-white/5 dark:to-white/[0.02] rounded-[3rem] p-12 border border-slate-100 dark:border-white/10 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.02] dark:opacity-[0.05] transition-all"><BarChart3 size={200}/></div>
                 <div className="w-16 h-16 rounded-3xl bg-teal-100 dark:bg-teal-500/20 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-8"><Activity size={32}/></div>
                 <h3 className="text-3xl font-headline font-black text-slate-900 dark:text-white mb-4">Impact Sprint Games</h3>
                 <p className="text-slate-600 dark:text-white/60 font-medium leading-relaxed max-w-md">Experience high-pressure rapid-fire scenarios. React to funding cuts and supply chain crises in real-time.</p>
              </div>

              <div className="bg-gradient-to-bl from-teal-50 to-emerald-50 dark:from-emerald-500/10 dark:to-teal-500/10 rounded-[3rem] p-12 border border-teal-100 dark:border-white/10 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden">
                 <div className="w-16 h-16 rounded-3xl bg-white dark:bg-white/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-8"><Presentation size={32}/></div>
                 <h3 className="text-2xl font-headline font-black text-slate-900 dark:text-white mb-4">Voice Boardroom</h3>
                 <p className="text-slate-600 dark:text-white/60 font-medium leading-relaxed">Pitch to AI stakeholders with real-time sentiment tracking and posture coaching.</p>
              </div>
           </div>
        </section>
      </div>
    </div>
  );
}

function QuantumStrategyOrb({ mousePosition }: { mousePosition: { x: number, y: number } }) {
  return (
    <div className="relative aspect-square w-full max-w-[500px] mx-auto flex items-center justify-center">
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 bg-gradient-to-br from-teal-300 to-emerald-200 dark:from-teal-500 dark:to-emerald-400 rounded-full blur-[40px] opacity-60 dark:opacity-20" 
      />
      
      <div className="absolute w-48 h-48 bg-white/40 dark:bg-white/10 backdrop-blur-xl border border-white dark:border-white/20 rounded-[3rem] shadow-2xl flex items-center justify-center z-20">
         <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-inner pt-2 pl-1">
            <Zap size={40} className="text-white drop-shadow-md pb-1 pr-1" />
         </div>
      </div>

      {[
         { icon: <Target className="text-rose-500" size={20}/>, label: "Scale", speed: 40, ring: "w-[280px] h-[280px]" },
         { icon: <ShieldCheck className="text-teal-600 dark:text-teal-400" size={24}/>, label: "Trust", speed: -35, ring: "w-[360px] h-[360px]" },
         { icon: <Brain className="text-indigo-500 dark:text-indigo-400" size={20}/>, label: "Logic", speed: 50, ring: "w-[440px] h-[440px]" }
      ].map((orb, i) => (
        <motion.div 
          key={i}
          animate={{ rotate: orb.speed > 0 ? 360 : -360 }}
          transition={{ duration: Math.abs(orb.speed), repeat: Infinity, ease: "linear" }}
          className={`absolute ${orb.ring} border border-slate-200/50 dark:border-white/10 rounded-full flex items-center justify-center z-30 pointer-events-none`}
        >
           <motion.div 
             animate={{ rotate: orb.speed > 0 ? -360 : 360 }}
             className="absolute -top-6 flex flex-col items-center gap-2 pointer-events-auto"
           >
              <div className="w-12 h-12 bg-white/90 dark:bg-slate-900 rounded-2xl border border-white/50 dark:border-white/10 shadow-xl flex items-center justify-center hover:scale-125 transition-transform cursor-pointer">
                 {orb.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-white/40 bg-white/50 dark:bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">{orb.label}</span>
           </motion.div>
        </motion.div>
      ))}
    </div>
  );
}
