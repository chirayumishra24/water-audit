const fs = require('fs');
const path = require('path');

const dir = 'content/chapters';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

const activities = [
  'WaterMapExplorer', 'VirtualSchoolAudit', 'MonsoonSimulator', 'BucketLab',
  'MeterDetective', 'BoundarySandbox', 'WaterBalanceBuilder', 'SiteWalkthrough',
  'TapRepairSimulator', 'GroundwaterSandbox', 'OpportunityRanking',
  'ImplementationSimulator', 'CommunityGrowth', 'TownHallSim', 'CareerExploration',
  'PhetSimulation', 'ExternalSimulation'
];

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');
  let lines = content.split('\n');
  let modified = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line.startsWith('<') && line.endsWith('/>')) {
      const componentName = line.match(/<([A-Za-z]+)/);
      if (componentName && activities.includes(componentName[1])) {
        // Check if previous non-empty line is a heading
        let prevIndex = i - 1;
        while (prevIndex >= 0 && lines[prevIndex].trim() === '') {
          prevIndex--;
        }
        if (prevIndex >= 0 && !lines[prevIndex].trim().startsWith('#')) {
          // insert heading
          lines.splice(i, 0, '### Practice: Interactive Activity', '');
          modified = true;
          i += 2; // skip the lines we just added
        }
      }
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, lines.join('\n'));
    console.log(`Updated ${file}`);
  }
});
