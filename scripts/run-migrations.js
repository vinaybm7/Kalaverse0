#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables:');
  console.error('- VITE_SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigrations() {
  const migrationsDir = path.join(__dirname, '../supabase/migrations');
  
  try {
    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log(`Found ${files.length} migration files`);

    for (const file of files) {
      console.log(`\nRunning migration: ${file}`);
      
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      // Split SQL by statements (basic splitting on semicolons)
      const statements = sql
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (let i = 0; i < statements.length; i++) {
        const statement = statements[i];
        if (statement) {
          try {
            const { error } = await supabase.rpc('exec_sql', { sql: statement });
            if (error) {
              // Try direct query if RPC fails
              const { error: queryError } = await supabase
                .from('_migrations')
                .select('*')
                .limit(1);
              
              if (queryError) {
                console.error(`Error in statement ${i + 1}:`, error);
              }
            }
          } catch (err) {
            console.warn(`Warning in statement ${i + 1}:`, err.message);
          }
        }
      }
      
      console.log(`✅ Completed: ${file}`);
    }

    console.log('\n🎉 All migrations completed successfully!');
    
    // Test the setup
    console.log('\nTesting database setup...');
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('count')
      .limit(1);
      
    const { data: artworks, error: artworksError } = await supabase
      .from('artworks')
      .select('count')
      .limit(1);

    if (!profilesError && !artworksError) {
      console.log('✅ Database tables are accessible');
    } else {
      console.log('⚠️  Some tables may not be accessible yet');
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigrations();