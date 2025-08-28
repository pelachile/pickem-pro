#!/usr/bin/env node

// Markdown to JSON Conversion Script
// Converts existing player markdown files to structured JSON format

import { MarkdownToJsonConverter, JsonPlayerData } from '../utils/markdownToJson.js';
import fs from 'fs/promises';
import path from 'path';

async function convertMarkdownToJson() {
  console.log('🔄 Converting Player Markdown Files to JSON...\n');

  try {
    // Convert all positions
    const jsonData = await MarkdownToJsonConverter.convertAllPositions();
    
    if (jsonData.size === 0) {
      console.log('❌ No markdown files found to convert');
      return;
    }

    // Create output directory
    const outputDir = path.join(process.cwd(), 'public', 'data', 'playerData-json');
    await fs.mkdir(outputDir, { recursive: true });
    
    // Write JSON files
    let totalPlayers = 0;
    for (const [position, data] of jsonData.entries()) {
      const filePath = path.join(outputDir, `${position}.json`);
      await fs.writeFile(filePath, JSON.stringify(data, null, 2));
      
      console.log(`✅ ${data.positionFull}: ${data.players.length} players → ${position}.json`);
      totalPlayers += data.players.length;
    }

    // Create metadata file
    const metadata = {
      lastUpdated: new Date().toISOString(),
      season: 2025,
      totalPositions: jsonData.size,
      totalPlayers,
      positions: Array.from(jsonData.keys()),
      version: '1.0.0'
    };
    
    await fs.writeFile(
      path.join(outputDir, '_metadata.json'),
      JSON.stringify(metadata, null, 2)
    );

    // Create summary report
    console.log('\n📊 Conversion Summary:');
    console.log('=' .repeat(50));
    console.log(`   Total Positions: ${jsonData.size}`);
    console.log(`   Total Players: ${totalPlayers}`);
    console.log(`   Output Directory: ${outputDir}`);
    console.log('\n🎯 Files Created:');
    
    for (const [position, data] of jsonData.entries()) {
      console.log(`   • ${position}.json (${data.players.length} players)`);
    }
    console.log('   • _metadata.json (conversion metadata)');

    console.log('\n✅ Conversion completed successfully!');
    console.log('\n🚀 Next Steps:');
    console.log('   1. Review JSON files in public/data/playerData-json/');
    console.log('   2. Update React components to read JSON instead of markdown');
    console.log('   3. Set up S3 bucket for hosting JSON files');
    console.log('   4. Configure Lambda functions for AI content updates');

  } catch (error) {
    console.error('💥 Conversion failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure markdown files exist in public/data/playerData/');
    console.log('   2. Check file permissions in output directory');
    console.log('   3. Verify markdown file format is correct');
    
    process.exit(1);
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  convertMarkdownToJson()
    .then(() => {
      console.log('\n✨ Conversion script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Conversion script failed:', error);
      process.exit(1);
    });
}

export { convertMarkdownToJson };