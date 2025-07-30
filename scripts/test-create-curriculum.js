// Script de prueba para crear currículos directamente
// Para ejecutar: node scripts/test-create-curriculum.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno de Supabase no encontradas')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testCreateCurriculum() {
  try {
    console.log('🧪 Probando creación de currículo...')
    
    // Crear un currículo de prueba con ID manual
    const uniqueId = `test_curriculum_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const now = new Date().toISOString()
    const testData = {
      id: uniqueId,
      name: 'Test Currículo ' + Date.now(),
      description: 'Currículo de prueba creado automáticamente',
      userId: 'test-user-id-' + Date.now(),
      createdAt: now,
      updatedAt: now
    }
    
    console.log('📝 Datos de prueba:', testData)
    
    const { data, error } = await supabase
      .from('Curriculum')
      .insert([testData])
      .select('*')
      .single()
    
    if (error) {
      console.error('❌ Error al crear currículo:', error)
      return
    }
    
    console.log('✅ Currículo creado exitosamente:', data)
    
    // Verificar que se creó correctamente
    const { data: verification, error: verifyError } = await supabase
      .from('Curriculum')
      .select('*')
      .eq('id', data.id)
      .single()
    
    if (verifyError) {
      console.error('❌ Error al verificar currículo:', verifyError)
      return
    }
    
    console.log('✅ Verificación exitosa:', verification)
    
    // Limpiar - eliminar el currículo de prueba
    const { error: deleteError } = await supabase
      .from('Curriculum')
      .delete()
      .eq('id', data.id)
    
    if (deleteError) {
      console.error('⚠️ Error al limpiar:', deleteError)
    } else {
      console.log('🧹 Currículo de prueba eliminado')
    }
    
  } catch (err) {
    console.error('💥 Error general:', err)
  }
}

testCreateCurriculum()
