const fs = require('fs');

const files = [
  './src/components/sections/ProjectsSection.tsx',
  './src/components/sections/ExpertiseSection.tsx',
  './src/components/sections/ContactSection.tsx',
  './src/components/ui/Footer.tsx'
];

files.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');
    // Replace bg-brand-black with nothing or bg-transparent to allow ambient glow
    content = content.replace(/\bbg-brand-black\b/g, 'bg-transparent relative z-10');
    // The inner containers should also have clear backgrounds
    fs.writeFileSync(file, content);
  }
});
