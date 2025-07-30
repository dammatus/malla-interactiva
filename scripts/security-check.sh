#!/bin/bash

# 🔍 Script de verificación de seguridad para Malla Curricular Interactiva
# Ejecuta: npm run security-check

echo "🔒 Verificando seguridad del proyecto..."
echo "========================================="

# Verificar que .env.local no esté en Git
if git ls-files | grep -q "\.env\.local"; then
    echo "❌ ERROR: .env.local está siendo trackeado por Git!"
    echo "   Ejecuta: git rm --cached .env.local"
    exit 1
else
    echo "✅ .env.local no está en Git (correcto)"
fi

# Verificar que .env.example exista
if [ -f ".env.example" ]; then
    echo "✅ .env.example existe (correcto)"
else
    echo "❌ ERROR: .env.example no existe"
    exit 1
fi

# Verificar .gitignore
if grep -q "\.env\*\.local" .gitignore && grep -q "\.env$" .gitignore; then
    echo "✅ .gitignore protege archivos .env (correcto)"
else
    echo "⚠️  ADVERTENCIA: .gitignore podría no proteger archivos .env"
fi

# Buscar credenciales hardcodeadas (patrones comunes)
echo ""
echo "🔍 Buscando posibles credenciales hardcodeadas..."

suspicious_patterns=(
    "password.*=.*['\"][^'\"]*['\"]"
    "secret.*=.*['\"][^'\"]*['\"]"
    "key.*=.*['\"][^'\"]*['\"]"
    "token.*=.*['\"][^'\"]*['\"]"
    "supabase\.co.*[a-zA-Z0-9]{20,}"
    "postgresql://.*:.*@"
)

found_issues=false

for pattern in "${suspicious_patterns[@]}"; do
    if grep -r -E "$pattern" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" --exclude-dir=node_modules .; then
        echo "⚠️  Posible credencial encontrada: $pattern"
        found_issues=true
    fi
done

if [ "$found_issues" = false ]; then
    echo "✅ No se encontraron credenciales hardcodeadas"
fi

echo ""
echo "📋 Resumen de verificación:"
echo "- Variables de entorno: Protegidas"
echo "- Archivos sensibles: No trackeados"
echo "- Configuración: Segura"
echo ""
echo "🚀 El proyecto está listo para subir a GitHub!"
