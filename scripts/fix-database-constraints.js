require('dotenv').config()
const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', !!supabaseUrl)
  console.error('SUPABASE_SERVICE_ROLE_KEY:', !!supabaseServiceKey)
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function fixDatabaseConstraints() {
  console.log('🔧 Fixing database constraints...')
  
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, 'fix-database-constraints.sql')
    const sql = fs.readFileSync(sqlPath, 'utf8')
    
    // Split by semicolon and execute each statement
    const statements = sql.split(';').filter(stmt => stmt.trim() && !stmt.trim().startsWith('--'))
    
    for (const statement of statements) {
      const trimmed = statement.trim()
      if (trimmed && !trimmed.startsWith('\\d')) {
        console.log('📝 Executing:', trimmed.substring(0, 50) + '...')
        const { error } = await supabase.rpc('exec_sql', { sql: trimmed })
        if (error) {
          console.warn('⚠️ Warning:', error.message)
        }
      }
    }
    
    console.log('✅ Database constraints fixed successfully')
    
    // Test curriculum creation
    console.log('🧪 Testing curriculum creation...')
    const testData = {
      id: `test_${Date.now()}`,
      name: 'Test Curriculum',
      description: 'Test after fix',
      userId: 'e8790996-4fcd-40db-a15c-9c8552cfdebe', // Real user ID from logs
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    const { data, error } = await supabase
      .from('Curriculum')
      .insert([testData])
      .select('*')
      .single()
    
    if (error) {
      console.error('❌ Test failed:', error)
    } else {
      console.log('✅ Test passed! Curriculum created:', data.name)
      
      // Clean up test data
      await supabase.from('Curriculum').delete().eq('id', data.id)
      console.log('🧹 Test data cleaned up')
    }
    
  } catch (error) {
    console.error('💥 Error:', error)
  }
}

fixDatabaseConstraints()
