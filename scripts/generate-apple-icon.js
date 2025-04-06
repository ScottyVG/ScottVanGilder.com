const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');
const path = require('path');

// Create canvas
const size = 180;
const canvas = createCanvas(size, size);
const ctx = canvas.getContext('2d');

// Load the SVG
loadImage(path.join(__dirname, '../public/favicon.svg')).then(image => {
  // Draw the image
  ctx.drawImage(image, 0, 0, size, size);
  
  // Save as PNG
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(__dirname, '../public/apple-touch-icon.png'), buffer);
  
  console.log('Apple Touch Icon generated successfully!');
}).catch(err => {
  console.error('Error generating Apple Touch Icon:', err);
}); 