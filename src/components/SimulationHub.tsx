import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Play, 
  ArrowRight, 
  Trash2, 
  Clock, 
  Target, 
  Users, 
  Zap,
  Globe,
  Sparkles,
  Heart,
  X,
  Terminal,
  ChevronRight,
  Eye,
  FileText,
  ArrowUpDown,
  TrendingDown,
  Activity,
  Coins,
  Info,
  BookOpen,
  Search,
  ShieldCheck,
  Trophy
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { StartupDictionary } from './StartupDictionary';
import { cn, cleanJsonParse } from '../lib/utils';
import { toast } from 'sonner';
import { auth } from '../firebase';

const IMPACT_NEWS = [
  "Social venture in Bangalore saves 1M liters of water.",
  "New Gov scheme announced for Solar Startups in rural India.",
  "Impact Investors increasing portfolio allocation by 20% this quarter.",
  "Yukti Lab predicts 300% growth in AgTech social enterprises.",
  "Decentralized healthcare reaches 500 new villages today."
];

function ImpactTicker() {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-10 bg-slate-900/90 backdrop-blur-xl border-t border-white/5 z-50 overflow-hidden flex items-center">
      <div className="flex items-center gap-4 px-6 border-r border-white/10 bg-teal-500/10 h-full">
        <div className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
        <span className="text-[7px] font-black text-teal-400 uppercase tracking-[0.3em] whitespace-nowrap">Global Feed</span>
      </div>
      <div className="flex-1 overflow-hidden relative">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="flex gap-16 items-center whitespace-nowrap px-8"
        >
          {Array(4).fill(IMPACT_NEWS).flat().map((news, i) => (
            <span key={i} className="text-[9px] font-bold text-white/40 uppercase tracking-widest flex items-center gap-2">
              <Sparkles size={10} className="text-teal-500/40" /> {news}
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function FlippableVentureCard({ sim, onDelete, onResume, onPitch }: { sim: any, onDelete: (id: string) => void, onResume: () => void, onPitch: () => void }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [swot, setSwot] = useState<any>(null);
  const [isScanning, setIsScanning] = useState(false);

  const fetchSwot = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (swot) { setIsFlipped(!isFlipped); return; }
    
    // Check for Yukti Coins
    const SW_COST = 50;
    if ((state.yuktiCoins || 0) < SW_COST) {
      toast.error(`Need ${SW_COST} YKC for a Strategic Audit!`);
      return;
    }

    setIsScanning(true);
    try {
      const prompt = `Generate a 4-point SWOT analysis for this social venture: ${sim.idea}. Output ONLY JSON: { "strengths": "string", "weaknesses": "string", "opportunities": "string", "threats": "string" }`;
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${(import.meta as any).env.VITE_GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' }
        })
      });
      const data = await response.json();
      const result = cleanJsonParse(data.choices[0].message.content);
      
      // Deduct coins only on success
      updateState({ yuktiCoins: state.yuktiCoins - SW_COST });
      setSwot(result);
      setIsFlipped(true);
      toast.success(`Audit Complete! -${SW_COST} YKC`);
    } catch (err) {
      toast.error("Analysis failed. Try again.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="relative w-full h-[320px] perspective-1000">
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full relative"
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front Face */}
        <div className="absolute inset-0 backface-hidden">
          <div className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 h-full p-8 flex flex-col hover:border-teal-500/30 transition-all hover:shadow-2xl">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-teal-500 text-slate-950 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-6 transition-transform">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h4 className="text-2xl font-headline font-black text-slate-900 dark:text-white line-clamp-1">{(sim.idea || 'Venture Lab').split('.')[0].split(':')[0]}</h4>
                  <p className="text-[8px] font-bold text-teal-500 uppercase tracking-widest mt-1">Status: Active Simulation</p>
                </div>
              </div>
              <button 
                onClick={(e) => { e.stopPropagation(); onDelete(sim.id); }}
                className="p-3 text-slate-300 dark:text-white/20 hover:text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
              <div className="space-y-1">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Impact</span>
                <p className="text-base font-black text-slate-900 dark:text-white">{sim.metrics?.impactScore || 0}%</p>
              </div>
              <div className="space-y-1">
                <span className="text-[7px] font-black text-slate-400 uppercase tracking-widest">Growth</span>
                <p className="text-base font-black text-slate-900 dark:text-white">{sim.metrics?.revenueGrowth || 0}%</p>
              </div>
            </div>

            <div className="mt-auto flex gap-3">
              <button 
                onClick={onResume}
                className="flex-1 bg-slate-950 dark:bg-white text-white dark:text-slate-950 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                Resume <Play size={12} fill="currentColor" />
              </button>
              <button 
                onClick={onPitch}
                className="flex-1 bg-teal-500 text-slate-950 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center justify-center gap-2"
              >
                Pitch <Terminal size={12} />
              </button>
              <button 
                onClick={fetchSwot}
                disabled={isScanning}
                className="w-14 h-12 bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-2xl flex items-center justify-center hover:bg-slate-50 dark:hover:bg-white/10 transition-all text-teal-500"
              >
                {isScanning ? <div className="w-4 h-4 border-2 border-teal-500/20 border-t-teal-500 rounded-full animate-spin" /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        {/* Back Face */}
        <div 
          className="absolute inset-0 backface-hidden bg-slate-900 rounded-[2.5rem] border-2 border-teal-500/40 p-8 flex flex-col shadow-2xl overflow-hidden"
          style={{ transform: 'rotateY(180deg)' }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-transparent pointer-events-none" />
          <div className="flex justify-between items-center mb-6">
            <h5 className="text-[10px] font-black text-teal-400 uppercase tracking-[0.3em]">Strategic Audit (SWOT)</h5>
            <button onClick={() => setIsFlipped(false)} className="text-white/40 hover:text-white"><X size={16} /></button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 flex-1">
            {[
              { label: 'Strengths', key: 'strengths', color: 'bg-emerald-500/10 text-emerald-400' },
              { label: 'Weaknesses', key: 'weaknesses', color: 'bg-rose-500/10 text-rose-400' },
              { label: 'Opportunities', key: 'opportunities', color: 'bg-blue-500/10 text-blue-400' },
              { label: 'Threats', key: 'threats', color: 'bg-amber-500/10 text-amber-400' }
            ].map((col) => (
              <div key={col.key} className={cn("p-4 rounded-2xl flex flex-col", col.color)}>
                <span className="text-[7px] font-black uppercase tracking-widest mb-1 opacity-60">{col.label}</span>
                <p className="text-[9px] font-bold leading-tight">{swot?.[col.key] || 'Analyzing...'}</p>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function SimulationHub({ setActiveTab, onSprint }: { setActiveTab: (tab: string) => void, onSprint: (idea: string) => void }) {
  const { state, updateState, startNewSimulation, deleteSimulation, localSims, t } = useSimulation();
  const user = auth.currentUser;
  const [showWizard, setShowWizard] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [localDraft, setLocalDraft] = useState(state.draftIdea);
  const [targetUsers, setTargetUsers] = useState('');
  const [painPoint, setPainPoint] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = async () => {
    if (!localDraft.trim()) {
       toast.error("Please enter your startup idea!");
       return;
    }
    setIsCreating(true);
    const enrichedIdea = `Idea: ${localDraft}. Target: ${targetUsers}. Solving: ${painPoint}`;
    
    const REWARD = 500;
    await updateState({ yuktiCoins: (state.yuktiCoins || 0) + REWARD });
    
    await startNewSimulation({ id: `temp-${Date.now()}`, name: localDraft, region: 'India', pitch: enrichedIdea });
    setShowWizard(false);
    setIsCreating(false);
    toast.success(`Venture initialized! Seed Grant: +${REWARD} YKC Credited.`);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-surface-lowest dark:bg-slate-950 p-6 md:p-12 custom-scrollbar transition-colors duration-500">
      <div className="fixed inset-0 pointer-events-none opacity-20 dark:opacity-40 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-teal-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto space-y-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 pb-8 border-b border-slate-100 dark:border-white/5">
          <div className="space-y-4">
            <motion.div 
               initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
               className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-teal-500/20"
            >
               <Activity size={12} /> Live Simulation Status: Optimized
            </motion.div>
            <h2 className="text-6xl font-headline font-black text-on-surface dark:text-white leading-[0.9] tracking-tighter">
               {t('welcome')}, <span className="bg-gradient-to-r from-teal-500 to-emerald-400 bg-clip-text text-transparent italic">{user?.displayName?.split(' ')[0] || 'Architect'}.</span>
            </h2>
            <p className="text-on-surface-variant dark:text-white/40 max-w-xl text-lg font-medium leading-relaxed">
               Welcome to the <span className="text-teal-600 dark:text-teal-400 font-bold">Yukti Max Pro</span> simulation ecosystem. Track your ventures, accumulate YKC, and scale your impact.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="group relative flex items-center gap-3 bg-white dark:bg-white/5 backdrop-blur-xl px-6 py-4 rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg transition-all hover:bg-slate-50 dark:hover:bg-white/10">
                <div className="p-2 bg-amber-500/20 rounded-xl group-hover:scale-110 transition-transform">
                   <Coins size={20} className="text-amber-500" />
                </div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 dark:text-white/40 uppercase tracking-widest">Available Balance</p>
                   <p className="text-xl font-headline font-black text-slate-900 dark:text-white leading-none">{(state.yuktiCoins || 0).toLocaleString()} <span className="text-xs text-amber-500/80">YKC</span></p>
                </div>
                <div className="absolute top-[-140%] left-0 w-64 bg-slate-900 text-white p-4 rounded-2xl text-[10px] leading-relaxed hidden group-hover:block border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex items-center gap-2 mb-2">
                     <Info size={12} className="text-teal-400" />
                     <span className="font-black uppercase tracking-widest text-teal-400">Why YKC?</span>
                   </div>
                   Yukti Coins represent your venture's Resource Efficiency. Earn them by winning boardroom pitches and surviving market sprints. Use them to unlock advanced investor directories and gov schemes.
                </div>
             </div>

             <motion.button
               whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
               onClick={() => setShowWizard(true)}
               className="flex items-center gap-3 bg-teal-600 hover:bg-teal-500 dark:bg-teal-500 dark:hover:bg-teal-400 text-white dark:text-slate-950 px-8 py-4 rounded-3xl font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-teal-500/20"
             >
               <Plus size={20} /> Initialize New Venture
             </motion.button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-xs font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em]">Active Portfolio</h3>
              <div className="flex items-center gap-2 text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-widest bg-teal-500/5 px-3 py-1 rounded-full border border-teal-500/10">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-500 animate-pulse" />
                {(localSims || []).length} {t('simulations')} Enrolled
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <AnimatePresence mode="popLayout">
                {(localSims || []).length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="p-16 border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[3rem] text-center space-y-6 bg-slate-50/50 dark:bg-white/[0.02]"
                  >
                    <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target size={32} className="text-slate-300 dark:text-white/20" />
                    </div>
                    <div>
                      <h4 className="text-xl font-headline font-black text-slate-800 dark:text-white mb-2 italic">Ready to make an impact?</h4>
                      <p className="text-slate-500 dark:text-white/40 text-sm max-w-xs mx-auto font-medium">Initialize your first social venture to begin the simulation journey.</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {localSims.map((sim, idx) => (
                      <FlippableVentureCard 
                        key={sim.id} 
                        sim={sim} 
                        onDelete={(id) => deleteSimulation(id, true)} 
                        onResume={() => {
                          updateState({ scenarioId: sim.id, status: 'active' });
                          setActiveTab('workspace');
                        }} 
                        onPitch={() => {
                          updateState({ scenarioId: sim.id, status: 'active', pitch: sim.idea });
                          setActiveTab('boardroom');
                        }}
                      />
                    ))}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="space-y-8">
            <section className="bg-white dark:bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-slate-200 dark:border-white/10 p-8 shadow-xl">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-xl font-headline font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Venture Intelligence</h3>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={() => setShowDictionary(true)}
                  className="w-full group p-6 bg-slate-50 dark:bg-white/[0.03] hover:bg-teal-50 dark:hover:bg-teal-500/10 border border-slate-100 dark:border-white/5 hover:border-teal-500/20 rounded-3xl transition-all text-left flex items-center justify-between"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white dark:bg-white/10 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                      <Search className="text-teal-500" size={20} />
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-widest leading-none mb-1">Startup Dictionary</h4>
                      <p className="text-[10px] font-medium text-slate-400 dark:text-white/40">50+ Decoded Terms</p>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-teal-500 transition-colors" />
                </button>

                <div className="p-6 bg-slate-900 dark:bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden group">
                   <div className="absolute top-[-20%] right-[-10%] w-32 h-32 bg-teal-500/10 blur-[40px] rounded-full group-hover:scale-125 transition-transform" />
                   <div className="relative z-10 space-y-3">
                      <div className="flex items-center gap-2">
                        <ShieldCheck size={14} className="text-teal-400" />
                        <span className="text-[10px] font-black text-white uppercase tracking-widest">Growth Safeguard</span>
                      </div>
                      <p className="text-xs font-bold text-white/60 leading-relaxed">
                        The Yukti Lab monitors your decision patterns for scalable "impact-first" growth.
                      </p>
                   </div>
                </div>
              </div>
            </section>

            <section className="bg-gradient-to-br from-teal-600 to-emerald-700 dark:from-teal-500/20 dark:to-emerald-500/10 p-8 rounded-[2.5rem] text-white overflow-hidden relative group shadow-2xl">
              <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-45 transition-transform"><Trophy size={160}/></div>
              <div className="relative z-10 space-y-6">
                 <div>
                   <h3 className="text-2xl font-headline font-black leading-tight italic mb-2 tracking-tighter">Mission Control</h3>
                   <p className="text-white/70 text-sm font-medium leading-relaxed">Your objective is to reach <span className="text-white font-black underline decoration-white/40 underline-offset-4">Series A</span> social funding through the boardroom.</p>
                 </div>
                 
                 <div className="space-y-3">
                   <div className="flex justify-between text-[11px] font-black uppercase tracking-widest mb-1.5 opacity-60">
                     <span>Platform Mastery</span>
                     <span>{(state.yuktiCoins / 10000 * 100).toFixed(0)}%</span>
                   </div>
                   <div className="h-2.5 bg-black/20 dark:bg-white/10 rounded-full overflow-hidden border border-white/10">
                     <motion.div 
                        initial={{ width: 0 }} animate={{ width: (state.yuktiCoins / 10000 * 100) + '%' }}
                        className="h-full bg-white dark:bg-teal-400 shadow-[0_0_15px_rgba(255,255,255,0.5)] dark:shadow-[0_0_15px_rgba(20,184,166,0.5)]" 
                     />
                   </div>
                 </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showWizard && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowWizard(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 1.05, y: 10 }}
              className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200 dark:border-white/10"
            >
              <div className="p-10 md:p-16 space-y-10">
                <div className="text-center space-y-3">
                  <div className="inline-flex p-4 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-3xl mb-4 border border-teal-500/20 shadow-inner">
                    <Sparkles size={40} />
                  </div>
                  <h3 className="text-4xl font-headline font-black text-slate-900 dark:text-white italic tracking-tighter leading-none">Yukti Venture Lab</h3>
                  <p className="text-slate-500 dark:text-white/40 text-sm font-medium uppercase tracking-[0.2em]">Scale your social enterprise logic</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 ml-2">Core Mechanism (What is it?)</label>
                      <textarea 
                         value={localDraft} 
                         onChange={(e) => {
                           const val = e.target.value;
                           setLocalDraft(val);
                           updateState({ draftIdea: val });
                         }}
                         className="w-full mt-1 p-4 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:border-teal-500/40 transition-all font-medium text-sm placeholder:text-slate-300 dark:text-white/20 dark:text-white"
                         placeholder="Example: A network of solar-powered health clinics..."
                         rows={3}
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 ml-2">Target Users</label>
                      <input 
                         value={targetUsers} 
                         onChange={(e) => setTargetUsers(e.target.value)}
                         className="w-full mt-1 p-4 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:border-teal-500/40 transition-all font-medium text-sm placeholder:text-slate-300 dark:text-white/20 dark:text-white"
                         placeholder="Who exactly uses this? e.g. Rural farmers in Northern India"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/40 ml-2">Primary Pain Point</label>
                      <input 
                         value={painPoint} 
                         onChange={(e) => setPainPoint(e.target.value)}
                         className="w-full mt-1 p-4 bg-slate-50 dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-2xl outline-none focus:border-teal-500/40 transition-all font-medium text-sm placeholder:text-slate-300 dark:text-white/20 dark:text-white"
                         placeholder="What exact problem are you solving for them today?"
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button 
                      onClick={handleCreate}
                      disabled={isCreating}
                      className="w-full group px-12 py-5 bg-slate-900 dark:bg-teal-500 hover:bg-black dark:hover:bg-teal-400 text-white dark:text-slate-950 rounded-2xl font-black text-sm uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                      {isCreating ? (
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Initialize Analysis</span>
                          <Sparkles size={18} className="group-hover:rotate-12 transition-transform" />
                        </>
                      )}
                    </button>
                    <p className="text-center text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-widest mt-6 italic">
                       Powered by Groq Llama 3.1 Architecture
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showDictionary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               onClick={() => setShowDictionary(false)}
               className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl"
             />
             <motion.div
               initial={{ opacity: 0, scale: 0.95, y: 30 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 1.05, y: 10 }}
               className="bg-white dark:bg-slate-900 w-full max-w-5xl h-[80vh] rounded-[3rem] shadow-2xl overflow-hidden relative z-10 border border-slate-200 dark:border-white/10 flex flex-col"
             >
                <div className="p-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-teal-500/10 text-teal-600 dark:text-teal-400 rounded-2xl">
                         <BookOpen size={20} />
                      </div>
                      <div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest leading-none">Yukti Startup Dictionary</h4>
                        <p className="text-[10px] font-medium text-slate-400 dark:text-white/40">Knowledge is the foundation of scale.</p>
                      </div>
                   </div>
                   <button onClick={() => setShowDictionary(false)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <X size={24} />
                   </button>
                </div>
                <div className="flex-1 overflow-hidden">
                   <StartupDictionary />
                </div>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
      <ImpactTicker />
    </div>
  );
}
