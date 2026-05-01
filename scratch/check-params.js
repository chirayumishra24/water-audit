const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const defs = [
  { slug: 'foundations', order: 1 },
  { slug: 'measurement', order: 2 },
  { slug: 'reporting-action', order: 3 },
  { slug: 'future-planning', order: 4 },
];

const dir = path.join(process.cwd(), 'content', 'chapters');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.mdx'));

const chapters = files.map(f => {
  const { data } = matter(fs.readFileSync(path.join(dir, f), 'utf8'));
  return { file: f, moduleSlug: data.moduleSlug, order: data.order };
});

const modules = defs.map(m => ({
  ...m,
  chapters: chapters.filter(c => c.moduleSlug === m.slug).sort((a, b) => a.order - b.order),
}));

const params = modules.flatMap(m => [
  { slug: String(m.order) },
  ...m.chapters.map(c => ({ slug: `${m.order}-${c.order}` })),
]);

console.log(JSON.stringify(params, null, 2));
