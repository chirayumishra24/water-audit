const fs = require('fs');
const path = require('path');

const chaptersDir = path.join(__dirname, '../content/chapters');

function processFile(filename) {
    const filePath = path.join(chaptersDir, filename);
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Split frontmatter and body
    const parts = content.split('---');
    if (parts.length < 3) return;
    
    let body = parts.slice(2).join('---').trim();
    const frontmatter = parts[1];
    
    // Check if body starts with a heading
    const firstLine = body.split('\n')[0].trim();
    if (!firstLine.startsWith('#')) {
        console.log(`Adding heading to ${filename}`);
        body = `### Overview\n\n${body}`;
        const newContent = `---${frontmatter}---` + (body.startsWith('\n') ? '' : '\n\n') + body;
        fs.writeFileSync(filePath, newContent);
    } else {
        console.log(`Skipping ${filename}, already starts with heading`);
    }
}

const files = fs.readdirSync(chaptersDir).filter(f => f.endsWith('.mdx'));
files.forEach(processFile);
