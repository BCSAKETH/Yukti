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

Advanced Scaling & Legal
Decacorn
Hectocorn
Growth Equity
Mezzanine Financing
Venture Debt
Convertible Debt
ESOP Pool
Clawback
Pay to Play
Ratchet Provision
Sunset Clause
Right of First Refusal (ROFR)
Co-sale Right
No-shop Clause
Information Rights
Observer Rights
Board Seat
Letter of Intent (LOI)
Memorandum of Understanding (MOU)
Non-Compete Agreement
Non-Solicitation Agreement
Vesting Cliff
Acceleration
Single Trigger
Double Trigger
Founder Vesting
Option Pool Shuffle
Capital Call
Dry Powder
IRR (Internal Rate of Return)
MOIC (Multiple on Invested Capital)
DPI (Distributions to Paid-In Capital)
RVPI (Residual Value to Paid-In Capital)
TVPI (Total Value to Paid-In Capital)
Hurdle Rate
Fund of Funds
Family Office
Corporate Venture Capital (CVC)
Sovereign Wealth Fund
Impact Investing
ESG (Environmental, Social, and Governance)
B Corp
Carbon Credit
Circular Economy
Greenwashing
Social Enterprise
Microfinance
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
  'Data, Artificial Intelligence & Deep Tech': 'Dynamic', // Or map to 'Technology'
  'Web3 & Crypto': 'Web3'
};

for (const line of lines) {
  if (categoryMap[line] || ['Funding, Equity & Finance', 'Strategy, Business Models & Market', 'Growth, Sales & Metrics', 'Operations, Team & Methodologies', 'Product Design & UX/UI', 'Tech, Engineering & Infrastructure', 'Data, Artificial Intelligence & Deep Tech', 'Web3 & Crypto'].includes(line)) {
    // Some lines might not match perfectly if there's trailing space, mapped explicitly above
    currentCategory = categoryMap[line] || 'Technology';
  } else {
    // Generate id
    const id = line.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    categorizedParams.push({
      id,
      term: line,
      category: currentCategory,
      definition: line + " refers to one of the key concepts in modern startup ecosystems. Definition to be expanded.",
      example: "Founders heavily rely on " + line + " when scaling their business."
    });
  }
}

// Generate TS file
const tsContent = "// Auto-generated dictionary terms\n\nexport const EXTENDED_DICTIONARY_TERMS = " + JSON.stringify(categorizedParams, null, 2) + ";\n";

fs.writeFileSync('src/data/startupTerms.ts', tsContent);
console.log('Successfully wrote to src/data/startupTerms.ts');
