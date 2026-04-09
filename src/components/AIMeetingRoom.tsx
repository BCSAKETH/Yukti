import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mic, MicOff, Send, MessageSquare, Users, TrendingUp, 
  ChevronRight, Play, CheckCircle2, AlertCircle, X,
  Brain, FileText, BarChart3, Landmark, Heart, Zap, Sparkles,
  Search, Bell, Settings, Languages, Mic as MicIcon, Send as SendIcon
} from 'lucide-react';
import { useSimulation } from '../context/SimulationContext';
import { cn, cleanJsonParse } from '../lib/utils';
import { toast } from 'sonner';
import { Camera, CameraOff } from 'lucide-react';

const BOARDROOM_BG = "/boardroom-bg.png";

function WebcamFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [hasStream, setHasStream] = useState(false);

  useEffect(() => {
    async function startCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) videoRef.current.srcObject = s;
        streamRef.current = s;
        setHasStream(true);
      } catch (err) {
        console.error("Camera failed:", err);
      }
    }
    startCamera();
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    };
  }, []);

  return (
    <div className="w-full h-full bg-slate-950 flex items-center justify-center rounded-[2rem] overflow-hidden relative group">
      <video 
        ref={videoRef} 
        autoPlay 
        playsInline 
        muted 
        className={cn("w-full h-full object-cover mirror", !hasStream && "hidden")} 
      />
      
      {!hasStream && (
        <div className="text-white/20 flex flex-col items-center gap-2 absolute z-10">
          <CameraOff size={16} />
          <span className="text-[6px] font-black uppercase tracking-widest text-center">Founder View<br/>Inactive</span>
        </div>
      )}
    </div>
  );
}

interface Message {
  role: 'user' | 'ai';
  content: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
}

interface Stakeholder {
  id: string;
  name: string;
  role: string;
  avatar: string;
  description: string;
  trait: string;
  color: string;
  accent: string;
  position: { x: string; y: string; scale: number; rotate: number };
}

const STAKEHOLDERS: Stakeholder[] = [
  {
    id: 'st-1',
    name: 'Namita Thapar',
    role: 'Executive Director, Emcure',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Namita',
    description: 'Expert in pharma and healthcare.',
    trait: 'Pharma Queen',
    color: '#ec4899', // pink-500
    accent: 'shadow-pink-500/40',
    position: { x: '5%', y: '5%', scale: 1, rotate: -8 }
  },
  {
    id: 'st-2',
    name: 'Peyush Bansal',
    role: 'Founder, Lenskart',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peyush',
    description: 'Visionary tech leader.',
    trait: 'Visionary',
    color: '#06b6d4', // cyan-500
    accent: 'shadow-cyan-500/40',
    position: { x: '28%', y: '5%', scale: 1, rotate: -3 }
  },
  {
    id: 'st-3',
    name: 'Aman Gupta',
    role: 'Co-founder, boAt',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aman',
    description: 'Branding powerhouse.',
    trait: 'Brand King',
    color: '#f59e0b', // amber-500
    accent: 'shadow-amber-500/40',
    position: { x: '52%', y: '5%', scale: 1, rotate: 3 }
  },
  {
    id: 'st-4',
    name: 'Vineeta Singh',
    role: 'CEO, SUGAR Cosmetics',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Vineeta',
    description: 'Ironwoman of business.',
    trait: 'Metrics Queen',
    color: '#10b981', // emerald-500
    accent: 'shadow-emerald-500/40',
    position: { x: '75%', y: '5%', scale: 1, rotate: 8 }
  }
];

function StakeholderHeatmap({ sentiments }: { sentiments: Record<string, number> }) {
  const categories = [
    { id: 'gov', label: 'Government / Policy', icon: Landmark, color: 'text-blue-400' },
    { id: 'vc', label: 'Venture Capital / ROI', icon: TrendingUp, color: 'text-emerald-400' },
    { id: 'community', label: 'Community / Impact', icon: Heart, color: 'text-rose-400' },
  ];

  return (
    <div className="grid grid-cols-3 gap-2">
      {categories.map((cat) => (
        <div key={cat.id} className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col items-center gap-1">
          <cat.icon size={12} className={cat.color} />
          <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden mt-1">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${sentiments[cat.id] || 50}%` }}
              className={cn("h-full", cat.color.replace('text', 'bg'))}
            />
          </div>
          <span className="text-[6px] font-black uppercase text-white/40 tracking-widest">{cat.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AIMeetingRoom({ onClose }: { onClose: () => void }) {
  const { state, updateState, t } = useSimulation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [meetingStage, setMeetingStage] = useState<'selection' | 'active' | 'analysis'>('selection');
  const [sentiment, setSentiment] = useState<number>(50);
  const [currentSharkIndex, setCurrentSharkIndex] = useState(-1);
  const [stakeholderSentiments, setStakeholderSentiments] = useState<Record<string, number>>({
    gov: 50,
    vc: 50,
    community: 50
  });
  const [pitchProgress, setPitchProgress] = useState(0);
  const [analysisReport, setAnalysisReport] = useState<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const handleVisChange = () => {
      if (document.hidden && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisChange);
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    };
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, interimTranscript]);

  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startMeeting = () => {
    setMeetingStage('active');
    setPitchProgress(0);
    setCurrentSharkIndex(-1);
    const initialMsg: Message = {
      role: 'ai',
      content: `Welcome to the Yukti Boardroom. We've read your proposal. You are standing before the founders of India's biggest brands. The floor is yours, Founder. Start your pitch.`,
    };
    setMessages([initialMsg]);
    speakText(initialMsg.content);
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error('Voice recognition not supported. Use Chrome desktop.');
        return;
      }
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = state.gameLanguage === 'Hindi' ? 'hi-IN' : state.gameLanguage === 'Telugu' ? 'te-IN' : 'en-IN';
      recognitionRef.current.onstart = () => setIsListening(true);
      recognitionRef.current.onend = () => setIsListening(false);
      recognitionRef.current.onresult = (event: any) => {
        let interim = '';
        let final = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript;
          else interim += event.results[i][0].transcript;
        }
        if (final) {
          handleSendMessage(final);
          setInterimTranscript('');
          setPitchProgress(prev => Math.min(100, prev + 15));
        } else {
          setInterimTranscript(interim);
        }
      };
      recognitionRef.current.start();
    }
  };

  const handleSendMessage = async (text: string = inputText) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setPitchProgress(prev => Math.min(100, prev + 25));
    setIsThinking(true);

    try {
      const activeShark = currentSharkIndex === -1 ? STAKEHOLDERS[0] : STAKEHOLDERS[currentSharkIndex];
      const prompt = `You are roleplaying as the sharks of Shark Tank India. 
      Venture context: ${state.pitch}
      Current Shark: ${activeShark.name} (${activeShark.trait})
      Phase: ${currentSharkIndex === -1 ? 'Initial Pitch feedback' : 'Questioning Round'}
      User Message: ${text}
      Latest Mentor Insight: ${state.mentorFeedback ? `"${state.mentorFeedback.critique}"` : 'None'}
      Instructions: React in character. If the mentor has critiqued the user's recent move, you can use that to be more critical or supportive. Output ONLY JSON: { "content": "string", "sentimentScore": number, "metrics": { "investability": number, "clarity": number } }`;

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
      const rawRes = data.choices[0].message.content;
      const result = cleanJsonParse(rawRes);
      const aiMsg: Message = { role: 'ai', content: result.content };
      setMessages(prev => [...prev, aiMsg]);
      setSentiment(result.sentimentScore || 50);
      
      // Update individual stakeholder sentiment based on content analysis (simulated)
      const lowCase = text.toLowerCase();
      setStakeholderSentiments(prev => ({
        gov: Math.min(100, prev.gov + (lowCase.includes('policy') || lowCase.includes('legal') ? 15 : 2)),
        vc: Math.min(100, prev.vc + (lowCase.includes('revenue') || lowCase.includes('scale') ? 20 : 5)),
        community: Math.min(100, prev.community + (lowCase.includes('social') || lowCase.includes('village') ? 18 : 3))
      }));

      speakText(result.content);

      if (currentSharkIndex === -1 && pitchProgress > 50) {
        setCurrentSharkIndex(0);
        toast.info(`${STAKEHOLDERS[0].name} is opening the questioning...`);
      } else if (currentSharkIndex >= 0 && currentSharkIndex < 3) {
        setCurrentSharkIndex(prev => prev + 1);
        toast.info(`${STAKEHOLDERS[currentSharkIndex + 1].name} takes the floor...`);
      } else if (currentSharkIndex === 3) {
        toast.success("Final deliberation in progress...");
      }
    } catch (e) {
      console.error(e);
      toast.error('AI connection failed.');
    } finally {
      setIsThinking(false);
    }
  };

  const generateReport = async () => {
    setIsThinking(true);
    try {
      const mentorContext = state.mentorFeedback ? `The Yukti AI Mentor previously noted: ${state.mentorFeedback.critique}` : "";
      const prompt = `Generate a Venture Impact Report for: ${state.pitch}. ${mentorContext}. Decisions by Namita, Peyush, Aman, Vineeta based on this transcript: ${JSON.stringify(messages).slice(-2000)}. Provide a deal offer or rejection. JSON format: { "Decision": "string", "Offer": "string", "Strengths": [], "Weaknesses": [], "Reasoning": "string", "Recommendation": "A 3-sentence perfect pitch for next time" }`;
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
      const rawContent = data.choices[0].message.content;
      const parsed = cleanJsonParse(rawContent);
      setAnalysisReport(parsed);
      setMeetingStage('analysis');
    } catch (e) {
      toast.error('AI generation delayed. Loading standardized audit...');
      setAnalysisReport({
        "Decision": "Strategic Walkaway",
        "Offer": "The sharks found the business model to have significant scale risk, despite high impact.",
        "Strengths": ["Clear communication", "Initial traction evident in pitch"],
        "Weaknesses": ["Lack of strong unit economics", "Regulatory friction"],
        "Reasoning": "We love the heart, but we don't see the scale yet.",
        "Recommendation": "Focus on unit economics and clarifying the revenue bridge before pitching again."
      });
      setMeetingStage('analysis');
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="h-full w-full flex flex-col bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden border border-white/5 relative min-h-[750px]">
        {/* Background Mesh */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(20,184,166,0.1),transparent)] pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))] pointer-events-none" />

        {/* Header Section */}
        <div className="relative z-50 px-8 py-5 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-black/40">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-teal-500/20 flex items-center justify-center border border-teal-500/40 shadow-[0_0_15px_rgba(20,184,166,0.2)]">
              <Users size={16} className="text-teal-400" />
            </div>
            <div>
              <h2 className="text-sm font-headline font-black text-white tracking-widest uppercase italic leading-none">The Boardroom</h2>
              <p className="text-[7px] font-bold text-teal-400 tracking-[0.3em] uppercase mt-1">
                {meetingStage === 'active' ? 'Live Gallery Negotiation' : 'Strategic Assessment'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {meetingStage === 'active' && (
              <motion.button 
                whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={generateReport}
                className="px-5 py-2 bg-teal-500 text-slate-950 rounded-lg font-black text-[9px] uppercase tracking-widest shadow-xl shadow-teal-500/20 hover:bg-teal-400 transition-colors"
              >
                Final Deliberation
              </motion.button>
            )}
            <button 
              className="p-1.5 text-white/40 hover:text-red-400 transition-colors bg-white/5 rounded-lg border border-white/5" 
              onClick={() => {
                if ('speechSynthesis' in window) window.speechSynthesis.cancel();
                onClose();
              }}
              title="Exit Boardroom"
            >
              <X size={16}/>
            </button>
          </div>
        </div>

      <div className="flex-1 overflow-hidden relative flex flex-col p-6">
        <AnimatePresence mode="wait">
          {meetingStage === 'selection' && (
            <motion.div 
               key="selection" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.1 }}
               className="h-full flex flex-col items-center justify-center text-center px-10"
            >
               <div className="w-24 h-24 rounded-3xl bg-teal-500/10 flex items-center justify-center border border-teal-500/20 mb-8 animate-pulse shadow-[0_0_50px_rgba(20,184,166,0.1)]">
                 <Brain size={48} className="text-teal-500" />
               </div>
               <h3 className="text-4xl font-headline font-black text-white mb-4 tracking-tighter leading-none">{t('boardroom')}</h3>
               <p className="text-white/40 max-w-sm mb-10 text-sm font-medium leading-relaxed uppercase tracking-widest">
                 High-Stakes AI Simulation
               </p>
               <button 
                 onClick={startMeeting}
                 className="group px-12 py-5 bg-teal-600 hover:bg-teal-500 text-white rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_20px_40px_-10px_rgba(13,148,136,0.4)] flex items-center gap-4"
               >
                 <span>Start Pitch</span>
                 <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
               </button>
            </motion.div>
          )}

          {meetingStage === 'active' && (
            <motion.div 
              key="active" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="h-full flex flex-col md:flex-row overflow-hidden"
            >
               {/* LEFT SIDE: The Stage (Scene & Stakeholders) */}
               <div className="flex-1 flex flex-col p-6 border-r border-white/5 relative overflow-y-auto custom-scrollbar">
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 via-transparent to-transparent pointer-events-none" />
                  
                  {/* Stakeholders Row - More Compact */}
                  <div className="relative h-48 md:h-56 mt-4 perspective-1000 mb-6">
                    {STAKEHOLDERS.map((s, idx) => (
                      <motion.div 
                        key={s.id} 
                        className="absolute"
                        initial={false}
                        animate={{
                          left: s.position.x,
                          top: s.position.y,
                          scale: currentSharkIndex === idx ? 0.85 : 0.7, // Smaller scale to fit better
                          rotateY: s.position.rotate,
                          zIndex: currentSharkIndex === idx ? 50 : 10
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                         <div className="flex flex-col items-center">
                           <div className={cn(
                             "relative w-24 h-24 md:w-28 md:h-28 overflow-hidden rounded-[2rem] border-[4px] transition-all duration-700",
                             currentSharkIndex === idx 
                               ? "scale-110 shadow-2xl" 
                               : "opacity-80 scale-95"
                           )}
                           style={{ 
                             borderColor: s.color,
                             boxShadow: currentSharkIndex === idx ? `0 0 40px ${s.color}66` : `0 0 10px ${s.color}22`
                           }}>
                             <div className="absolute inset-0 mix-blend-overlay opacity-30" style={{ backgroundColor: s.color }} />
                             <img src={s.avatar} className="w-full h-full object-cover bg-slate-900" alt={s.name} />
                           </div>
                           
                           <div className={cn(
                             "mt-3 text-center transition-all duration-500 bg-black/60 px-3 py-0.5 rounded-full border border-white/10 backdrop-blur-md",
                             currentSharkIndex === idx ? "opacity-100" : "opacity-60"
                           )}>
                             <p className="text-[9px] font-black uppercase" style={{ color: s.color }}>{s.name.split(' ')[0]}</p>
                           </div>
                         </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Interaction HUD (Podium & Bio-coach) - Shared row */}
                  <div className="flex gap-4 min-h-0">
                     {/* Podium */}
                     <div className="flex-1 min-h-[180px] bg-white/5 backdrop-blur-3xl rounded-[2rem] border border-white/10 p-2 shadow-2xl relative overflow-hidden group">
                        <WebcamFeed />
                        <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-1.5">
                           <div className="flex justify-between items-center px-3 py-1 bg-black/60 rounded-full border border-white/10 backdrop-blur-md">
                              <span className="text-[6px] font-black text-white uppercase tracking-widest">Founder View</span>
                              <span className="text-[6px] font-black text-teal-400 uppercase tracking-widest">{sentiment}% Sentiment</span>
                           </div>
                           <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                             <motion.div animate={{ width: isListening ? '100%' : '5%' }} className="h-full bg-teal-400 shadow-[0_0_10px_rgba(20,184,166,1)]" />
                           </div>
                        </div>
                     </div>

                     {/* AI Posture Coach - Slimmer version */}
                     <div className="w-[35%] bg-slate-900/60 backdrop-blur-3xl p-4 rounded-3xl border border-teal-500/20 flex flex-col gap-3 shadow-2xl">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 bg-teal-500/20 rounded-lg">
                             <Brain size={12} className="text-teal-400" />
                           </div>
                           <span className="text-[8px] font-black text-white uppercase tracking-widest">Bio-Feedback</span>
                        </div>
                        <div className="flex-1 space-y-2 overflow-y-auto custom-scrollbar pr-1 max-h-[300px]">
                           <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col relative overflow-hidden">
                             <span className="text-[7px] text-white/40 font-bold uppercase tracking-widest mb-1">Posture</span>
                             <span className="text-teal-300 font-bold text-[9px] leading-tight">
                                {pitchProgress < 30 ? "Sit upright." : pitchProgress < 70 ? "Maintain authority." : "Stay neutral."}
                             </span>
                           </div>
                           <StakeholderHeatmap sentiments={stakeholderSentiments} />
                        </div>
                        <div className="pt-2 border-t border-white/5 flex flex-col gap-1">
                           <span className="text-[6px] font-black text-teal-400 uppercase tracking-[0.2em]">Negotiation Status</span>
                           <div className="flex items-center gap-1.5">
                              <div className={cn("w-1 h-1 rounded-full", sentiment > 60 ? "bg-emerald-400" : "bg-amber-400")} />
                              <span className="text-[8px] font-black text-white uppercase">{sentiment > 70 ? 'High Interest' : 'Skeptical'}</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* RIGHT SIDE: Sidebar Chat & Input */}
               <div className="w-full md:w-[380px] flex flex-col bg-black/20 backdrop-blur-xl border-l border-white/5 h-full overflow-hidden">
                  <div className="flex-1 flex flex-col p-6 min-h-0">
                     <div className="flex items-center gap-2 mb-4 opacity-50">
                        <MessageSquare size={12} className="text-teal-400" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">Live Deliberation</span>
                     </div>
                     
                     <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar min-h-0">
                        {messages.map((m, i) => (
                          <div key={i} className={cn(
                            "text-[10px] font-bold leading-relaxed p-3 rounded-xl border transition-all",
                            m.role === 'ai' 
                              ? "bg-teal-500/5 border-teal-500/10 text-teal-300 italic" 
                              : "bg-white/5 border-white/5 text-white/80"
                          )}>
                            <div className="flex items-center justify-between mb-1 opacity-40">
                              <span className="uppercase text-[6px] font-black tracking-widest">
                                {m.role === 'ai' ? 'Shark' : 'You'}
                              </span>
                            </div>
                            {m.content}
                          </div>
                        ))}
                        {interimTranscript && (
                          <div className="text-[10px] font-bold text-teal-400/60 italic animate-pulse p-3 bg-teal-500/5 rounded-xl border border-teal-500/10">
                             "{interimTranscript}..."
                          </div>
                        )}
                        {isThinking && (
                          <div className="flex items-center gap-2 px-2">
                             <div className="w-1 h-1 rounded-full bg-amber-400 animate-bounce" />
                             <div className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:0.2s]" />
                             <div className="w-1 h-1 rounded-full bg-amber-400 animate-bounce [animation-delay:0.4s]" />
                          </div>
                        )}
                     </div>
                  </div>

                  <div className="p-4 bg-black/40 border-t border-white/5 flex flex-col gap-3">
                     <input 
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                        placeholder={isListening ? "Listening..." : "Type response..."}
                        className="w-full h-12 bg-white/5 rounded-xl px-4 text-white font-bold text-xs outline-none focus:bg-white/10 transition-all placeholder:text-white/20 border border-white/5"
                     />
                     <div className="flex gap-2">
                        <button 
                           onClick={toggleListening}
                           className={cn(
                             "flex-1 h-12 rounded-xl flex items-center justify-center transition-all shadow-xl",
                             isListening ? "bg-red-500 text-white animate-pulse" : "bg-white/10 text-white border border-white/10 hover:bg-white/20"
                           )}
                        >
                           {isListening ? <MicOff size={16} /> : <Mic size={16} />}
                        </button>
                        <button 
                           onClick={() => handleSendMessage()}
                           className="flex-1 h-12 bg-teal-500 text-slate-950 rounded-xl flex items-center justify-center shadow-lg hover:shadow-teal-500/30 transition-all font-black text-[9px] uppercase tracking-widest"
                        >
                           Send
                        </button>
                     </div>
                  </div>
               </div>
            </motion.div>
          )}

          {meetingStage === 'analysis' && analysisReport && (
            <motion.div 
               key="analysis" initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}
               className="h-full flex flex-col items-center justify-center p-6 text-center"
            >
               <div className="max-w-3xl w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[4rem] p-12 shadow-2xl relative overflow-y-auto max-h-[90vh] custom-scrollbar">
                  <div className="absolute top-0 right-0 p-10 opacity-[0.05] rotate-12 -z-10"><Landmark size={200}/></div>
                  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex gap-2 px-5 py-2 bg-teal-500/10 text-teal-400 rounded-full text-[9px] font-black uppercase tracking-widest border border-teal-500/20 mb-8">
                     <Sparkles size={12} /> Strategic Deliberation Complete
                  </motion.div>
                  <h3 className="text-5xl font-headline font-black text-white leading-none mb-4 tracking-tighter">{analysisReport.Decision}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6 italic">"{analysisReport.Reasoning}"</p>
                  
                  {/* Robust Offer Rendering */}
                  <div className="mb-10 text-left">
                    {typeof analysisReport.Offer === 'object' && analysisReport.Offer !== null ? (
                      <div className="bg-teal-500/5 border border-teal-500/20 rounded-3xl p-8 space-y-4 shadow-2xl relative overflow-hidden group">
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-xl bg-teal-500 flex items-center justify-center text-slate-950 shadow-lg">
                             <FileText size={20} />
                           </div>
                           <div>
                             <h4 className="text-xs font-black text-teal-400 uppercase tracking-widest leading-none">Structured Term Sheet</h4>
                             <p className="text-[9px] text-white/40 uppercase font-bold mt-1">Strategic Investment Draft</p>
                           </div>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                          {Object.entries(analysisReport.Offer).map(([key, val]) => (
                            <div key={key} className="space-y-1">
                               <p className="text-[8px] font-black text-white/30 uppercase tracking-tighter">{key.replace(/_/g, ' ')}</p>
                               <p className="text-sm font-bold text-white tracking-tight leading-none">
                                 {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                               </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <p className="text-2xl font-bold text-teal-400 tracking-tight italic text-center">"{analysisReport.Offer}"</p>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 mb-12 text-left">
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                       <h5 className="text-[9px] font-black text-teal-400 uppercase tracking-widest mb-3 flex items-center gap-2"><CheckCircle2 size={12}/> Strengths</h5>
                       <ul className="space-y-2">
                         {analysisReport.Strengths?.slice(0,3).map((s:any, i:number) => <li key={i} className="text-[10px] font-medium text-white/70">{s}</li>)}
                       </ul>
                    </div>
                    <div className="p-6 bg-white/5 rounded-3xl border border-white/5">
                       <h5 className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-3 flex items-center gap-2"><AlertCircle size={12}/> Risks</h5>
                       <ul className="space-y-2">
                         {analysisReport.Weaknesses?.slice(0,3).map((w:any, i:number) => <li key={i} className="text-[10px] font-medium text-white/70">{w}</li>)}
                       </ul>
                    </div>
                  </div>

                  {/* Pitch Training Module - Requested by user */}
                  <div className="mt-10 pt-10 border-t border-white/10 space-y-6">
                    <div className="flex items-center justify-center gap-2">
                       <div className="px-4 py-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[8px] font-black uppercase tracking-[0.3em]">Masterclass: Post-Analysis Training</div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                       <div className="bg-teal-500/5 p-6 rounded-3xl border border-teal-500/20">
                          <h6 className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2">The Perfect "Impact" Pitch</h6>
                          <p className="text-xs text-white/80 leading-relaxed italic">"{analysisReport.Recommendation || 'Our venture builds a self-sustaining ecosystem for our users. We are seeking a strategic partner.'}"</p>
                       </div>
                       <div className="bg-slate-900/60 p-6 rounded-3xl border border-white/10">
                          <h6 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Posture & Delivery Hack</h6>
                          <p className="text-xs text-white/60 leading-relaxed">Lower your voice pitch slightly when discussing risks to project stability. It signals high competence and fearlessness to investors.</p>
                       </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-12">
                    <button 
                      onClick={() => {
                        const baseReward = analysisReport.Decision === 'Investment Offered' ? 5000 : 500;
                        updateState({ yuktiCoins: (state.yuktiCoins || 0) + baseReward });
                        onClose();
                        toast.success(`Success! Earned ${baseReward.toLocaleString()} Yukti Coins!`);
                      }}
                      className="px-10 py-5 bg-teal-500 text-slate-950 rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-xl flex items-center gap-2"
                    >
                      <Sparkles size={16} /> Finalize Deal & Claim YKC
                    </button>
                    <button 
                      onClick={() => setMeetingStage('selection')}
                      className="px-10 py-5 bg-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/20 transition-all border border-white/10"
                    >
                      Retry Simulation
                    </button>
                  </div>
               </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
