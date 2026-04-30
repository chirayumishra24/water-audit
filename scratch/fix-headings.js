const fs = require('fs');
const path = require('path');

const dir = 'content/chapters';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Replace <h3>Text</h3> with ### Text
  let modifiedContent = content.replace(/<h3>(.*?)<\/h3>/g, '### $1');
  
  // Replace <h2>Text</h2> with ## Text
  modifiedContent = modifiedContent.replace(/<h2>(.*?)<\/h2>/g, '## $1');

  if (modifiedContent !== content) {
    fs.writeFileSync(filePath, modifiedContent);
    console.log(`Updated ${file}`);
  }
});
