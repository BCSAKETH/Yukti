import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useSimulation } from '../context/SimulationContext';
import { toast } from 'sonner';
import { 
  Rocket, MapPin, Target, Zap, Clock, Wrench, 
  ChevronRight, BrainCircuit, Sparkles, Navigation, Layers, Loader2,
  LineChart, Landmark, Banknote
} from 'lucide-react';
import { cn } from '../lib/utils';

interface RoadmapPhase {
  phaseName: string;
  timeline: string;   // When
  whatToDo: string;   // What
  howToApproach: string; // How
  whereToExecute: string; // Where
  whichTools: string[];   // Which
  investors: string[];    // Suggested investors
  governmentSchemes: string[]; // Suggested schemes
  keyMetrics: string[];   // Key metrics to track
}

interface RoadmapResult {
  missionGoal: string;
  phases: RoadmapPhase[];
}

export function AIExecutionRoadmap() {
  const { state } = useSimulation();
  const [isGenerating, setIsGenerating] = useState(false);
  const [roadmap, setRoadmap] = useState<RoadmapResult | null>(null);

  const activeIdea = state.pitch || state.draftIdea || '';
  const hasIdea = activeIdea.trim().length > 0;

  const generateRoadmap = async () => {
    if (!hasIdea) {
      toast.error('No idea found. Create a simulation first from the Simulation Hub.');
      return;
    }

    setIsGenerating(true);
    setRoadmap(null);

    try {
      const apiKey = (import.meta as any).env.VITE_GROQ_API_KEY || 'YOUR_GROQ_API_KEY';
      if (!apiKey || apiKey === 'YOUR_GROQ_API_KEY') {
        throw new Error('Groq API Key is missing.');
      }

      const prompt = `
You are a senior Social Entrepreneurship Architect. Building a venture from scratch is difficult, especially for beginners.
Create an exhaustive, step-by-step Execution Flowchart Roadmap for the following venture idea.

**Venture Idea:** "${activeIdea}"

**STRICT REQUIREMENTS:**
Break the execution down into 5 evolutionary phases, from "Beginner/Validation" up to "Full Scale/Expansion".
For each phase, you MUST explicitly answer:
- **timeline (When)**: e.g., "Months 0-3"
- **whatToDo (What)**: The primary objective.
- **howToApproach (How)**: The strategic mindset and exact tactical approach.
- **whereToExecute (Where)**: Where this happens (e.g., Local Community Centers, Digital Platforms, City Council).
- **whichTools (Which)**: An array of 3 specific tools, resources, or frameworks needed.
- **investors**: Array of 2-3 specific types of investors or funds to target (e.g., "Seed VCs targeting climate-tech", "Angel syndicates").
- **governmentSchemes**: Array of 1-2 specific government grants, policies, or subsidies applicable.
- **keyMetrics**: Array of 3 exact KPIs to track in this phase.

**OUTPUT FORMAT:**
Strict JSON object only:
{
  "missionGoal": "1-sentence overarching goal",
  "phases": [
    {
      "phaseName": "Phase 1: Idea Validation",
      "timeline": "Months 0-2",
      "whatToDo": "...",
      "howToApproach": "...",
      "whereToExecute": "...",
      "whichTools": ["Tool A"],
      "investors": ["Angel List Syndicates"],
      "governmentSchemes": ["SBIR Phase 1"],
      "keyMetrics": ["100 Customer Interviews"]
    }
  ]
}
      `;

      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'You are a social impact execution architect. Output pure JSON.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to generate roadmap from Groq API');
      }

      const data = await response.json();
      const textResponse = data.choices[0]?.message?.content || '{}';
      const cleanText = textResponse.replace(/^```json/mi, '').replace(/```$/m, '').trim();
      const parsed: RoadmapResult = JSON.parse(cleanText || '{}');
      setRoadmap(parsed);
      toast.success('Execution Roadmap Generated!');
    } catch (error) {
      console.error('Roadmap error:', error);
      toast.error('Failed to generate execution roadmap. Try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!hasIdea) {
    return (
      <div className="flex flex-col items-center justify-center p-20 text-center">
        <Target className="w-16 h-16 text-slate-300 mb-6" />
        <h2 className="text-2xl font-bold text-slate-700">No Venture Idea Detected</h2>
        <p className="text-slate-500 mt-2">Go to the Simulation Hub to draft your idea before building a roadmap.</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-violet-50 rounded-2xl border border-violet-100 shadow-sm">
            <Navigation size={24} className="text-violet-600" />
          </div>
          <h2 className="text-4xl font-headline font-black text-slate-900 tracking-tight">Execution Roadmap</h2>
        </div>
        <p className="text-slate-500 font-medium max-w-2xl text-lg relative pl-4 border-l-2 border-violet-200">
          From concept to full-scale deployment. See the Who, What, Where, When, and How for: <br/>
          <span className="font-bold text-slate-800 italic">"{activeIdea}"</span>
        </p>
      </div>

      {/* Generation Trigger */}
      {!roadmap && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl p-10 border border-slate-100 shadow-xl max-w-3xl mx-auto text-center"
        >
          <BrainCircuit className="w-20 h-20 text-violet-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold font-headline mb-4">Initialize AI Blueprint</h3>
          <p className="text-slate-500 mb-8 max-w-md mx-auto">
            Our Quantum Architect will break down your exact idea into 5 actionable phases, mapping out everything a beginner needs to know.
          </p>
          <button 
            onClick={generateRoadmap}
            disabled={isGenerating}
            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 mx-auto hover:bg-violet-600 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                <span className="animate-pulse">Generating Strategy...</span>
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Master Flowchart
              </>
            )}
          </button>
        </motion.div>
      )}

      {/* Render Roadmap */}
      {roadmap && (
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}
          className="relative max-w-4xl mx-auto space-y-10"
        >
          {/* Mission Core */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 rounded-[2rem] p-8 text-center text-white shadow-xl">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-violet-200 mb-2">North Star Mission</h4>
            <p className="text-xl font-medium">"{roadmap.missionGoal}"</p>
          </div>

          {/* Central Line */}
          <div className="absolute left-6 md:left-[50%] top-32 bottom-0 w-1 bg-slate-200 dashed-path -translate-x-1/2 z-0" />

          {/* Phases */}
          {roadmap.phases.map((phase, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }}
              className={cn(
                "relative z-10 flex flex-col md:flex-row gap-8 items-stretch md:items-center w-full",
                i % 2 === 0 ? "md:flex-row-reverse" : ""
              )}
            >
              {/* Timeline Bubble (Desktop Center) */}
              <div className="absolute left-6 md:left-[50%] -translate-x-1/2 w-16 h-16 rounded-2xl bg-white border-4 border-slate-50 shadow-xl flex flex-col items-center justify-center z-20 group">
                <span className="text-xl font-black text-slate-800">{i + 1}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Phase</span>
              </div>

              {/* Spacing for layout */}
              <div className="flex-1 hidden md:block" />

              {/* Content Card */}
              <div className={cn(
                "flex-1 bg-white ml-20 md:ml-0 p-8 rounded-[2rem] border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(139,92,246,0.1)] transition-all",
                i % 2 === 0 ? "md:mr-20" : "md:ml-20"
              )}>
                <div className="flex items-center justify-between gap-4 mb-6">
                  <h3 className="text-xl font-headline font-black text-slate-900">{phase.phaseName}</h3>
                  <div className="bg-slate-100 px-3 py-1.5 rounded-lg flex items-center gap-2">
                    <Clock size={12} className="text-slate-500" />
                    <span className="text-xs font-bold text-slate-600">{phase.timeline}</span>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* WHAT */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0 mt-0.5"><Target size={16} /></div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">What To Do</h4>
                      <p className="text-sm text-slate-700 font-medium">{phase.whatToDo}</p>
                    </div>
                  </div>

                  {/* HOW */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg shrink-0 mt-0.5"><Layers size={16} /></div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">How To Approach</h4>
                      <p className="text-sm text-slate-700 font-medium">{phase.howToApproach}</p>
                    </div>
                  </div>

                  {/* WHERE */}
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-rose-50 text-rose-600 rounded-lg shrink-0 mt-0.5"><MapPin size={16} /></div>
                    <div>
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Where To Execute</h4>
                      <p className="text-sm text-slate-700 font-medium">{phase.whereToExecute}</p>
                    </div>
                  </div>

                  {/* WHICH TOOLS */}
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-100">
                    <div className="p-2 bg-violet-50 text-violet-600 rounded-lg shrink-0 mt-0.5"><Wrench size={16} /></div>
                    <div className="w-full">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Which Tools Needed</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.whichTools?.map((tool, idx) => (
                          <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-bold px-3 py-1 rounded-full">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* INVESTORS & SCHEMES */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-amber-50 text-amber-600 rounded-lg shrink-0 mt-0.5"><Banknote size={16} /></div>
                      <div className="w-full">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Target Investors</h4>
                        <ul className="space-y-1">
                          {phase.investors?.map((inv, idx) => (
                            <li key={idx} className="text-sm text-slate-600 font-medium flex gap-2"><span className="text-amber-500">•</span> {inv}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-sky-50 text-sky-600 rounded-lg shrink-0 mt-0.5"><Landmark size={16} /></div>
                      <div className="w-full">
                        <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Govt. Schemes</h4>
                        <ul className="space-y-1">
                          {phase.governmentSchemes?.map((scheme, idx) => (
                            <li key={idx} className="text-sm text-slate-600 font-medium flex gap-2"><span className="text-sky-500">•</span> {scheme}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* KEY METRICS */}
                  <div className="flex items-start gap-3 pt-4 border-t border-slate-100">
                    <div className="p-2 bg-fuchsia-50 text-fuchsia-600 rounded-lg shrink-0 mt-0.5"><LineChart size={16} /></div>
                    <div className="w-full">
                      <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Key Metrics (KPIs)</h4>
                      <div className="flex flex-wrap gap-2">
                        {phase.keyMetrics?.map((metric, idx) => (
                          <span key={idx} className="bg-fuchsia-50 border border-fuchsia-100 text-fuchsia-700 text-[11px] font-bold px-3 py-1 rounded-md">
                            {metric}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {/* Final Launch Outpost */}
          <motion.div
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            className="relative z-10 flex flex-col items-center pt-8"
          >
            <div className="w-24 h-24 bg-gradient-to-tr from-emerald-500 to-teal-500 rounded-[2.5rem] flex flex-col items-center justify-center text-white shadow-2xl animate-bounce-slow">
              <Rocket size={40} />
            </div>
            <h4 className="mt-6 font-headline font-black text-2xl text-slate-900">Venture Scaled.</h4>
            <p className="text-slate-500 max-w-sm text-center mt-2 font-medium">Your strategy is mapped. Proceed to the Simulation Boardroom to test these exact phases.</p>
          </motion.div>
        </motion.div>
      )}

      <style>{`
        .dashed-path {
          background-image: linear-gradient(to bottom, #cbd5e1 50%, transparent 50%);
          background-size: 1px 16px;
          background-repeat: repeat-y;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
      `}</style>
    </div>
  );
}
