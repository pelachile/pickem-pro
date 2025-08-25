#!/usr/bin/env node

/**
 * Hero Image Optimization Script
 * 
 * This script helps optimize the hero background image for better web performance.
 * Currently the hero-background.jpeg is 5MB and 5824x3264 resolution which is overkill for web use.
 * 
 * Recommendations:
 * 1. Resize to 1920x1080 for desktop (1080p is sufficient for hero backgrounds)
 * 2. Create responsive versions: 768px, 1200px, 1920px widths
 * 3. Convert to WebP format with JPEG fallbacks
 * 4. Compress to reduce file size to ~300-500KB total
 * 
 * Tools you can use:
 * - Online: TinyPNG, Squoosh.app, or Cloudinary
 * - CLI: imagemagick, sharp-cli, or cwebp
 * - Build tools: @vitejs/plugin-legacy with image optimization
 */

const fs = require('fs');
const path = require('path');

function checkImageExists() {
  const imagePath = path.join(__dirname, '../public/images/hero-background.jpeg');
  
  if (!fs.existsSync(imagePath)) {
    console.log('❌ Hero image not found at:', imagePath);
    return false;
  }
  
  const stats = fs.statSync(imagePath);
  const fileSizeInMB = stats.size / (1024 * 1024);
  
  console.log('📊 Current hero image stats:');
  console.log(`   File size: ${fileSizeInMB.toFixed(2)} MB`);
  console.log(`   Path: ${imagePath}`);
  
  if (fileSizeInMB > 1) {
    console.log('');
    console.log('⚠️  Image is quite large for web use. Consider optimizing:');
    console.log('');
    console.log('🎯 Optimization goals:');
    console.log('   • Reduce file size to ~300-500KB');
    console.log('   • Resize to 1920x1080 (desktop) + responsive sizes');
    console.log('   • Convert to WebP with JPEG fallback');
    console.log('   • Maintain image quality at 80-85%');
    console.log('');
    console.log('🛠️  Quick optimization options:');
    console.log('   1. Online: https://squoosh.app (Google\'s image optimizer)');
    console.log('   2. Online: https://tinypng.com (easy drag & drop)');
    console.log('   3. CLI: npm install -g sharp-cli && sharp resize 1920 1080 input.jpg output.jpg');
    console.log('');
    console.log('💡 Pro tip: The current 5824x3264 image is perfect quality but');
    console.log('   overkill for web. Even a 1920x1080 version will look great');
    console.log('   as a hero background and load much faster!');
  } else {
    console.log('✅ Image size looks good for web use!');
  }
  
  return true;
}

function suggestWebPConversion() {
  console.log('');
  console.log('🚀 Performance Enhancement: WebP Format');
  console.log('   • WebP images are 25-35% smaller than JPEG');
  console.log('   • Excellent browser support (95%+)');
  console.log('   • Our component already supports fallbacks');
  console.log('');
  console.log('📝 To create WebP version:');
  console.log('   npx @squoosh/cli --webp auto hero-background.jpeg');
  console.log('   or use https://squoosh.app online');
}

function checkViteConfig() {
  const configPath = path.join(__dirname, '../vite.config.ts');
  
  if (fs.existsSync(configPath)) {
    const config = fs.readFileSync(configPath, 'utf8');
    
    if (!config.includes('vite-imagetools') && !config.includes('vite-plugin-imagemin')) {
      console.log('');
      console.log('🔧 Build-time optimization suggestion:');
      console.log('   Consider adding vite-plugin-imagemin for automatic optimization:');
      console.log('   npm install --save-dev vite-plugin-imagemin');
    }
  }
}

// Run the optimization check
console.log('🖼️  Hero Image Optimization Analysis');
console.log('=====================================');

if (checkImageExists()) {
  suggestWebPConversion();
  checkViteConfig();
  
  console.log('');
  console.log('✨ Your hero image perfectly captures the social celebration vibe!');
  console.log('   Friends toasting at a stadium = exactly the right energy for Pick\'em Pro');
}