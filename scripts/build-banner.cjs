const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');
const sharp = require(process.env.SHARP_MODULE || 'sharp');

const frames = process.argv[2];
if (!frames) throw new Error('Provide a temporary frame directory.');
fs.mkdirSync(frames, { recursive: true });
const phrases = ['aprendendo.', 'experimentando.', 'compartilhando.'];

async function build() {
  for (let frame = 0; frame < 90; frame++) {
    const phase = Math.floor(frame / 30);
    const step = frame % 30;
    const phrase = phrases[phase];
    const count = step < 18 ? Math.floor(step * phrase.length / 17) : phrase.length;
    const typed = phrase.slice(0, count);
    const cursor = frame % 10 < 6 ? '_' : '';
    const sweep = 70 + (frame / 89) * 1060;
    const offset = Math.sin(frame / 90 * Math.PI * 2) * 12;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="360" viewBox="0 0 1200 360">
      <defs><linearGradient id="edge"><stop stop-color="#49e1cf"/><stop offset=".6" stop-color="#ab8bfa"/><stop offset="1" stop-color="#ffbe86"/></linearGradient></defs>
      <rect width="1200" height="360" rx="14" fill="#0e1015"/>
      <path d="M0 44H1200M0 318H1200" stroke="#292e38"/>
      <g fill="#8794a8" font-family="monospace" font-size="14"><text x="35" y="28">yuribarbosacouto / README</text><text x="35" y="343">RIO DE JANEIRO</text><text x="1000" y="343">ESTUDANTE DE ADS</text></g>
      <g font-family="Arial,sans-serif"><text x="55" y="128" fill="#98a2b5" font-size="24">Olá, mundo.</text><text x="51" y="206" fill="#f4f5fa" font-size="65" font-weight="700">Eu sou o Yuri<tspan fill="#49e1cf">.</tspan></text></g>
      <text x="55" y="274" fill="#b59afa" font-family="monospace" font-size="30">&gt; ${typed}${cursor}</text>
      <g transform="translate(0 ${offset.toFixed(2)})" fill="none" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"><path d="M910 133L860 182L910 231" stroke="#49e1cf"/><path d="M1030 133L1080 182L1030 231" stroke="#b59afa"/><path d="M990 117L952 247" stroke="#ffbe86"/></g>
      <path d="M35 317H1165" stroke="url(#edge)" stroke-width="2"/>
      <path d="M${sweep.toFixed(1)} 317h25" stroke="#fff" stroke-opacity=".65" stroke-width="2"/>
    </svg>`;
    await sharp(Buffer.from(svg)).resize(960, 288).png().toFile(path.join(frames, `${String(frame).padStart(3, '0')}.png`));
  }
  execFileSync('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-framerate', '12', '-i', path.join(frames, '%03d.png'), '-filter_complex', '[0:v]split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3', '-loop', '0', path.join(__dirname, '../assets/hello.gif')]);
}
build().catch(error => { console.error(error); process.exitCode = 1; });
