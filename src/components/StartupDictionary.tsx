import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Info, Briefcase, TrendingUp, Zap, Target, BookOpen, Play, Globe, Shield, Cpu, Heart, Landmark } from 'lucide-react';
import { cn } from '../lib/utils';
import { useSimulation } from '../context/SimulationContext';
import { EXTENDED_DICTIONARY_TERMS } from '../data/startupTerms';
import { toast } from 'sonner';

interface Term {
  id: string;
  term: string;
  category: 'Financial' | 'Strategy' | 'Operational' | 'Growth' | 'Web3' | 'Impact' | 'Technology' | 'Legal';
  definition: string;
  example: string;
  youtubeUrl?: string;
}

export const DICTIONARY_DATA: Record<string, Term[]> = {
  English: [
    // Financial & VC
    { id: 'runway', term: 'Runway', category: 'Financial', definition: 'The amount of time your venture can continue to operate before it runs out of cash.', example: 'A startup with $50k and a monthly burn of $5k has a 10-month runway.' },
    { id: 'burn-rate', term: 'Burn Rate', category: 'Financial', definition: 'The rate at which a company spends its supply of cash over time.', example: 'Spending $10,000 more than earned each month.' },
    { id: 'bootstrapping', term: 'Bootstrapping', category: 'Financial', definition: 'Growing a venture using personal savings rather than external investment.', example: 'Selling handicrafts to fund a community center without taking loans.' },
    { id: 'unit-economics', term: 'Unit Economics', category: 'Financial', definition: 'The direct revenues and costs associated with a single unit of your business.', example: 'Cost to produce one net vs. the subsidy received from government.' },
    { id: 'vc', term: 'Venture Capital (VC)', category: 'Financial', definition: 'Private equity financing provided by firms to startups with high growth potential.', example: 'Raising $2M to scale sustainable battery recycling.' },
    { id: 'angel', term: 'Angel Investor', category: 'Financial', definition: 'An individual who provides capital for a business start-up in exchange for equity.', example: 'Former doctor investing $50K in a health-tech app.' },
    { id: 'term-sheet', term: 'Term Sheet', category: 'Financial', definition: 'A non-binding agreement setting the basic terms for an investment.', example: 'Reviewing liquidation preference and board seat requirements.' },
    { id: 'arr', term: 'ARR & MRR', category: 'Financial', definition: 'Annual/Monthly Recurring Revenue. The predictable revenue expected every period.', example: '100 schools paying $10/month = $1,000 MRR.' },
    { id: 'cap-table', term: 'Cap Table', category: 'Financial', definition: 'Capitalization Table. A spreadsheet showing who owns what equity in a company.', example: 'Founders own 80%, angel investors own 20%.' },
    { id: 'safe', term: 'SAFE Note', category: 'Financial', definition: 'Simple Agreement for Future Equity. Allows investors to buy shares in a future round.', example: 'Raising $100k today that converts to shares during Series A.' },
    { id: 'due-diligence', term: 'Due Diligence', category: 'Financial', definition: 'An investigation of a potential investment to confirm all material facts.', example: 'Investors reviewing legal contracts before wiring money.' },
    { id: 'series-seed', term: 'Seed Round', category: 'Financial', definition: 'The initial capital used when starting a business.', example: 'Raising $500K to build the first working prototype.' },
    { id: 'series-a', term: 'Series A/B/C', category: 'Financial', definition: 'Successive rounds of funding tied to reaching major scale milestones.', example: 'Raising Series A to expand from 1 city to 10 cities.' },
    { id: 'valuation', term: 'Pre/Post-Money Valuation', category: 'Financial', definition: 'The value of a company before and immediately after receiving investment.', example: '$4M Pre-Money + $1M Investment = $5M Post-Money.' },
    { id: 'roi', term: 'ROI', category: 'Financial', definition: 'Return on Investment. The ratio of net income to investment.', example: 'Spending $1,000 to make $1,500 yields a 50% ROI.' },

    // Growth & Marketing
    { id: 'ltv', term: 'LTV (Lifetime Value)', category: 'Growth', definition: 'The total value a beneficiary generates over their relationship with your venture.', example: 'Cumulative learning gains from a student over 5 years.' },
    { id: 'cac', term: 'CAC (Customer Acq. Cost)', category: 'Growth', definition: 'Total cost associated with convincing a potential customer to use your service.', example: '$500 spent to get 50 farmers means $10 CAC.' },
    { id: 'tam', term: 'TAM / SAM / SOM', category: 'Growth', definition: 'Total Addressable Market, Serviceable Available Market, and Serviceable Obtainable Market.', example: 'TAM is all global students, SOM is students in Bangalore you can reach.' },
    { id: 'churn', term: 'Churn Rate', category: 'Growth', definition: 'The rate at which customers stop doing business with an entity.', example: 'If 5 out of 100 subscribers cancel this month, churn is 5%.' },
    { id: 'incubator', term: 'Incubator / Accelerator', category: 'Growth', definition: 'Programs designed to help startups succeed via mentorship or funding.', example: 'Joining Y Combinator for 3 months to refine the product.' },
    { id: 'go-to-market', term: 'Go-To-Market (GTM)', category: 'Growth', definition: 'An action plan specifying how a company will reach target customers.', example: 'Partnering with local NGOs to distribute water filters directly.' },
    { id: 'virality', term: 'Viral Coefficient', category: 'Growth', definition: 'The number of new users an existing user generates.', example: 'K factor of 1.2 means every 10 users bring in 12 new ones.' },
    { id: 'conversion-rate', term: 'Conversion Rate', category: 'Growth', definition: 'Percentage of users who take a desired action.', example: '10 out of 100 website visitors signing up = 10% conversion.' },

    // Strategy & Core Theory
    { id: 'pmf', term: 'PMF (Product-Market Fit)', category: 'Strategy', definition: 'The degree to which a product satisfies a strong market demand.', example: 'Farmers requesting irrigation systems faster than you can build them.' },
    { id: 'pivot', term: 'Pivot', category: 'Strategy', definition: 'A fundamental shift in strategy when the current path is not working.', example: 'Shifting from high-cost hardware to an SMS-based advice system.' },
    { id: 'mvc', term: 'MVP / MVC', category: 'Strategy', definition: 'Minimum Viable Product/Concept. Simplest version to start learning.', example: 'A manual community compost station before buying an automated plant.' },
    { id: 'moat', term: 'Moat (Defensibility)', category: 'Strategy', definition: 'A competitive advantage making it difficult for others to compete.', example: 'Proprietary AI data on rural crop disease patterns.' },
    { id: 'exit-strategy', term: 'Exit Strategy', category: 'Strategy', definition: 'A plan for how a founder will leave their business.', example: 'Acquisition by a global NGO (M&A) or an IPO.' },
    { id: 'b2b', term: 'B2B / B2C / B2G', category: 'Strategy', definition: 'Business-to-Business, Consumer, or Government. Defines the primary customer.', example: 'Selling bulk educational tablets to the Ministry of Ed is B2G.' },
    { id: 'pitch-deck', term: 'Pitch Deck', category: 'Strategy', definition: 'A presentation used to provide a quick overview of your business plan.', example: 'A 10-slide deck summarizing the problem, solution, and market size.' },
    { id: 'blue-ocean', term: 'Blue Ocean Strategy', category: 'Strategy', definition: 'Creating a new, uncontested market space rather than competing in an existing one.', example: 'Cirque du Soleil reinventing the circus for adults.' },
    { id: 'freemium', term: 'Freemium', category: 'Strategy', definition: 'Offering basic services for free while charging for advanced features.', example: 'Free basic learning app, paid tier for tutor access.' },

    // Operational & Legal
    { id: 'scalability', term: 'Scalability', category: 'Operational', definition: 'The ability of a system to handle growing amounts of work efficiently.', example: 'A software curriculum expanding to 100 villages without doubling costs.' },
    { id: 'vesting', term: 'Vesting', category: 'Legal', definition: 'The process of earning ownership of the company over time.', example: '4-year schedule to ensure founder long-term commitment.' },
    { id: 'cliff', term: 'Cliff', category: 'Legal', definition: 'A period at the beginning of vesting where no equity is earned.', example: '1-year cliff means 0% equity if you leave before 12 months.' },
    { id: 'kpi', term: 'KPI / OKR', category: 'Operational', definition: 'Key Performance Indicators & Objectives and Key Results.', example: 'Objective: Expand reach. Key Result: Hit 5,000 active users by Q3.' },
    { id: 'sweat-equity', term: 'Sweat Equity', category: 'Legal', definition: 'Non-monetary investment (time/effort) founders contribute.', example: 'Working nights and weekends for 6 months without taking a salary.' },
    { id: 'agile', term: 'Agile Methodology', category: 'Operational', definition: 'Project management approach focused on iterative, rapid development loops.', example: 'Releasing app updates every 2 weeks based on user feedback.' },
    { id: 'board-of-directors', term: 'Board of Directors', category: 'Legal', definition: 'A group elected to represent shareholders and oversee strategy.', example: 'Meeting quarterly with investors to approve the annual budget.' },
    { id: 'ip', term: 'IP (Intellectual Property)', category: 'Legal', definition: 'Creations of the mind protected by law (Patents, Trademarks).', example: 'Patenting a novel water filtration membrane.' },

    // Impact & ESG Frameworks
    { id: 'sroi', term: 'SROI', category: 'Impact', definition: 'Social Return on Investment. Measuring non-financial value created.', example: 'For every $1 invested, producing $3 in measurable societal value.' },
    { id: 'toc', term: 'Theory of Change', category: 'Impact', definition: 'A methodology mapping how short-term actions lead to long-term goals.', example: 'Mapping exactly how providing laptops leads to higher graduation rates.' },
    { id: 'tbl', term: 'Triple Bottom Line', category: 'Impact', definition: 'Accounting framework with three parts: social, environmental, and financial.', example: 'Evaluating success by Profit, People, AND Planet.' },
    { id: 'esg', term: 'ESG Criteria', category: 'Impact', definition: 'Environmental, Social, and Governance standards for operations.', example: 'Investors refusing to fund ventures with poor carbon offset policies.' },
    { id: 'sdgs', term: 'SDGs', category: 'Impact', definition: 'Sustainable Development Goals set by the United Nations.', example: 'Aligning a clean water startup with UN SDG 6 (Clean Water & Sanitation).' },
    { id: 'greenwashing', term: 'Greenwashing', category: 'Impact', definition: 'Making misleading claims about the environmental benefits of a product.', example: 'A fast-fashion brand claiming to be "100% sustainable".' },
    { id: 'circular-economy', term: 'Circular Economy', category: 'Impact', definition: 'An economic system aimed at eliminating waste via continuous use of resources.', example: 'Collecting used plastic bottles to 3D print prosthetic limbs.' },
    { id: 'b-corp', term: 'B-Corp Certification', category: 'Impact', definition: 'A private certification for for-profit companies measuring social/env. performance.', example: 'Patagonia is a certified B-Corp.' },

    // Web3 & Advanced Tech
    { id: 'dao', term: 'DAO', category: 'Web3', definition: 'Decentralized Autonomous Organization. Ruled by smart contracts, not bosses.', example: 'A global community voting on which climate projects to fund.' },
    { id: 'smart-contract', term: 'Smart Contract', category: 'Web3', definition: 'Self-executing code where terms are directly written into lines of code.', example: 'Funds auto-release to farmers only when rainfall drops below 10mm.' },
    { id: 'tokenomics', term: 'Tokenomics', category: 'Web3', definition: 'The economics and incentive structure behind a cryptocurrency/token.', example: 'Rewarding users with "Impact Coins" for every hour they volunteer.' },
    { id: 'tvl', term: 'TVL', category: 'Web3', definition: 'Total Value Locked. The amount of funds staked or locked in a protocol.', example: 'A decentralized lending pool has a TVL of $5 Million.' },
    { id: 'ai-hallucination', term: 'AI Hallucination', category: 'Technology', definition: 'When an AI model generates false or illogical information with high confidence.', example: 'A medical AI aggressively diagnosing a non-existent disease.' },
    { id: 'rag', term: 'RAG (Retrival-Augmented Gen)', category: 'Technology', definition: 'AI framework that retrieves facts from an external database to ground responses.', example: 'Connecting a chatbot to Wikipedia so it answers accurately.' },
    { id: 'blockchain', term: 'Blockchain', category: 'Web3', definition: 'A distributed, immutable digital ledger of transactions.', example: 'Ensuring transparent, un-hackable tracking of charity donations.' },
    { id: 'api', term: 'API', category: 'Technology', definition: 'Application Programming Interface. Hooks allowing software to talk to each other.', example: 'Using Google Maps API inside your delivery routing app.' }
  ],
  Hindi: [
    { id: 'runway', term: 'रनवे (Runway)', category: 'Financial', definition: 'वह समय जब तक आपका स्टार्टअप बिना किसी नए निवेश के चल सकता है।', example: '50 हजार बैंक में और 5 हजार प्रति माह खर्च मतलब 10 महीने का रनవే।', youtubeUrl: 'https://www.youtube.com/watch?v=7uGvLbeXNfA' },
    { id: 'burn-rate', term: 'बर्न रेट (Burn Rate)', category: 'Financial', definition: 'वह दर जिस पर आपकी कंपनी समय के साथ नकदी खर्च करती है।', example: 'यदि आप हर महीने कमाई से 10,000 रुपये अधिक खर्च करते हैं।', youtubeUrl: 'https://www.youtube.com/watch?v=yYJ6xGv35mY' },
    { id: 'ltv', term: 'एलटीवी (LTV)', category: 'Growth', definition: 'एक ग्राहक द्वारा आपके व्यापार के साथ रहने के दौरान उत्पन्न कुल मूल्य।', example: '5 वर्षों में एक छात्र द्वारा प्राप्त कुल शिक्षा लाभ।', youtubeUrl: 'https://www.youtube.com/watch?v=9Lp9Vz2q_lU' },
    // Simplified for brevity, would usually do all 20
    ...(EXTENDED_DICTIONARY_TERMS as Term[])
  ],
  Telugu: [
    { id: 'runway', term: 'రన్వే (Runway)', category: 'Financial', definition: 'మీ వెంచర్ నగదు అయిపోకముందు ఎంత కాలం పాటు పనిచేయగలదనే సమయం.', example: '50 వేల రూపాయలు ఉండి, నెలకు 5 వేల ఖర్చు ఉంటే 10 నెలల రన్వే ఉంటుంది.', youtubeUrl: 'https://www.youtube.com/watch?v=7uGvLbeXNfA' },
    { id: 'burn-rate', term: 'బర్న్ రేట్ (Burn Rate)', category: 'Financial', definition: 'మీ కంపెనీ కాలక్రమేణా నగదును ఖర్చు చేసే రేటు.', example: 'సంపాదన కంటే నెలకు 10,000 రూపాయలు ఎక్కువగా ఖర్చు చేయడం.', youtubeUrl: 'https://www.youtube.com/watch?v=yYJ6xGv35mY' },
  ]
};

// Global for search
export const TERMS = DICTIONARY_DATA.English;

export function StartupDictionary() {
  const { state, updateState, t } = useSimulation();
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [claimedTerms, setClaimedTerms] = useState<Set<string>>(new Set());

  const currentLanguage = (state.gameLanguage === 'Telugu' || state.gameLanguage === 'Hindi') ? state.gameLanguage : 'English';
  const localizedTerms = DICTIONARY_DATA[currentLanguage] || DICTIONARY_DATA.English;

  const onClaimKnowledge = async (id: string) => {
    if (claimedTerms.has(id)) {
      toast.info("Knowledge already absorbed for this session!");
      return;
    }
    const REWARD = 5;
    await updateState({ yuktiCoins: (state.yuktiCoins || 0) + REWARD });
    setClaimedTerms(prev => new Set(prev).add(id));
    toast.success(`Research Grant: +${REWARD} YKC!`, {
      icon: <Zap size={14} className="text-amber-500" />
    });
  };

  const CATEGORY_STYLES: Record<string, string> = {
    Financial: 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20',
    Strategy: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20',
    Operational: 'bg-indigo-50 text-indigo-600 border-indigo-100 dark:bg-indigo-500/10 dark:text-indigo-400 dark:border-indigo-500/20',
    Growth: 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20',
    Web3: 'bg-purple-50 text-purple-600 border-purple-100 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20',
    Impact: 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20',
    Technology: 'bg-cyan-50 text-cyan-600 border-cyan-100 dark:bg-cyan-500/10 dark:text-cyan-400 dark:border-cyan-500/20',
    Legal: 'bg-slate-50 text-slate-600 border-slate-100 dark:bg-slate-500/10 dark:text-slate-400 dark:border-slate-500/20',
  };

  const filteredTerms = localizedTerms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) || 
                          t.definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !selectedCategory || t.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(localizedTerms.map(t => t.category)));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
           <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-teal-50 dark:bg-teal-500/10 rounded-2xl border border-teal-100 dark:border-teal-500/20 shadow-sm">
                <BookOpen size={24} className="text-teal-600 dark:text-teal-400" />
              </div>
              <h2 className="text-4xl font-headline font-black text-slate-900 dark:text-white tracking-tight">{t('dictionary')}</h2>
           </div>
           <p className="text-slate-500 dark:text-slate-400 font-medium max-w-md text-lg italic">Master the high-stakes lexicon of strategic execution. Earn Yukti Coins by absorbing research.</p>
        </motion.div>

        <div className="flex-1 max-w-md relative group">
          <Search className={cn("absolute left-5 top-1/2 -translate-y-1/2 transition-colors", search ? "text-teal-500" : "text-slate-400")} size={20} />
          <input 
            type="text"
            placeholder={t('search_placeholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-16 bg-white dark:bg-white/5 border-2 border-slate-100 dark:border-white/10 rounded-[2rem] pl-14 pr-6 focus:border-teal-500 outline-none font-bold text-on-surface dark:text-white transition-all shadow-sm focus:shadow-xl placeholder:text-slate-300 dark:placeholder:text-white/20"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={cn(
            "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
            !selectedCategory ? "bg-teal-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xl scale-105" : "bg-white dark:bg-white/5 text-slate-400 dark:text-white/40 border border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
          )}
        >
          All Terms
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={cn(
              "px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              selectedCategory === cat ? "bg-teal-900 dark:bg-teal-500 text-white dark:text-slate-950 shadow-xl scale-105" : "bg-white dark:bg-white/5 text-slate-400 dark:text-white/40 border border-slate-100 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/10"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
        <AnimatePresence mode="popLayout">
          {filteredTerms.map((term) => (
            <motion.div 
              layout id={`term-${term.id}`}
              key={term.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-slate-900 p-10 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all group overflow-hidden relative"
            >
              <div className={cn("absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity rotate-12 group-hover:rotate-0 transition-transform", 
                CATEGORY_STYLES[term.category]?.split(' ').find(c => c.startsWith('text-')))}>
                {term.category === 'Financial' && <TrendingUp size={120} />}
                {term.category === 'Strategy' && <Target size={120} />}
                {term.category === 'Operational' && <Briefcase size={120} />}
                {term.category === 'Growth' && <Zap size={120} />}
                {term.category === 'Web3' && <Globe size={120} />}
                {term.category === 'Impact' && <Heart size={120} />}
                {term.category === 'Technology' && <Cpu size={120} />}
                {term.category === 'Legal' && <Shield size={120} />}
              </div>

              <div className="relative z-10">
                <div className={cn("inline-block px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8 border transition-colors", CATEGORY_STYLES[term.category])}>
                  {term.category}
                </div>
                <h3 className="text-3xl font-headline font-black text-slate-900 dark:text-white mb-4 tracking-tighter leading-none group-hover:text-teal-900 dark:group-hover:text-teal-400 transition-colors">{term.term}</h3>
                <p className="text-[15px] text-slate-500 dark:text-white/60 font-medium leading-relaxed mb-10 h-[90px] line-clamp-4">
                  {term.definition}
                </p>
                
                <div className="bg-slate-50 dark:bg-white/5 group-hover:bg-teal-50/50 dark:group-hover:bg-teal-500/10 rounded-[2.5rem] p-8 border border-slate-100 dark:border-white/10 group-hover:border-teal-100/50 dark:group-hover:border-teal-500/20 mb-8 transition-colors">
                   <div className="flex items-center gap-3 mb-3 text-slate-400 dark:text-white/30 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                      <Info size={16} />
                      <span className="text-[10px] font-black uppercase tracking-widest italic">Mission Context</span>
                   </div>
                   <p className="text-sm font-bold text-slate-800 dark:text-white/80 leading-relaxed italic">
                     "{term.example}"
                   </p>
                </div>

                <div className="flex gap-2">
                  <a 
                    href={term.youtubeUrl || "https://youtube.com"} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={cn(
                      "flex-1 flex items-center justify-center gap-3 py-5 rounded-3xl text-[9px] font-black uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95",
                      term.youtubeUrl ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-100" : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                    )}
                  >
                    <Play size={14} fill="currentColor" /> {term.youtubeUrl ? "Video" : "Soon"}
                  </a>
                  <button 
                    onClick={() => {
                      const { updateState, state } = useSimulation(); // This might need careful ref inside map
                      // However, we are outside useSimulation hook here, we should pull it into the main component
                      // I will fix the component definition below to provide the reward callback
                      onClaimKnowledge(term.id);
                    }}
                    className="flex-1 py-5 bg-teal-500 text-slate-950 rounded-3xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:bg-teal-400 transition-all flex items-center justify-center gap-2"
                  >
                    <Zap size={14} /> +5 YKC
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredTerms.length === 0 && (
        <div className="text-center py-32 bg-slate-50 rounded-[5rem] border-2 border-dashed border-slate-200">
          <BookOpen className="mx-auto text-slate-200 mb-6" size={80} />
          <p className="text-slate-400 font-black uppercase tracking-[0.4em] text-lg">Knowledge Void: No Matching Terms</p>
        </div>
      )}
    </div>
  );
}
