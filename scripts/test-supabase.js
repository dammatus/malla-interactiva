// Script de prueba para verificar la conexión con Supabase
// Para ejecutar: node scripts/test-supabase.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✅ Encontrada' : '❌ No encontrada')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✅ Encontrada' : '❌ No encontrada')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  try {
    console.log('🔄 Probando conexión con Supabase...')
    
    // Probar consulta simple
    const { data, error } = await supabase
      .from('Curriculum')
      .select('*')
      .limit(1)
    
    if (error) {
      console.error('❌ Error en la consulta:', error)
      return
    }
    
    console.log('✅ Conexión exitosa con Supabase')
    console.log('📊 Datos de prueba:', data)
    
    // Probar esquema de la tabla
    const { data: schemaData, error: schemaError } = await supabase
      .from('Curriculum')
      .select('*')
      .limit(0)
    
    if (schemaError) {
      console.error('❌ Error obteniendo esquema:', schemaError)
    } else {
      console.log('📋 Esquema de tabla Curriculum verificado')
    }
    
  } catch (err) {
    console.error('❌ Error de conexión:', err)
  }
}

testConnection()
