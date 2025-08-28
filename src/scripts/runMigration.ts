#!/usr/bin/env node

// Migration Script Runner
// Run with: npm run migrate:data

import { DataMigrationService } from '../utils/dataMigration.js';
import { Amplify } from 'aws-amplify';
import amplifyConfig from '../../amplify_outputs.json';

// Configure Amplify
Amplify.configure(amplifyConfig);

async function runMigration() {
  console.log('🚀 Starting NFL Player Data Migration...\n');
  console.log('Converting markdown files to structured JSON in DynamoDB\n');
  
  try {
    // Check current migration status
    const progress = await DataMigrationService.getMigrationProgress();
    console.log(`📊 Current Status:`);
    console.log(`   Total Players: ${progress.totalPlayers}`);
    console.log(`   Migrated: ${progress.migratedPlayers}`);
    console.log(`   Pending Positions: ${progress.pendingPositions.join(', ') || 'None'}\n`);
    
    if (progress.pendingPositions.length === 0) {
      console.log('✅ Migration already completed!');
      return;
    }
    
    // Run migration for all positions
    console.log('🔄 Starting migration process...\n');
    const results = await DataMigrationService.migrateAllPositions();
    
    // Report results
    let totalProcessed = 0;
    let totalErrors = 0;
    let allSuccessful = true;
    
    console.log('📋 Migration Results:');
    console.log('=' .repeat(50));
    
    results.forEach((result, index) => {
      const positions = ['quarterbacks', 'running-backs', 'wide-receivers', 'tightends', 'defense-kickers'];
      const position = positions[index];
      
      const status = result.success ? '✅' : '❌';
      console.log(`${status} ${position.toUpperCase()}: ${result.playersProcessed} players`);
      
      if (result.errors.length > 0) {
        console.log('   Errors:');
        result.errors.forEach(error => {
          console.log(`     • ${error.player}: ${error.error}`);
        });
      }
      
      totalProcessed += result.playersProcessed;
      totalErrors += result.errors.length;
      if (!result.success) allSuccessful = false;
    });
    
    console.log('=' .repeat(50));
    console.log(`📊 Summary:`);
    console.log(`   Players Processed: ${totalProcessed}`);
    console.log(`   Errors: ${totalErrors}`);
    console.log(`   Overall Status: ${allSuccessful ? '✅ SUCCESS' : '⚠️ PARTIAL'}`);
    
    if (allSuccessful) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('   → Your player data is now available in DynamoDB');
      console.log('   → AI-enhanced content can now be generated');
      console.log('   → Ready for Phase 2: Team Navigation');
    } else {
      console.log('\n⚠️ Migration completed with errors');
      console.log('   → Review errors above and retry if needed');
      console.log('   → Partial data is available for testing');
    }
    
  } catch (error) {
    console.error('💥 Migration failed:', error);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Ensure Amplify sandbox is running: npm run amplify:sandbox');
    console.log('   2. Check amplify_outputs.json exists and is valid');
    console.log('   3. Verify network connectivity to AWS');
    console.log('   4. Check CloudWatch logs for detailed error information');
    
    process.exit(1);
  }
}

// Handle script execution
if (import.meta.url === `file://${process.argv[1]}`) {
  runMigration()
    .then(() => {
      console.log('\n✨ Migration script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Migration script failed:', error);
      process.exit(1);
    });
}

export { runMigration };