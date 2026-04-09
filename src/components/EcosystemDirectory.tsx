import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Network, Landmark, Target, ExternalLink, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSimulation } from '../context/SimulationContext';

const MOCK_SCHEMES = [
  {
    id: 1,
    name: 'Atal Innovation Mission (AIM)',
    agency: 'NITI Aayog',
    type: 'Government Scheme',
    description: 'Promotes a culture of innovation and entrepreneurship across the country.',
    funding: 'Up to ₹10 Crore',
    eligibility: 'Seed-stage tech startups',
    link: 'https://aim.gov.in/',
    steps: [
      'Register on AIM portal with DPIIT recognition.',
      'Submit detailed project report (DPR) and impact metrics.',
      'Undergo physical/digital audit by NITI Aayog panel.',
      'Wait for 3-stage clearance for first tranche disbursement.'
    ]
  },
  {
    id: 2,
    name: 'Startup India Seed Fund',
    agency: 'DPIIT',
    type: 'Government Scheme',
    description: 'Provides financial assistance to startups for proof of concept, prototype development, market entry, and commercialization.',
    funding: 'Up to ₹50 Lakhs',
    eligibility: 'DPIIT recognized startups',
    link: 'https://seedfund.startupindia.gov.in/',
    steps: [
      'Apply online with venture details and pitch deck.',
      'Select Incubator for mentoring and funding evaluation.',
      'Deliver pitch to chosen Incubator committee.',
      'Funds released based on milestone achievement.'
    ]
  }
];

const MOCK_INVESTORS = [
  {
    id: 1,
    name: 'Sequoia Surge',
    type: 'VC Firm',
    focus: ['EdTech', 'FinTech', 'SaaS'],
    stage: 'Pre-Seed, Seed',
    thesis: 'We back audacious founders building the next generation of global companies.',
    moatRequirement: 'High Defensibility (Network Effects, Deep Tech)',
    steps: [
      'Prepare a clear 10-slide deck on your unique moat.',
      'Seek a "warm intro" from a Surge alumni or partner.',
      'Complete the data-room with unit economics benchmarks.',
      'Final partner interview focusing on 10-year scale.'
    ]
  },
  {
    id: 2,
    name: 'Omidyar Network India',
    type: 'Impact Investor',
    focus: ['Digital Society', 'Education', 'Financial Inclusion'],
    stage: 'Seed, Series A',
    thesis: 'Investing in bold entrepreneurs who help create a meaningful life for every Indian.',
    moatRequirement: 'Social Impact + Scale',
    steps: [
      'Define your "Impact Alpha" in the application form.',
      'Submit a detailed Theory of Change (ToC) document.',
      'Undergo impact audit and governance check.',
      'Seed round closure typically takes 45-60 days.'
    ]
  }
];

export function EcosystemDirectory() {
  const [activeTab, setActiveTab] = useState<'investors' | 'schemes'>('schemes');
  const { state } = useSimulation();

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-slate-200 pb-8">
        <div>
          <h2 className="font-headline font-black text-4xl text-slate-900 mb-2 flex items-center gap-3">
            <Network className="text-primary" size={36} /> Ecosystem Hub
          </h2>
          <p className="text-slate-500 font-medium">Your strategic playbook for funding, policy, and investor defense.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl">
          <button 
            onClick={() => setActiveTab('schemes')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
              activeTab === 'schemes' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Gov Schemes
          </button>
          <button 
            onClick={() => setActiveTab('investors')}
            className={cn(
              "px-6 py-2.5 rounded-xl font-bold text-sm transition-all",
              activeTab === 'investors' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Investor Playbooks
          </button>
        </div>
      </div>

      {activeTab === 'schemes' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_SCHEMES.map(scheme => (
            <motion.div key={scheme.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm hover:border-emerald-300 transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex gap-3 items-center">
                  <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                    <Landmark size={24} />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">{scheme.agency}</span>
                    <h3 className="font-headline font-black text-xl text-slate-900 mt-1">{scheme.name}</h3>
                  </div>
                </div>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6 h-20">{scheme.description}</p>
              
              <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-2xl border border-slate-100 dark:border-white/5 mb-6">
                <span className="block text-[10px] font-black uppercase text-secondary mb-3 tracking-widest">How to Apply (Steps)</span>
                <div className="space-y-3">
                  {scheme.steps.map((step, idx) => (
                    <div key={idx} className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <div className="w-5 h-5 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-black flex-shrink-0">{idx + 1}</div>
                      <p className="font-medium leading-tight">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              <a href={scheme.link} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors">
                View Official Portal <ExternalLink size={16} />
              </a>
            </motion.div>
          ))}
        </div>
      )}

      {activeTab === 'investors' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_INVESTORS.map(investor => (
            <motion.div key={investor.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2rem] border border-indigo-900/50 p-8 shadow-xl text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-150 transition-transform duration-700">
                <Target size={120} />
              </div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded-full">{investor.type}</span>
                    <h3 className="font-headline font-black text-3xl text-white mt-2">{investor.name}</h3>
                  </div>
                  <div className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold text-indigo-200">
                    {investor.stage}
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <span className="block text-[10px] font-black uppercase text-indigo-300 mb-2">Investment Thesis</span>
                    <p className="text-white/80 text-sm leading-relaxed italic">"{investor.thesis}"</p>
                  </div>
                  
                  <div>
                    <span className="block text-[10px] font-black uppercase text-indigo-300 mb-2">Focus Areas</span>
                    <div className="flex flex-wrap gap-2">
                       {investor.focus.map(f => (
                         <span key={f} className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-xs font-bold text-indigo-100">{f}</span>
                       ))}
                    </div>
                  </div>

                  <div className="bg-indigo-900/50 border border-indigo-500/30 p-6 rounded-xl flex flex-col gap-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="text-emerald-400 mt-0.5" size={16} />
                      <div>
                        <span className="block text-[10px] font-black uppercase text-indigo-300 mb-1">Defense Requirement</span>
                        <span className="font-bold text-sm text-white">{investor.moatRequirement}</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-white/10">
                      <span className="block text-[10px] font-black uppercase text-indigo-300 mb-3 tracking-widest">Application Playbook</span>
                      <div className="space-y-2">
                         {investor.steps.map((step, idx) => (
                           <div key={idx} className="flex gap-2 text-[11px] text-white/70">
                             <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black flex-shrink-0 text-[8px]">{idx + 1}</div>
                             <p>{step}</p>
                           </div>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
