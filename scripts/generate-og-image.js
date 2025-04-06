const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create canvas
const width = 1200;
const height = 630;
const canvas = createCanvas(width, height);
const ctx = canvas.getContext('2d');

// Fill background with a dark theme
ctx.fillStyle = '#0f172a'; // Dark blue background
ctx.fillRect(0, 0, width, height);

// Add a subtle grid pattern
ctx.strokeStyle = 'rgba(100, 116, 139, 0.1)';
ctx.lineWidth = 1;

// Draw horizontal grid lines
for (let y = 0; y < height; y += 20) {
  ctx.beginPath();
  ctx.moveTo(0, y);
  ctx.lineTo(width, y);
  ctx.stroke();
}

// Draw vertical grid lines
for (let x = 0; x < width; x += 20) {
  ctx.beginPath();
  ctx.moveTo(x, 0);
  ctx.lineTo(x, height);
  ctx.stroke();
}

// Add a terminal-like window
const terminalWidth = 800;
const terminalHeight = 300;
const terminalX = (width - terminalWidth) / 2;
const terminalY = 100;

// Terminal background
ctx.fillStyle = '#1e293b';
ctx.fillRect(terminalX, terminalY, terminalWidth, terminalHeight);

// Terminal header
ctx.fillStyle = '#334155';
ctx.fillRect(terminalX, terminalY, terminalWidth, 30);

// Terminal buttons
ctx.fillStyle = '#ef4444'; // Red
ctx.beginPath();
ctx.arc(terminalX + 15, terminalY + 15, 6, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#f59e0b'; // Yellow
ctx.beginPath();
ctx.arc(terminalX + 35, terminalY + 15, 6, 0, Math.PI * 2);
ctx.fill();

ctx.fillStyle = '#10b981'; // Green
ctx.beginPath();
ctx.arc(terminalX + 55, terminalY + 15, 6, 0, Math.PI * 2);
ctx.fill();

// Terminal content
ctx.font = '16px monospace';
ctx.fillStyle = '#e2e8f0';
ctx.textAlign = 'left';

// Terminal prompt
const promptText = '$ ';
ctx.fillText(promptText, terminalX + 20, terminalY + 60);

// Terminal commands
const commands = [
  'git clone https://github.com/scottyvg/portfolio.git',
  'cd portfolio',
  'npm install',
  'npm run dev',
  '> Server running on http://localhost:3000',
  '> Building cloud infrastructure...',
  '> Deploying to AWS...',
  '> Infrastructure as Code: ✓',
  '> CI/CD Pipeline: ✓',
  '> Monitoring & Logging: ✓',
  '> Security Best Practices: ✓',
  '> DevOps Engineer: Scott Van Gilder'
];

let yOffset = terminalY + 60;
commands.forEach((cmd, index) => {
  if (index === 0) {
    // First command with prompt
    ctx.fillText(cmd, terminalX + 40, yOffset);
  } else if (index === 4 || index === 5 || index === 6 || index === 7 || index === 8 || index === 9) {
    // Output lines
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(cmd, terminalX + 20, yOffset);
  } else {
    // Other commands with prompt
    yOffset += 30;
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText(promptText, terminalX + 20, yOffset);
    ctx.fillText(cmd, terminalX + 40, yOffset);
  }
  yOffset += 30;
});

// Add name and title at the bottom
ctx.font = 'bold 48px Arial';
ctx.fillStyle = '#f8fafc';
ctx.textAlign = 'center';
ctx.fillText('Scott Van Gilder', width / 2, height - 80);

ctx.font = '24px Arial';
ctx.fillStyle = '#94a3b8';
ctx.fillText('DevOps Engineer at AWS', width / 2, height - 40);

// Save the image
const buffer = canvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(__dirname, '../public/images/og-image.jpg'), buffer);

console.log('Open Graph image generated successfully!'); 