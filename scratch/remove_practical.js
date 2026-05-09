const fs = require('fs');
const path = require('path');

const dir = 'content/chapters';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove <PracticalActivity ... />
    // This regex handles multi-line tags
    const newContent = content.replace(/<PracticalActivity[\s\S]*?\/>/g, '');
    
    if (content !== newContent) {
        fs.writeFileSync(filePath, newContent);
        console.log(`Updated ${file}`);
    }
});
