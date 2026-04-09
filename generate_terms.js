import fs from 'fs';

const rawText = `
Funding, Equity & Finance
Acqui-hire
Angel Investor
Angel Syndicate
Anti-Dilution Provision
ARR & MRR (Annual/Monthly Recurring Revenue)
Bootstrapping
Bridge Loan
Burn Multiple
Burn Rate
Cap Table
Cliff / Cliff Vesting
Convertible Note
Crowdfunding
Dilution
Down Round
Drag-along Rights
Due Diligence
EBITDA
Equity
Exit Strategy
Fiat
Golden Handcuffs
Golden Parachute
GP (General Partner)
Gross Margin
IPO (Initial Public Offering)
Lead Investor
Liquidation Preference
Liquidity Event
LP (Limited Partner)
M&A (Mergers and Acquisitions)
Net Margin
Phantom Equity
Pitch Deck
Post-money Valuation
Pre-money Valuation
Pro Rata Rights
ROI (Return on Investment)
Run Rate
Runway
SAFE Note
Seed Round
Series A
Series B / Series C
SPAC (Special Purpose Acquisition Company)
SROI (Social Return on Investment)
Stock Options (ESOP)
Sweat Equity
Tag-along Rights
TBL (Triple Bottom Line)
Term Sheet
Tiered Pricing
Up Round
Value-Based Pricing
VC (Venture Capital)
Vesting
Warrant

Strategy, Business Models & Market
B2B / B2C
B2B2C
Blue Ocean Strategy
D2C (Direct-to-Consumer)
Disruption
Fast Follower
First-Mover Advantage
Freemium
GTM (Go-to-Market) Strategy
Lean Startup
Moat
MVC (Minimum Viable Concept)
MVP (Minimum Viable Product)
Network Effects
Omnichannel
PaaS (Platform as a Service)
Paywall
Pivot
PLG (Product-Led Growth)
PMF (Product Market Fit)
Red Ocean Strategy
SaaS (Software as a Service)
SAM (Serviceable Available Market)
SLG (Sales-Led Growth)
SOM (Serviceable Obtainable Market)
TAM (Total Addressable Market)
TOC (Theory of Change)
USP (Unique Selling Proposition)
Value Proposition

Growth, Sales & Metrics
Account Executive (AE)
ARPU (Average Revenue Per User)
BOFU (Bottom of Funnel)
Bounce Rate
CAC (Customer Acquisition Cost)
CAC Payback Period
Churn Rate
Conversion Funnel
Conversion Rate
CPC (Cost Per Click)
CPM (Cost Per Mille)
CRM (Customer Relationship Management)
CTR (Click-Through Rate)
Customer Success Manager (CSM)
DAU / MAU (Daily/Monthly Active Users)
Growth Hacking
IaaS (Infrastructure as a Service)
Impact Dilution
Inbound / Outbound Marketing
Lead Generation
LTV (Lifetime Value)
LTV:CAC Ratio
NPS (Net Promoter Score)
Qualified Lead (MQL / SQL)
Quota
Retention Rate
Sales Development Rep (SDR)
Sales Pipeline
Scalability
SEO / SEM
Stickiness
TOFU (Top of Funnel)
Unit Economics
Upsell / Cross-sell
Viral Coefficient

Operations, Team & Methodologies
Advisory Board
Agile / Scrum
Asynchronous Communication
Board of Directors
C-Suite (CEO, CTO, COO, CMO, CFO)
Daily Standup
Incubator / Accelerator
Kanban
KPI (Key Performance Indicator)
NDA (Non-Disclosure Agreement)
Offshoring
OKR (Objectives and Key Results)
Onboarding / Offboarding
Outsourcing
SLA (Service-Level Agreement)
Solo-founder
Sprint
Sprint Retrospective
Velocity
Waterfall Model

Product Design & UX/UI
A/B Testing
Accessibility (a11y)
Call to Action (CTA)
Dark Pattern
Design Thinking
Heatmap
Heuristic Evaluation
Information Architecture (IA)
Microinteractions
Mockup
Onboarding Flow
Prototype
User Journey Map
User Persona
Wireframe

Tech, Engineering & Infrastructure
API (Application Programming Interface)
CI/CD (Continuous Integration / Continuous Deployment)
Cloud Native
Docker / Containerization
Dogfooding
Edge Computing
Feature Creep / Scope Creep
Git / Version Control
GraphQL
Hotfix
Kubernetes
Latency
Load Balancing
Microservices
Monolithic Architecture
Open Source
Production Environment
QA (Quality Assurance)
Refactoring
REST API
Sandbox
SDK (Software Development Kit)
Serverless
Staging Environment
Tech Debt (Technical Debt)
Tech Stack
Uptime / Downtime
Webhook
Zero Trust Architecture

Data, Artificial Intelligence & Deep Tech
AI Washing
Algorithmic Bias
Computer Vision
Data Lake
Data Warehouse
Deep Learning
ETL (Extract, Transform, Load)
Hallucination (AI)
LLM (Large Language Model)
Machine Learning (ML)
Neural Network
NLP (Natural Language Processing)
Prompt Engineering
RAG (Retrieval-Augmented Generation)
Training Data / Test Data
Vector Database

Web3 & Crypto
Cold Wallet / Hot Wallet
dApp (Decentralized Application)
DAO (Decentralized Autonomous Organization)
DeFi (Decentralized Finance)
Gas Fee
Smart Contract
Tokenomics
`;

const lines = rawText.split('\n').map(l => l.trim()).filter(l => l.length > 0);
const categorizedParams = [];
let currentCategory = '';

const categoryMap = {
  'Funding, Equity & Finance': 'Financial',
  'Strategy, Business Models & Market': 'Strategy',
  'Growth, Sales & Metrics': 'Growth',
  'Operations, Team & Methodologies': 'Operational',
  'Product Design & UX/UI': 'Technology',
  'Tech, Engineering & Infrastructure': 'Technology',
  'Data, Artificial Intelligence & Deep Tech': 'Technology',
  'Web3 & Crypto': 'Web3'
};

for (const line of lines) {
  if (categoryMap[line]) {
    currentCategory = categoryMap[line];
  } else {
    categorizedParams.push({ term: line, category: currentCategory });
  }
}

async function fetchDefinitions(terms) {
  const apiKey = process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('No VITE_GROQ_API_KEY present. Please set it.');
    process.exit(1);
  }

  const results = [];
  
  // Chunking to avoid massive responses
  const chunk_size = 15;
  for (let i = 0; i < terms.length; i += chunk_size) {
    const chunk = terms.slice(i, i + chunk_size);
    console.log("Processing chunk " + (i / chunk_size + 1) + " / " + Math.ceil(terms.length / chunk_size) + "...");
    
    const prompt = "You are a startup dictionary bot. For each of the following terms, provide a 1-sentence definition and a 1-sentence real-world startup example.\n" +
"Respond with pure JSON only in this format:\n" +
"[\n" +
'  {"id": "kebab-case-term-name", "term": "Original Term", "category": "Assigned Category", "definition": "...", "example": "..."}\n' +
"]\n\n" +
"Terms to define:\n" + chunk.map(t => "- " + t.term + " (Category: " + t.category + ")").join('\n');

    try {
      const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': "Bearer " + apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.1-8b-instant',
          messages: [
            { role: 'system', content: 'Output pure JSON array.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' } // Groq sometimes fails with json_object if prompt doesn't explicitly have the word "JSON"
        })
      });

      const data = await response.json();
      if (!response.ok) {
        console.error('Error generating:', data);
        continue;
      }

      let content = data.choices[0].message.content;
      content = content.replace(/^```json/m, '').replace(/```$/m, '').trim();
      let parsed = JSON.parse(content);
      
      // Pluck array out if it's wrapped in an object
      if (!Array.isArray(parsed)) {
        for (const key in parsed) {
          if (Array.isArray(parsed[key])) parsed = parsed[key];
        }
      }

      if (Array.isArray(parsed)) {
        results.push(...parsed);
      } else {
        console.warn('Failed to parse array from ', content);
      }
    } catch(err) {
      console.error('Chunk failed', err);
    }
  }

  return results;
}

async function run() {
  const terms = await fetchDefinitions(categorizedParams);
  fs.writeFileSync('generated_terms.json', JSON.stringify(terms, null, 2));
  console.log('Written to generated_terms.json');
}

run();
