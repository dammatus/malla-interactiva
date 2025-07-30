# 🎓 Malla Curricular Interactiva

Una aplicación web moderna y visual para gestionar tu progreso universitario, visualizar correlativas de forma intuitiva y planificar tu carrera académica.

![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Características

- **🎯 Seguimiento Visual**: Marca materias como aprobadas con un clic
- **🔗 Sistema de Correlativas**: Descubre automáticamente qué materias se desbloquean
- **📊 Progreso en Tiempo Real**: Visualiza tu avance académico instantáneamente
- **📅 Organización por Años**: Estructura clara de tu carrera universitaria
- **🔐 Autenticación Segura**: Datos protegidos con Supabase Auth
- **📱 Responsive**: Funciona perfectamente en todos los dispositivos

## 🚀 Demo

[Ver Demo en Vivo](https://malla-curricular.vercel.app) *(próximamente)*

## 🖼️ Capturas de Pantalla

### Página Principal
- Visualización interactiva de la malla curricular
- Sistema de colores intuitivo (verde = aprobada, azul = disponible, gris = bloqueada)
- Estadísticas de progreso por año

### Estados de Materias
- 🟢 **Verde**: Materia aprobada
- 🔵 **Azul**: Disponible para cursar
- ⚪ **Gris**: Bloqueada por correlativas

## 🛠️ Tecnologías

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **UI Components**: Radix UI + shadcn/ui
- **Iconos**: Lucide React
- **Deploy**: Vercel

## 📦 Instalación

1. **Clona el repositorio**
```bash
git clone https://github.com/tu-usuario/malla-interactiva.git
cd malla-interactiva
```

2. **Instala las dependencias**
```bash
npm install
```

3. **Configura las variables de entorno**
```bash
cp .env.example .env.local
```

Completa el archivo `.env.local` con tus credenciales de Supabase:
```env
# Database
DATABASE_URL="tu-connection-string-de-supabase"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secret-aleatorio"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://tu-proyecto.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="tu-anon-key"
SUPABASE_SERVICE_ROLE_KEY="tu-service-role-key"
```

4. **Configura la base de datos**
```bash
# Ejecuta el script SQL en el SQL Editor de Supabase
# El archivo está en: scripts/create-tables.sql
```

5. **Inicia el servidor de desarrollo**
```bash
npm run dev
```

## 🗄️ Estructura de la Base de Datos

```sql
-- Tablas principales
- curriculums (planes de estudio)
- years (años académicos)
- subjects (materias/asignaturas)
- prerequisites (correlativas)

-- Características
- Row Level Security (RLS) habilitado
- Políticas de seguridad por usuario
- Triggers para actualización automática de fechas
```

## 🎯 Cómo Usar

1. **Registro/Inicio de Sesión**: Crea una cuenta o inicia sesión
2. **Explora tu Malla**: Visualiza todas las materias organizadas por años
3. **Marca Materias**: Haz clic en materias disponibles (azules) para aprobarlas
4. **Observa Desbloqueos**: Ve cómo se habilitan nuevas materias automáticamente
5. **Planifica**: Usa la información visual para planificar próximos cuatrimestres

## 🚀 Deploy en Vercel

1. **Fork este repositorio**

2. **Conecta con Vercel**
   - Ve a [vercel.com](https://vercel.com)
   - Conecta tu repositorio de GitHub
   - Configura las variables de entorno

3. **Variables de entorno en Vercel**
   ```
   DATABASE_URL
   NEXTAUTH_URL
   NEXTAUTH_SECRET
   NEXT_PUBLIC_SUPABASE_URL
   NEXT_PUBLIC_SUPABASE_ANON_KEY
   SUPABASE_SERVICE_ROLE_KEY
   ```

4. **Deploy automático**
   - Vercel deployará automáticamente en cada push a main

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-caracteristica`)
3. Commit tus cambios (`git commit -m 'Agrega nueva característica'`)
4. Push a la rama (`git push origin feature/nueva-caracteristica`)
5. Abre un Pull Request

## 📝 Roadmap

- [ ] 📊 Dashboard con estadísticas avanzadas
- [ ] 📱 App móvil con React Native
- [ ] 🔔 Notificaciones de materias disponibles
- [ ] 📈 Reportes de progreso académico
- [ ] 👥 Compartir mallas con otros estudiantes
- [ ] 🎨 Temas personalizables
- [ ] 📤 Exportar malla a PDF

## 🐛 Reportar Bugs

Si encuentras algún bug, por favor [abre un issue](https://github.com/tu-usuario/malla-interactiva/issues) con:
- Descripción del problema
- Pasos para reproducirlo
- Screenshots si es necesario
- Información del navegador/dispositivo

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo [LICENSE](LICENSE) para más detalles.

## 👨‍💻 Autor

**Tu Nombre** - [@tu-usuario](https://github.com/tu-usuario)

## 🙏 Agradecimientos

- [Next.js](https://nextjs.org/) por el framework
- [Supabase](https://supabase.com/) por la infraestructura backend
- [Tailwind CSS](https://tailwindcss.com/) por los estilos
- [Radix UI](https://www.radix-ui.com/) por los componentes base
- [Lucide](https://lucide.dev/) por los iconos

---

⭐ ¡Dale una estrella si este proyecto te fue útil!
