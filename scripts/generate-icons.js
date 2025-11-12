#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [192, 512];
const inputFile = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  console.log('🎨 Generating PWA icons...\n');

  // Check if input SVG exists
  if (!fs.existsSync(inputFile)) {
    console.error('❌ Error: icon.svg not found in public directory');
    process.exit(1);
  }

  try {
    // Generate icons for each size
    for (const size of sizes) {
      const outputFile = path.join(outputDir, `icon-${size}x${size}.png`);
      
      await sharp(inputFile)
        .resize(size, size)
        .png()
        .toFile(outputFile);
      
      console.log(`✅ Generated ${size}x${size} icon`);
    }

    console.log('\n🎉 All icons generated successfully!');
    console.log('\nGenerated files:');
    sizes.forEach(size => {
      console.log(`  - public/icon-${size}x${size}.png`);
    });
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
    process.exit(1);
  }
}

generateIcons();
