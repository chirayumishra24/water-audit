
const fs = require('fs');
const content = fs.readFileSync('c:/Users/ASUS/OneDrive/Desktop/skilizee/water/src/components/activities/town-hall-sim.tsx', 'utf8');

function checkBalance(text) {
    let braces = 0;
    let parens = 0;
    let brackets = 0;
    let tags = [];
    
    // Simple tag regex (doesn't handle everything but good for basic checks)
    const tagRegex = /<(\/?[a-zA-Z][a-zA-Z0-9]*)/g;
    let match;
    
    for (let i = 0; i < text.length; i++) {
        if (text[i] === '{') braces++;
        if (text[i] === '}') braces--;
        if (text[i] === '(') parens++;
        if (text[i] === ')') parens--;
        if (text[i] === '[') brackets++;
        if (text[i] === ']') brackets--;
    }
    
    while ((match = tagRegex.exec(text)) !== null) {
        const tagName = match[1];
        if (tagName.startsWith('/')) {
            const closing = tagName.slice(1);
            if (tags.length > 0 && tags[tags.length - 1] === closing) {
                tags.pop();
            } else {
                console.log('Mismatched closing tag:', closing, 'at index', match.index);
            }
        } else {
            // Check if self-closing
            const sub = text.slice(match.index);
            const endMatch = sub.match(/^<[a-zA-Z][a-zA-Z0-9]*[^>]*(\/)?>/);
            if (endMatch && !endMatch[1]) {
                tags.push(tagName);
            }
        }
    }
    
    console.log('Braces:', braces);
    console.log('Parens:', parens);
    console.log('Brackets:', brackets);
    console.log('Open Tags:', tags.join(', '));
}

checkBalance(content);
