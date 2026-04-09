const fs = require('fs');
const path = require('path');

const file = path.join(__dirname, 'src', 'components', 'SprintGame.tsx');
let content = fs.readFileSync(file, 'utf8');

// The user complained about looking "grey", which comes from using "bg-slate-50/80", "bg-slate-100/80", etc in the last pass.
content = content.replace(/bg-slate-50\/80/g, 'bg-white');
content = content.replace(/bg-slate-100\/80/g, 'bg-slate-50');
content = content.replace(/bg-slate-200\/50/g, 'bg-slate-50');
content = content.replace(/bg-white\/90/g, 'bg-white/95 backdrop-blur-xl');

fs.writeFileSync(file, content, 'utf8');
console.log('Colors un-greyed');
