# ESAB Rosetta - Claims Management System (React)

Una aplicación moderna de gestión de reclamaciones construida con **React 18** + **Vite** + **Chart.js**.

## 🚀 Características

- ✅ Autenticación de usuario
- ✅ Dashboard con KPIs y gráficos interactivos (Chart.js)
- ✅ Tabla de reclamaciones con filtrado
- ✅ Detalle de reclamaciones con 7 pestañas
- ✅ Diseño responsivo y moderno
- ✅ Interfaz en español

## 📁 Estructura del Proyecto

```
esab-rosetta-react/
├── src/
│   ├── components/
│   │   ├── Navigation.jsx       # Barra de navegación
│   │   ├── KPICard.jsx          # Tarjetas de KPI
│   │   └── ChartComponent.jsx   # Componentes Chart.js
│   ├── pages/
│   │   ├── LoginPage.jsx        # Página de login
│   │   ├── DashboardPage.jsx    # Dashboard principal
│   │   ├── ClaimsPage.jsx       # Tabla de reclamaciones
│   │   └── ClaimDetailsPage.jsx # Detalles de reclamación
│   ├── data/
│   │   └── mockData.js          # Datos mock
│   ├── App.jsx                  # Componente principal
│   └── main.jsx                 # Punto de entrada
├── index.html
├── package.json
├── vite.config.js
└── .gitignore
```

## 🛠️ Instalación

### Paso 1: Instalar dependencias
```bash
npm install
```

### Paso 2: Ejecutar en desarrollo
```bash
npm run dev
```

La app se abrirá en `http://localhost:3000`

### Paso 3: Build para producción
```bash
npm run build
```

## 🔐 Credenciales de Demo

- Email: `support@esabrosetta.com`
- Password: `demo`

## 📦 Dependencias

- **React 18.2.0** - UI Framework
- **Vite 5.0.8** - Build tool
- **Chart.js 3.9.1** - Visualización de datos
- **react-chartjs-2 5.2.0** - Integración Chart.js con React

## 🎨 Diseño

- Colores primarios: `#6366f1` (Indigo), `#764ba2` (Purple)
- Diseño responsive: Mobile, Tablet, Desktop
- Glassmorphism y gradientes modernos

## 📊 Funcionalidades por Página

### Login
- Formulario de autenticación simple
- Diseño con gradiente

### Dashboard
- 4 tarjetas KPI con métricas
- Gráfico de línea: Claims over time
- Gráfico de barras: Claims by status
- Gráfico de dona: Distribution by type
- Distribución regional

### Claims Table
- Tabla de reclamaciones paginada
- Filtrado por estado (Open/Closed/All)
- Acceso a detalles de cada reclamación

### Claim Details
- 7 pestañas:
  1. Detalles - Información general
  2. Análisis - Análisis de la reclamación
  3. Acción Correctiva - Medidas a tomar
  4. Notificación - Comunicación al cliente
  5. Tareas - Tareas asignadas
  6. Fechas - Historial temporal
  7. Comentarios - Notas y comentarios

## 🚢 Deployment en Vercel

1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa el repositorio
4. Selecciona el framework: Next.js o React
5. Deploy automático

### Configuración para Vercel
```bash
# vercel.json (crear en raíz)
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

## 📱 Responsive Design

- **Desktop** (1024px+): Grid 4 columnas para KPIs, 2 columnas para gráficos
- **Tablet** (768px-1023px): Grid 2 columnas para KPIs
- **Mobile** (<768px): Grid 1 columna, navegación simplificada

## 🔄 Próximas Mejoras

- [ ] Integración con API real
- [ ] Autenticación OAuth
- [ ] Búsqueda avanzada en tabla
- [ ] Exportar a PDF
- [ ] Notificaciones en tiempo real
- [ ] Dark mode
- [ ] Multiidioma

## 👨‍💼 Autor

Edgar Rodriguez - ESAB Claims Management Team

## 📄 Licencia

MIT
