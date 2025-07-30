# 🚀 GUÍA DE DESPLIEGUE SEGURO EN VERCEL

## 1. Variables de Entorno en Vercel

Cuando despliegues en Vercel, debes configurar estas variables en:
**Project Settings → Environment Variables**

```bash
# Variables necesarias para Vercel:
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-ID].supabase.co:5432/postgres"
NEXTAUTH_URL="https://tu-app.vercel.app"
NEXTAUTH_SECRET="[GENERA-UN-NUEVO-SECRET-PARA-PRODUCCION]"
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-ID].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[TU-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[TU-SERVICE-ROLE-KEY]"
```

## 2. Generar NEXTAUTH_SECRET para producción:

```bash
# Opción 1: OpenSSL (recomendado)
openssl rand -base64 32

# Opción 2: Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"

# Opción 3: Online (solo si confías en el sitio)
# https://generate-secret.vercel.app/32
```

## 3. Configuración de dominios en Supabase:

Ve a tu proyecto de Supabase → **Authentication** → **URL Configuration**

Agrega estos dominios autorizados:
- https://tu-app.vercel.app
- https://tu-app-git-main-tu-usuario.vercel.app
- https://tu-app-tu-usuario.vercel.app

## 4. Verificación de seguridad antes del deploy:

✅ `.env.local` está en `.gitignore`
✅ No hay credenciales hardcodeadas en el código
✅ Solo `.env.example` se sube al repo
✅ Variables sensibles se configuran en Vercel
✅ URLs de callback actualizadas en Supabase

## 5. Para colaboradores del proyecto:

1. Clonen el repo
2. Copien `.env.example` como `.env.local`
3. Configuren sus propias credenciales
4. Nunca commiteen `.env.local`

## 6. Rotación de secretos (buena práctica):

- Cambia NEXTAUTH_SECRET cada 6 meses
- Regenera API keys si hay sospecha de compromiso
- Usa diferentes credenciales para dev/staging/prod
