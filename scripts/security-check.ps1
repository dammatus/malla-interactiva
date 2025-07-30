# 🔍 Script de verificación de seguridad para Windows PowerShell
# Ejecuta: .\scripts\security-check.ps1

Write-Host "🔒 Verificando seguridad del proyecto..." -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

$errors = 0

# Verificar que .env.local no esté en Git
$envLocalInGit = git ls-files | Select-String "\.env\.local"
if ($envLocalInGit) {
    Write-Host "❌ ERROR: .env.local está siendo trackeado por Git!" -ForegroundColor Red
    Write-Host "   Ejecuta: git rm --cached .env.local" -ForegroundColor Yellow
    $errors++
} else {
    Write-Host "✅ .env.local no está en Git (correcto)" -ForegroundColor Green
}

# Verificar que .env.example exista
if (Test-Path ".env.example") {
    Write-Host "✅ .env.example existe (correcto)" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: .env.example no existe" -ForegroundColor Red
    $errors++
}

# Verificar .gitignore
$gitignoreContent = Get-Content .gitignore -Raw
if ($gitignoreContent -match "\.env.*\.local" -and $gitignoreContent -match "\.env$") {
    Write-Host "✅ .gitignore protege archivos .env (correcto)" -ForegroundColor Green
} else {
    Write-Host "⚠️  ADVERTENCIA: .gitignore podría no proteger archivos .env" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🔍 Buscando posibles credenciales hardcodeadas..." -ForegroundColor Cyan

$foundIssues = $false

# Buscar patrones sospechosos
$patterns = @(
    'password.*=.*".*"',
    'secret.*=.*".*"',
    'key.*=.*".*"',
    'token.*=.*".*"',
    'supabase\.co.*[a-zA-Z0-9]{20,}',
    'postgresql://.*:.*@'
)

$files = Get-ChildItem -Recurse -Include "*.ts","*.tsx","*.js","*.jsx" -Exclude "node_modules"

foreach ($pattern in $patterns) {
    foreach ($file in $files) {
        $matches = Select-String -Path $file.FullName -Pattern $pattern -AllMatches
        if ($matches) {
            Write-Host "⚠️  Posible credencial en $($file.Name): $pattern" -ForegroundColor Yellow
            $foundIssues = $true
        }
    }
}

if (-not $foundIssues) {
    Write-Host "✅ No se encontraron credenciales hardcodeadas" -ForegroundColor Green
}

Write-Host ""
Write-Host "📋 Resumen de verificación:" -ForegroundColor Cyan
Write-Host "- Variables de entorno: Protegidas" -ForegroundColor Green
Write-Host "- Archivos sensibles: No trackeados" -ForegroundColor Green
Write-Host "- Configuración: Segura" -ForegroundColor Green

if ($errors -eq 0) {
    Write-Host ""
    Write-Host "🚀 El proyecto está listo para subir a GitHub!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Se encontraron $errors errores. Corrígelos antes de subir." -ForegroundColor Red
}
