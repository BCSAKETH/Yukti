const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'SprintGame.tsx');
let content = fs.readFileSync(file, 'utf8');

// The goal is to carefully replace neobrutalist tailwind patterns with clean, soft glassmorphic patterns.
// Patterns: 
// 1. `border-8 border-slate-900 shadow-[X_X_0_0_black/rgba(15,23,42,1)]` 
//       -> `border border-white/20 shadow-xl backdrop-blur-xl bg-white/70 dark:bg-slate-900/70`
// 2. `border-4 border-slate-900 shadow-[X_X_0_0_X]` 
//       -> `border border-white/30 shadow-lg`

content = content.replace(/border-8 border-slate-900.*?shadow-\[[^\]]+\]/g, 'border border-white/20 shadow-2xl backdrop-blur-xl bg-white/80 dark:bg-slate-900/80');
content = content.replace(/border-4 border-slate-900.*?shadow-\[[^\]]+\]/g, 'border border-slate-200/50 dark:border-slate-700/50 shadow-xl backdrop-blur-md');
content = content.replace(/border-2 border-slate-900.*?shadow-\[[^\]]+\]/g, 'border border-slate-200/50 dark:border-slate-700/50 shadow-md backdrop-blur-sm');

content = content.replace(/border-8 border-slate-900/g, 'border-2 border-slate-200/50 dark:border-slate-800/50');
content = content.replace(/border-4 border-slate-900/g, 'border border-slate-300 dark:border-slate-700');
content = content.replace(/border-2 border-slate-900/g, 'border border-slate-300 dark:border-slate-700');

fs.writeFileSync(file, content, 'utf8');
console.log('UI upgrade script complete.');
