import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const html = readFileSync('index.html', 'utf8');
const references = [...html.matchAll(/(?:src|href|data-preview|data-poster)="(\.\/[^"#]+)"/g)]
  .map((match) => match[1]);
const missing = [...new Set(references)].filter((path) => !existsSync(resolve(path)));
const projects = ['boho-salon', 'catalog-runway', 'the-lab', 'farm-soy', 'style-up', 'slime-game'];
const missingProjects = projects.filter((id) => !html.includes(`id="${id}"`));
const problems = [];
if (missing.length) problems.push(`Missing assets: ${missing.join(', ')}`);
if (missingProjects.length) problems.push(`Missing games: ${missingProjects.join(', ')}`);
if ((html.match(/class="system-card"/g) || []).length !== 4) problems.push('Expected four selected systems');
if (/<video[^>]*autoplay/i.test(html)) problems.push('Unexpected autoplay video');
if ((html.match(/class="hover-preview" muted loop playsinline preload="none"/g) || []).length !== 6) problems.push('Hover previews need muted, inline, on-demand playback');

if (problems.length) {
  console.error(problems.join('\n'));
  process.exitCode = 1;
} else {
  console.log(`Verified ${new Set(references).size} local asset references, 6 games, 4 systems, and on-demand video markup.`);
}
