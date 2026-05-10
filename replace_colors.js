const fs = require('fs');
const path = require('path');

const directory = './src';

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
    });
}

const colorMap = {
    // Backgrounds (Black)
    'bg-gray-900': 'bg-brand-black',
    'from-gray-900': 'from-brand-black',
    'to-gray-900': 'to-brand-black',
    'bg-black': 'bg-brand-black',
    'bg-gray-800': 'bg-brand-teal/20', // Or a darker teal variant
    'from-gray-800': 'from-brand-teal/40',
    'via-gray-800': 'via-brand-teal/40',
    'to-gray-800': 'to-brand-teal/40',

    // Primary Accents (Cyan)
    'text-blue-400': 'text-brand-cyan',
    'text-blue-500': 'text-brand-cyan',
    'text-purple-400': 'text-brand-cyan',
    'text-purple-500': 'text-brand-cyan',
    'text-indigo-400': 'text-brand-cyan',
    'text-indigo-500': 'text-brand-cyan',
    'text-blue-300': 'text-brand-cyan',
    
    'bg-blue-500': 'bg-brand-cyan',
    'bg-purple-500': 'bg-brand-cyan',
    'bg-indigo-500': 'bg-brand-cyan',
    'bg-blue-600': 'bg-brand-cyan',
    'bg-purple-600': 'bg-brand-cyan',
    
    'from-blue-500': 'from-brand-cyan',
    'from-purple-500': 'from-brand-cyan',
    'from-blue-400': 'from-brand-cyan',
    'from-purple-400': 'from-brand-cyan',
    'from-indigo-400': 'from-brand-cyan',
    
    'via-purple-500': 'via-brand-cyan',
    'via-blue-500': 'via-brand-cyan',
    'via-purple-400': 'via-brand-cyan',
    
    'to-blue-500': 'to-brand-cyan',
    'to-purple-500': 'to-brand-cyan',
    'to-indigo-400': 'to-brand-cyan',
    'to-blue-400': 'to-brand-cyan',
    'to-purple-400': 'to-brand-cyan',

    'border-blue-500': 'border-brand-cyan',
    'border-purple-500': 'border-brand-cyan',
    'border-indigo-500': 'border-brand-cyan',
    'border-blue-400': 'border-brand-cyan',
    'hover:border-blue-400': 'hover:border-brand-cyan',
    'hover:border-blue-500': 'hover:border-brand-cyan',

    'shadow-blue-500': 'shadow-brand-cyan',
    'shadow-purple-500': 'shadow-brand-cyan',
    
    'ring-blue-500': 'ring-brand-cyan',

    // Teals (Inner Nodes & Borders)
    'border-gray-700': 'border-brand-teal',
    'border-gray-800': 'border-brand-teal',

    // Text & Subtitles (Muted Teal & White)
    'text-gray-400': 'text-brand-muted',
    'text-gray-300': 'text-brand-muted',
    'text-gray-500': 'text-brand-teal',
    'text-white': 'text-brand-white',
    
    // Gradient text
    'bg-gradient-to-r from-blue-400 via-purple-400 to-indigo-400': 'bg-gradient-to-r from-brand-cyan via-brand-cyan to-brand-cyan',
    'bg-gradient-to-r from-blue-400 to-purple-400': 'bg-gradient-to-r from-brand-cyan to-brand-cyan',
};

walkDir(directory, function(filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let originalContent = content;
        
        for (const [key, value] of Object.entries(colorMap)) {
            // We use split/join for global replace of precise class strings.
            // Using a regex with boundaries (\b) helps avoid partial matches.
            const regex = new RegExp(`\\b${key.replace(/[/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'g');
            content = content.replace(regex, value);
        }
        
        if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log(`Updated ${filePath}`);
        }
    }
});
