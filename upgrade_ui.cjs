const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'SprintGame.tsx');
let content = fs.readFileSync(file, 'utf8');

content = content.replace(/bg-white border-8 border-slate-900 rounded-\[([^\]]+)\] p-(\d+) shadow-\[[^\]]+\]/g, 'bg-white/90 dark:bg-slate-900/90 border border-white/20 dark:border-slate-700/50 rounded-[$1] p-$2 shadow-2xl backdrop-blur-xl');
content = content.replace(/border-4 border-slate-900/g, 'border-2 border-slate-200/50 dark:border-slate-700/50 shadow-md backdrop-blur-sm');
content = content.replace(/border-2 border-slate-900/g, 'border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm');

// Add dark mode support to the game container
content = content.replace(/text-slate-800/g, 'text-slate-800 dark:text-slate-100');
content = content.replace(/bg-slate-50/g, 'bg-slate-50/80 dark:bg-slate-800/80');
content = content.replace(/bg-slate-100/g, 'bg-slate-100/80 dark:bg-slate-700/80');

fs.writeFileSync(file, content, 'utf8');
console.log('UI upgrade script complete.');
