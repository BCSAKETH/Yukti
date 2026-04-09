import React, { useRef } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebase';
import { 
  LogIn, Zap, Rocket, Target, ShieldCheck, BarChart3, Sparkles,
  ArrowRight, Globe, Users, Check, Brain, FileText, Landmark, Heart,
  ChevronLeft, ChevronRight, Activity, TrendingUp, Presentation, Coffee
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { cn } from '../lib/utils';
import { useAuth } from '../context/AuthContext';

export function LoginView() {
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Advanced Scroll Animations for Hero
  const { scrollYProgress: heroScroll } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  });

  // Transform values for scroll-linked animations
  const heroOpacity = useTransform(heroScroll, [0, 1], [1, 0]);
  const heroScale = useTransform(heroScroll, [0, 1], [1, 0.8]);

  const handleMouseMove = (e: React.MouseEvent) => {
    // Smoother, deeper parallax mapping
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
      className="bg-white text-slate-900 selection:bg-teal-500/20 relative"
    >
      {/* Deep Parallax Background - Premium Light / Glassmorphism */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden h-screen w-screen">
        {/* Base Gradient Layer (Moves Slowestly) */}
        <motion.div 
          animate={{ x: mousePosition.x * 0.5, y: mousePosition.y * 0.5 }}
          transition={{ type: "spring", stiffness: 40, damping: 25 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-100/80 via-slate-50 to-emerald-50/50"
        />
        
        {/* Floating Orbs (Moves Medium) */}
        <motion.div
           animate={{ x: mousePosition.x * 1.5, y: mousePosition.y * 1.5 }}
           transition={{ type: "spring", stiffness: 30, damping: 20 }}
           className="absolute top-[10%] left-[15%] w-[40rem] h-[40rem] bg-teal-300/20 blur-[130px] rounded-full mix-blend-multiply"
        />
        <motion.div
           animate={{ x: -mousePosition.x * 2, y: -mousePosition.y * 2 }}
           transition={{ type: "spring", stiffness: 25, damping: 15 }}
           className="absolute bottom-[10%] right-[10%] w-[45rem] h-[45rem] bg-emerald-300/20 blur-[130px] rounded-full mix-blend-multiply"
        />
        
        {/* Extreme Foreground Particle / Grid Layer (Moves Fastest) */}
        <motion.div
           animate={{ x: -mousePosition.x * 3, y: -mousePosition.y * 3, rotate: mousePosition.x * 0.05 }}
           transition={{ type: "spring", stiffness: 50, damping: 30 }}
           className="absolute inset-0 opacity-[0.03] pointer-events-none"
           style={{ backgroundImage: 'radial-gradient(currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        {/* Global Frost Effect */}
        <div className="absolute inset-0 bg-white/40 backdrop-blur-[8px]" />
      </div>

      {/* Header */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/60 backdrop-blur-2xl border-b border-slate-200/50 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center text-white shadow-[0_8px_24px_rgba(13,148,136,0.25)] group-hover:scale-110 group-hover:rotate-6 transition-all">
              <Zap size={22} fill="currentColor" />
            </div>
            <span className="text-2xl font-headline font-black tracking-tighter text-teal-950">Yukti</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-teal-700 transition-colors relative group">
                {item}
                <span className="absolute -bottom-2 left-0 w-0 h-0.5 bg-teal-500 transition-all group-hover:w-full" />
              </a>
            ))}
          </div>

          <button 
            onClick={signIn}
            className="bg-slate-900 px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest text-white hover:bg-teal-600 hover:shadow-[0_0_30px_rgba(13,148,136,0.3)] transition-all flex items-center gap-2 group"
          >
            Access Portal <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </nav>

      {/* Main Content Scroll Container */}
      <div className="relative z-10 pt-40 pb-32">
        
        {/* Hero Section (Fades and scales out on scroll) */}
        <motion.section 
          id="platform"
          ref={heroRef}
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="min-h-[85vh] flex items-center max-w-7xl mx-auto px-6 origin-top"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center w-full">
            <div className="space-y-10 relative">
              {/* Floating badges linked to mouse */}
              <motion.div 
                 animate={{ x: mousePosition.x * -1, y: mousePosition.y * -1 }}
                 className="absolute -top-16 -left-10 w-24 h-24 bg-white/60 backdrop-blur-md rounded-3xl border border-white/50 shadow-xl flex items-center justify-center hidden lg:flex"
              >
                  <Target size={32} className="text-teal-500" />
              </motion.div>
              <motion.div 
                 animate={{ x: mousePosition.y * 1.5, y: mousePosition.x * 1.5 }}
                 className="absolute bottom-10 -right-12 w-32 h-32 bg-white/80 backdrop-blur-lg rounded-[2.5rem] border border-white border-b-slate-200 shadow-2xl flex flex-col items-center justify-center hidden lg:flex"
              >
                  <TrendingUp size={32} className="text-emerald-500 mb-2" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400">+140% Impact</span>
              </motion.div>

              <motion.div 
                 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                 className="inline-flex items-center gap-3 bg-white/70 backdrop-blur-xl border border-white/50 px-5 py-2.5 rounded-full shadow-sm"
              >
                 <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-800">The Ultimate Execution Engine</span>
              </motion.div>

              <motion.h1 
                initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.8 }}
                className="text-[5.5rem] lg:text-[7rem] font-headline font-black text-slate-900 leading-[0.85] tracking-tighter"
              >
                Simulate <br />
                <span className="bg-gradient-to-br from-teal-600 to-emerald-600 bg-clip-text text-transparent italic pr-2">Impact Mastery.</span>
              </motion.h1>

              <motion.p 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.8 }}
                className="text-xl text-slate-600 leading-relaxed max-w-lg font-medium"
              >
                A world-class strategic laboratory for social architects. Bridge the gap between vision and reality with high-fidelity behavioral simulations.
              </motion.p>

              <motion.div 
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col sm:flex-row items-center gap-5 pt-6"
              >
                <button 
                  onClick={signIn}
                  className="w-full sm:w-auto bg-gradient-to-r from-teal-500 to-emerald-600 text-white px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_40px_rgba(13,148,136,0.25)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 group"
                >
                  Enter Simulation <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </button>
                <a 
                  href="#details" 
                  className="w-full sm:w-auto bg-white/50 backdrop-blur-md border border-slate-200 text-slate-700 px-12 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white hover:shadow-xl transition-all flex items-center justify-center"
                >
                  Explore Details
                </a>
              </motion.div>
            </div>

            {/* Hero Right: Floating Interactive UI Representation */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotateY: 20 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} transition={{ delay: 0.4, duration: 1, type: "spring" }}
              className="relative perspective-1000"
            >
               <motion.div 
                 animate={{ rotateX: mousePosition.y * 0.5, rotateY: mousePosition.x * -0.5 }}
                 className="p-2 sm:p-6"
                 style={{ transformStyle: 'preserve-3d' }}
               >
                  <QuantumStrategyOrb />
               </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Project Details Bento Box (Appears on scroll) */}
        <motion.section 
          id="details" 
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="py-32 max-w-7xl mx-auto px-6 relative"
        >
           <div className="text-center max-w-3xl mx-auto mb-20">
             <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-teal-600 mb-6">Safe Space for Youth</h3>
             <h2 className="text-5xl md:text-6xl font-headline font-black text-slate-900 tracking-tighter leading-tight">
                Not Just a Tool. <br/>
                <span className="italic font-light text-slate-500">A Strategic Sandbox.</span>
             </h2>
             <p className="mt-8 text-lg text-slate-600 font-medium leading-relaxed">
               Yukti was explicitly architected for the CodeNyx Hackathon to provide a gamified, high-fidelity environment where future social entrepreneurs can practice decision-making without real-world financial ruin.
             </p>
           </div>

           {/* Bento Grid Design */}
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Core Mechanics */}
              <div className="md:col-span-2 bg-gradient-to-br from-white to-slate-50 rounded-[3rem] p-12 border border-slate-100 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 group-hover:opacity-[0.05] transition-all"><BarChart3 size={200}/></div>
                 <div className="w-16 h-16 rounded-3xl bg-teal-100 text-teal-600 flex items-center justify-center mb-8 shadow-inner"><Activity size={32}/></div>
                 <h3 className="text-3xl font-headline font-black text-slate-900 mb-4">Impact Sprint Games</h3>
                 <p className="text-slate-600 font-medium leading-relaxed max-w-md">Experience high-pressure rapid-fire scenarios. React to funding cuts, supply chain crises, and PR disasters in milliseconds. Survive the event cascade and build your resilience.</p>
              </div>

              {/* Live Boardroom */}
              <div className="bg-gradient-to-bl from-teal-50 to-emerald-50 rounded-[3rem] p-12 border border-teal-100 shadow-xl group hover:shadow-2xl transition-all relative overflow-hidden">
                 <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white blur-2xl opacity-50" />
                 <div className="w-16 h-16 rounded-3xl bg-white text-emerald-600 flex items-center justify-center mb-8 shadow-sm"><Presentation size={32}/></div>
                 <h3 className="text-2xl font-headline font-black text-slate-900 mb-4">Live Voice Boardroom</h3>
                 <p className="text-slate-600 font-medium leading-relaxed">Use your microphone to dynamically pitch to AI-powered stakeholders (simulating real Shark Tank investors) powered by Mistral 7B inference.</p>
              </div>

              {/* Social Tokenomics */}
              <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl relative overflow-hidden group">
                 <div className="absolute top-8 right-8 text-indigo-100 group-hover:rotate-12 transition-transform"><Landmark size={80} /></div>
                 <div className="h-full flex flex-col justify-end">
                    <h3 className="text-2xl font-headline font-black text-slate-900 mb-4">Mock Tokenomics</h3>
                    <p className="text-slate-600 font-medium leading-relaxed">Converting social good into tangible assets using the mock 'Yukti Coin' (YKC) to demonstrate Web3 incentive structures.</p>
                 </div>
              </div>

              {/* Market Benchmarking */}
              <div className="md:col-span-2 bg-slate-900 rounded-[3rem] p-12 border border-slate-800 shadow-2xl relative overflow-hidden group text-white">
                 <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-teal-500/20 to-transparent pointer-events-none" />
                 <div className="w-16 h-16 rounded-3xl bg-white/10 text-teal-400 flex items-center justify-center mb-8 backdrop-blur-md"><Globe size={32}/></div>
                 <h3 className="text-3xl font-headline font-black text-white mb-4">Global Benchmarking</h3>
                 <p className="text-slate-300 font-medium leading-relaxed max-w-lg mb-8">Not sure if your venture is viable? Run standard diagnostics against historical data from elite accelerators like Y Combinator and Techstars.</p>
                 <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 text-[10px] font-black uppercase tracking-widest content-fit">
                    Powered by Groq AI
                 </div>
              </div>
           </div>
        </motion.section>

         {/* Methodology Section */}
        <section id="methodology" className="py-32 relative">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
             <div className="bg-white/40 backdrop-blur-3xl border border-white/60 rounded-[4rem] p-16 shadow-[0_40px_100px_rgba(20,184,166,0.08)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
                   <div>
                     <h3 className="text-[12px] font-black uppercase tracking-[0.4em] text-teal-600 mb-6">Our Methodology</h3>
                     <h2 className="text-6xl lg:text-7xl font-headline font-black text-slate-900 tracking-tighter leading-[0.9] mb-10">
                       Decisions <br />
                       <span className="italic bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent pr-2">Defined.</span>
                     </h2>
                     <div className="space-y-10">
                        {[
                          { title: 'Data-Driven Simulation', desc: 'Every scenario is derived from real-world startup failure & success patterns.' },
                          { title: 'Stakeholder Roleplay', desc: 'AI-agents trained on specific risk/reward profiles challenge your assumptions.' },
                          { title: 'Accelerator Diagnostic', desc: 'Real-time alignment checking against top-tier benchmark requirements.' }
                        ].map((item, i) => (
                          <div key={i} className="flex gap-6 group hover:translate-x-3 transition-transform duration-500">
                             <div className="w-14 h-14 shrink-0 rounded-3xl bg-teal-50/50 shadow-inner flex items-center justify-center text-teal-600 font-black text-xl border border-teal-100/50 group-hover:bg-gradient-to-br group-hover:from-teal-400 group-hover:to-teal-600 group-hover:text-white group-hover:shadow-[0_10px_30px_rgba(20,184,166,0.3)] transition-all relative overflow-hidden">
                                {i+1}
                                <div className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                             </div>
                             <div>
                                <h4 className="text-2xl font-headline font-black text-slate-900 mb-2">{item.title}</h4>
                                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                             </div>
                          </div>
                        ))}
                     </div>
                   </div>
                   <div className="relative h-full flex flex-col justify-center">
                     <div className="bg-slate-900 rounded-[3.5rem] p-12 text-white shadow-[0_50px_100px_rgba(15,23,42,0.3)] relative overflow-hidden group">
                        {/* Shimmer Effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[100%] group-hover:animate-[shimmer_2s_infinite]" />
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/20 blur-[80px] -mr-32 -mt-32 rounded-full transition-all group-hover:bg-teal-400/30" />
                        <Coffee size={48} className="text-teal-400 mb-10 transition-transform group-hover:rotate-12 group-hover:scale-110" />
                        <h3 className="text-5xl font-headline font-black mb-6 leading-tight">Master the <br /> Art of Impact.</h3>
                        <p className="text-slate-300 text-xl leading-relaxed font-medium mb-12 italic border-l-4 border-teal-500 pl-6">"This platform doesn't just teach you how to build a business; it teaches you how to maintain trust in a world of high-friction stakeholders."</p>
                        <div className="flex items-center gap-4 bg-white/5 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
                           <div className="w-1.5 h-12 bg-emerald-400 rounded-full shadow-[0_0_20px_rgba(52,211,153,0.8)] animate-pulse" />
                           <div>
                             <p className="font-headline font-black text-white text-xl">CodeNyx Ready</p>
                             <p className="text-[11px] font-black uppercase text-emerald-400 tracking-[0.25em]">Platform Final Build</p>
                           </div>
                        </div>
                     </div>
                   </div>
                </div>
             </div>
          </div>
        </section>

        {/* Simulations Section */}
        <section id="simulations" className="py-32 relative overflow-hidden">
           <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
              <div className="text-center mb-16">
                 <h2 className="text-5xl font-headline font-black text-slate-900">Elite Simulations. <br/><span className="text-teal-600 italic font-light">Zero Risk.</span></h2>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-10 snap-x custom-scrollbar">
                 {[
                   { title: 'The Water Crisis', type: 'Infrastructure', desc: 'Navigate a severe drought. Balance state budgets with immediate humanitarian needs.', icon: <Globe size={32}/> },
                   { title: 'Education Void', type: 'EdTech', desc: 'Launch a high-tech learning app in a region with 20% internet penetration.', icon: <Brain size={32}/> },
                   { title: 'Carbon Marketplace', type: 'FinTech', desc: 'Build trust manually before the algorithm scales. Prevent corporate greenwashing.', icon: <Activity size={32}/> }
                 ].map((sim, i) => (
                   <div key={i} className="min-w-[350px] bg-white/60 backdrop-blur-xl border border-slate-200/60 rounded-[3rem] p-10 snap-center hover:-translate-y-4 hover:shadow-[0_40px_80px_rgba(20,184,166,0.15)] transition-all duration-500 group">
                      <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-teal-600 mb-8 group-hover:scale-110 group-hover:bg-teal-50 transition-all shadow-inner">
                         {sim.icon}
                      </div>
                      <div className="inline-flex px-3 py-1 bg-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">{sim.type}</div>
                      <h3 className="text-2xl font-headline font-black text-slate-900 mb-4">{sim.title}</h3>
                      <p className="text-slate-600 font-medium leading-relaxed">{sim.desc}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-32 relative">
          <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
             <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-[2.5rem] text-white shadow-[0_20px_50px_rgba(20,184,166,0.3)] mb-10 rotate-3">
                <Sparkles size={48} />
             </div>
             <h2 className="text-5xl md:text-6xl font-headline font-black text-slate-900 mb-8 leading-tight tracking-tighter">
                Built to Scale <br/> <span className="italic text-slate-400 font-light">Global Empathy.</span>
             </h2>
             <p className="text-xl text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto mb-12">
                Yukti was designed specifically for the CodeNyx environment. It forces the next generation of builders to realize that code alone doesn't solve systemic issues—alignment does.
             </p>
             <button onClick={signIn} className="px-10 py-5 bg-slate-900 text-white rounded-full font-black uppercase tracking-widest text-sm shadow-2xl hover:bg-teal-600 hover:-translate-y-1 transition-all">
                Join the Network
             </button>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 mt-20 relative z-10">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
             <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-teal-100 flex items-center justify-center text-teal-600">
                   <Zap size={16} fill="currentColor" />
                </div>
                <span className="text-xl font-headline font-black tracking-tighter text-slate-900">Yukti</span>
             </div>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">© 2026 Yukti Platform. Created for CodeNyx.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function QuantumStrategyOrb() {
  return (
    <div className="relative aspect-square w-full max-w-[500px] mx-auto flex items-center justify-center">
      {/* Central Glowing Core */}
      <motion.div 
        animate={{ scale: [1, 1.05, 1], rotate: 360 }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute w-64 h-64 bg-gradient-to-br from-teal-300 to-emerald-200 rounded-full blur-[40px] opacity-60 mix-blend-multiply" 
      />
      
      {/* Central Glass Element */}
      <div className="absolute w-48 h-48 bg-white/40 backdrop-blur-xl border border-white rounded-[3rem] shadow-[0_20px_50px_rgba(20,184,166,0.2)] flex items-center justify-center z-20">
         <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-inner pt-2 pl-1 group hover:scale-110 transition-transform">
            <Zap size={40} className="text-white drop-shadow-md pb-1 pr-1" />
         </div>
      </div>

      {/* Orbiting Elements */}
      {[
         { icon: <Target className="text-rose-500" size={20}/>, label: "Scale", delay: 0, ring: "w-[280px] h-[280px]", speed: 40 },
         { icon: <ShieldCheck className="text-teal-600" size={24}/>, label: "Trust", delay: 1.5, ring: "w-[360px] h-[360px]", speed: -35 },
         { icon: <Brain className="text-indigo-500" size={20}/>, label: "Logic", delay: 3, ring: "w-[440px] h-[440px]", speed: 50 },
         { icon: <Activity className="text-amber-500" size={18}/>, label: "Momentum", delay: 1, ring: "w-[320px] h-[320px]", speed: -60 },
         { icon: <Landmark className="text-emerald-500" size={20}/>, label: "Budget", delay: 2.5, ring: "w-[400px] h-[400px]", speed: 55 },
      ].map((orb, i) => (
        <motion.div 
          key={i}
          animate={{ rotate: orb.speed > 0 ? 360 : -360 }}
          transition={{ duration: Math.abs(orb.speed), repeat: Infinity, ease: "linear" }}
          className={`absolute ${orb.ring} border border-slate-200/50 rounded-full flex items-center justify-center z-30 pointer-events-none`}
        >
           <motion.div 
             animate={{ rotate: orb.speed > 0 ? -360 : 360 }} // Counter-rotate so content stays upright
             transition={{ duration: Math.abs(orb.speed), repeat: Infinity, ease: "linear" }}
             className="absolute -top-6 flex flex-col items-center gap-2 pointer-events-auto"
           >
              <div className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-2xl border border-white/50 shadow-xl flex items-center justify-center hover:scale-125 transition-transform cursor-pointer">
                 {orb.icon}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 bg-white/50 px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm">{orb.label}</span>
           </motion.div>
        </motion.div>
      ))}

      {/* Extreme Detail Floating Particles */}
      {[...Array(5)].map((_, i) => (
         <motion.div 
            key={`particle-${i}`}
            animate={{ 
               y: [0, -20, 0], 
               x: [0, 10, 0],
               opacity: [0.2, 0.8, 0.2]
            }}
            transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            className="absolute z-10 w-2 h-2 bg-teal-400 rounded-full blur-[1px]"
            style={{
               top: `${20 + i * 15}%`,
               left: `${10 + (i % 3) * 30}%`
            }}
         />
      ))}
    </div>
  );
}
