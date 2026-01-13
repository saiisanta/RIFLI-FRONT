# RIFLI Frontend

## Plataforma E-Commerce y Gestión de Presupuestos Profesionales

[![React](https://img.shields.io/badge/React-18.2+-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.0+-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Vitest](https://img.shields.io/badge/Vitest-2.1+-729B1B?style=for-the-badge&logo=vitest&logoColor=white)](https://vitest.dev/)
[![Axios](https://img.shields.io/badge/Axios-1.8+-5A29E4?style=for-the-badge&logo=axios&logoColor=white)](https://axios-http.com/)
[![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white)](https://sass-lang.com/)

**Sistema moderno de comercio electrónico especializado en servicios profesionales de electricidad, gas y seguridad**

[Documentación](#documentación) •
[Características](#características-principales) •
[Instalación](#inicio-rápido) •
[Arquitectura](#arquitectura) •
[Testing](#testing)

---

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Arquitectura](#arquitectura)
- [Autenticación y Seguridad](#autenticación-y-seguridad)
- [Inicio Rápido](#inicio-rápido)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Tecnologías](#tecnologías)
- [Testing](#testing)
- [UI/UX](#uiux)
- [Documentación](#documentación)
- [Build y Deploy](#build-y-deploy)
- [Contribución](#contribución)

---

## Características Principales

### Sistema de Autenticación Robusto
- Autenticación basada en cookies HttpOnly (protección XSS)
- Login/Register/Password Recovery con validación en tiempo real
- Modal de login para acceso rápido sin interrumpir navegación
- Páginas dedicadas de autenticación con diseño moderno
- Refresh token automático
- Rutas protegidas con control de roles (customer/admin)

### E-Commerce Completo
- Catálogo de productos con filtros avanzados
- Carrito de compras persistente
- Sistema de órdenes con seguimiento
- Integración con pasarelas de pago (MercadoPago/Stripe)
- Gestión de direcciones de envío

### Sistema de Presupuestos
- Solicitud de presupuestos para servicios profesionales
- Formularios dinámicos según tipo de servicio
- Sistema de mensajería entre cliente y proveedor
- Estados de presupuesto (pendiente, en revisión, aceptado, rechazado)
- Notificaciones en tiempo real

### Dashboard Adaptativo
- Dashboard personalizado según rol de usuario
- Vista de cliente: estadísticas personales, órdenes recientes, presupuestos
- Vista de admin: métricas del negocio, gestión completa
- Diseño modular con composición de componentes
- Glassmorphism UI con animaciones suaves

### Panel de Administración
- Gestión completa de productos (CRUD)
- Administración de usuarios y roles
- Sistema de cotizaciones y servicios
- Panel de analíticas y estadísticas
- Vista modular con sidebar navegable
- Diseño responsive y profesional

### Experiencia de Usuario Premium
- Diseño responsive mobile-first
- Animaciones suaves con respeto a `prefers-reduced-motion`
- Tipografía fluida con `clamp()`
- Efectos hover modernos (glassmorphism, neumorphism)
- Lazy loading de imágenes
- Optimización de performance

---

## Arquitectura

### Patrón de Diseño: Feature-Based Architecture
```
┌─────────────────────────────────────────────────────────┐
│                      PRESENTATION                        │
│  (React Components - UI/UX - Pages/Components)          │
├─────────────────────────────────────────────────────────┤
│                    BUSINESS LOGIC                        │
│  (Custom Hooks - State Management - Context API)        │
├─────────────────────────────────────────────────────────┤
│                     DATA ACCESS                          │
│  (Services Layer - Axios - API Communication)           │
├─────────────────────────────────────────────────────────┤
│                        UTILS                             │
│  (Helpers - Formatters - Constants - Validators)        │
└─────────────────────────────────────────────────────────┘
```

### Principios Aplicados

- **Separation of Concerns**: Cada capa tiene una responsabilidad única
- **Single Responsibility Principle**: Componentes pequeños y enfocados
- **DRY (Don't Repeat Yourself)**: Lógica reutilizable en hooks y utils
- **Composition over Inheritance**: Páginas compuestas de componentes
- **Container/Presentational Pattern**: Separación de lógica y UI
- **Custom Hooks Pattern**: Encapsulación de lógica reutilizable

---

## Autenticación y Seguridad

### Cookies HttpOnly

El sistema utiliza **cookies HttpOnly** para máxima seguridad:

#### Configuración Backend Requerida
```javascript
// Express.js + Cookie-Parser
import cookieParser from 'cookie-parser';
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true // CRÍTICO
}));

app.use(cookieParser());

// Login endpoint
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Validar credenciales...
  const user = await User.findOne({ email });
  const token = generateJWT(user);
  
  res.cookie('token', token, {
    httpOnly: true,      // No accesible desde JavaScript (XSS protection)
    secure: true,        // Solo HTTPS en producción
    sameSite: 'strict',  // Protección CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 días
  });
  
  res.json({ user: sanitizeUser(user) });
});

// Middleware de autenticación
app.use('/api/protected', (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
});
```

#### Configuración Frontend
```javascript
// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VITE_API_URL,
  withCredentials: true // Envía cookies automáticamente
});

// Interceptor para auto-refresh
api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      await api.post('/auth/refresh');
      return api(error.config);
    }
    return Promise.reject(error);
  }
);
```

### Protecciones Implementadas

| Amenaza | Protección | Implementación |
|---------|------------|----------------|
| **XSS** | HttpOnly cookies | `httpOnly: true` |
| **CSRF** | SameSite cookies | `sameSite: 'strict'` |
| **MITM** | HTTPS only | `secure: true` (producción) |
| **Session Hijacking** | Short-lived tokens | Refresh token cada 15 min |
| **Token exposure** | No localStorage | Cookies exclusivamente |

---

## Inicio Rápido

### Prerrequisitos

- **Node.js**: v18.0.0 o superior
- **npm**: v9.0.0 o superior (o yarn/pnpm)
- **Backend**: Servidor API corriendo (ver requisitos de cookies)

### Instalación
```bash
# 1. Clonar repositorio
git clone https://github.com/tu-usuario/rifli-frontend.git
cd rifli-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus configuraciones

# 4. Iniciar servidor de desarrollo
npm run dev

# La aplicación estará disponible en http://localhost:5173
```

### Variables de Entorno
```env
# .env.example

# API Backend
VITE_API_URL=http://localhost:4001/api

# Configuración de App
VITE_APP_NAME=RIFLI
VITE_APP_URL=http://localhost:5173

# Producción
# VITE_API_URL=https://api.tudominio.com/api
```

---

## Estructura del Proyecto
```
frontend/
├── public/                          # Archivos estáticos
│   └── logo.png
│
├── src/
│   ├── assets/                      # Recursos multimedia
│   │   └── images/
│   │
│   ├── components/                  # Componentes reutilizables
│   │   └── PrivateRoute/           # HOC rutas protegidas
│   │       ├── PrivateRoute.jsx
│   │       └── __tests__/
│   │
│   ├── context/                     # React Context (estado global)
│   │   ├── AuthContext.jsx         # Autenticación
│   │   └── __tests__/
│   │       └── AuthContext.test.jsx
│   │
│   ├── hooks/                       # Custom Hooks
│   │   ├── useAuth.js              # Hook de autenticación
│   │   ├── useProducts.js          # Hook de productos
│   │   ├── useProductsSimple.js    # Hook simplificado productos
│   │   ├── useProfile.js           # Hook de perfil
│   │   └── __tests__/              # Tests de hooks
│   │       ├── useAuth.test.js
│   │       ├── useProducts.test.js
│   │       ├── useProductsSimple.test.js
│   │       └── useProfile.test.js
│   │
│   ├── pages/                       # Páginas principales
│   │   ├── home/                   # Landing page
│   │   │   ├── Home.jsx
│   │   │   └── components/
│   │   │
│   │   ├── dashboard/              # Dashboard usuario
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Dashboard.scss
│   │   │   └── components/
│   │   │       ├── DashboardCard/
│   │   │       └── DashboardHeader/
│   │   │
│   │   ├── auth/                   # Páginas de autenticación
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── auth.scss
│   │   │
│   │   ├── shop/                   # Tienda
│   │   │   ├── Shop.jsx
│   │   │   ├── Shop.scss
│   │   │   └── components/
│   │   │       ├── ShopHeader/
│   │   │       └── CartPage/
│   │   │
│   │   ├── profile/                # Perfil usuario
│   │   │   ├── Profile.jsx
│   │   │   ├── Profile.scss
│   │   │   └── components/
│   │   │       ├── ProfileNavbar/
│   │   │       ├── ProfileHeader/
│   │   │       ├── ProfileInfo/
│   │   │       ├── ProfileEditModal/
│   │   │       ├── ChangePasswordModal/
│   │   │       └── DeleteAccountModal/
│   │   │
│   │   └── admin/                  # Panel admin
│   │       ├── AdminPanel.jsx
│   │       ├── AdminPanel.scss
│   │       ├── components/
│   │       │   ├── AdminSidebar/
│   │       │   └── Pagination/
│   │       └── sections/
│   │           ├── ProductManager/
│   │           ├── UserManager/
│   │           ├── ServiceManager/
│   │           ├── OrderManager/
│   │           ├── QuoteManager/
│   │           └── Stats/
│   │
│   ├── services/                    # Capa de API (Axios)
│   │   ├── api.js                  # Configuración base Axios
│   │   ├── authService.js          # Endpoints de auth
│   │   ├── userService.js          # Endpoints de usuarios
│   │   ├── productService.js       # Endpoints de productos
│   │   └── __tests__/              # Tests de services
│   │       ├── authService.test.js
│   │       ├── productService.test.js
│   │       └── userService.test.js
│   │
│   ├── styles/                      # Estilos globales
│   │   ├── global.css              # Estilos base
│   │   ├── variables.scss          # Variables SCSS
│   │   └── breakpoints.scss        # Breakpoints responsive
│   │
│   ├── test/                        # Configuración de testing
│   │   ├── setup.js                # Setup de Vitest
│   │   ├── mocks/                  # Mocks globales
│   │   │   ├── handlers.js         # MSW handlers
│   │   │   ├── server.js           # MSW server
│   │   │   └── data/               # Mock data
│   │   │       ├── products.js
│   │   │       ├── users.js
│   │   │       └── auth.js
│   │   └── utils/                  # Utilidades de testing
│   │       ├── test-utils.jsx      # Custom render
│   │       └── helpers.js          # Helpers
│   │
│   ├── utils/                       # Utilidades
│   │   ├── constants.js            # Constantes de la app
│   │   ├── formatters.js           # Formateo de datos
│   │   ├── validators.js           # Validaciones
│   │   └── __tests__/              # Tests de utils
│   │       ├── formatters.test.js
│   │       └── validators.test.js
│   │
│   ├── App.jsx                      # Componente raíz
│   ├── App.scss                     # Estilos del App
│   └── main.jsx                     # Entry point
│
├── .env                             # Variables de entorno (gitignored)
├── .env.example                     # Ejemplo de variables
├── .gitignore                       # Archivos ignorados
├── .eslintrc.cjs                    # Configuración ESLint
├── package.json                     # Dependencias
├── vite.config.js                   # Configuración Vite + Vitest
├── README.md                        # Este archivo
└── index.html                       # HTML base
```

---

## Tecnologías

### Core

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **React** | 19.0+ | UI Library |
| **React Router DOM** | 7.5+ | Routing |
| **Axios** | 1.8+ | HTTP Client |
| **Vite** | 6.2+ | Build Tool |

### Styling

| Tecnología | Propósito |
|------------|-----------|
| **SCSS** | Preprocesador CSS |
| **CSS Modules** | CSS con scope local |
| **CSS Variables** | Theming dinámico |
| **Bootstrap** | Framework CSS |

### Testing

| Tecnología | Versión | Propósito |
|------------|---------|-----------|
| **Vitest** | 2.1+ | Test Runner |
| **@testing-library/react** | 16.1+ | Testing de componentes |
| **@testing-library/jest-dom** | 6.6+ | Matchers DOM |
| **@testing-library/user-event** | 14.5+ | Interacciones de usuario |
| **happy-dom** | 25.0+ | Entorno DOM ligero |

### Utils

| Librería | Propósito |
|----------|-----------|
| **React Icons** | Iconos |
| **React Bootstrap Icons** | Iconos adicionales |
| **Concurrently** | Ejecutar scripts en paralelo |

### Development

| Herramienta | Propósito |
|-------------|-----------|
| **ESLint** | Linting |
| **Vite DevTools** | Debugging |

---

## Testing

### Infraestructura de Testing

El proyecto cuenta con una infraestructura completa de testing usando **Vitest** y **Testing Library**.

#### Configuración
```javascript
// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/test/setup.js',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'json-summary'],
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.{js,jsx}',
        '**/__tests__/**',
        'src/main.jsx'
      ],
    },
  },
});
```

### Comandos de Testing
```bash
# Ejecutar todos los tests
npm run test

# Modo watch (re-ejecuta al guardar cambios)
npm run test -- --watch

# Ver UI interactiva de Vitest
npm run test:ui

# Generar reporte de cobertura
npm run test:coverage

# Ejecutar tests en CI (sin watch)
npm run test:run
```

### Cobertura Actual

| Categoría | Tests | Estado |
|-----------|-------|--------|
| **Hooks** | 36 tests | Pasando |
| **Services** | 13 tests | Pasando |
| **Context** | 2 tests | Pasando |
| **Utils** | 2 tests | Placeholder |
| **Total** | **40+ tests** | **Pasando** |

#### Tests Implementados

**Hooks:**
- `useProducts`: 8 tests (fetchProducts, createProduct, updateProduct, deleteProduct, error handling)
- `useAuth`: 5 tests (login, register, logout, error handling)
- `useProfile`: 7 tests (fetchProfile, updateProfile, changePassword, deleteProfile)
- `useProductsSimple`: 3 tests (fetch, reload, error handling)

**Services:**
- `productService`: 8 tests (CRUD operations, error handling)
- `authService`: 5 tests (login, register, logout, getCurrentUser)
- `userService`: 4 tests (getMyProfile, updateMyProfile, changePassword, deleteMyProfile)

**Context:**
- `AuthContext`: 2 tests (provider rendering, error handling)

### Estructura de Testing
```
src/
├── test/
│   ├── setup.js              # Configuración global de Vitest
│   ├── mocks/
│   │   ├── handlers.js       # Handlers de MSW (preparado)
│   │   ├── server.js         # Server de MSW (preparado)
│   │   └── data/             # Mock data reutilizable
│   │       ├── products.js   # Productos mock
│   │       ├── users.js      # Usuarios mock
│   │       └── auth.js       # Auth mock
│   └── utils/
│       ├── test-utils.jsx    # Custom render con providers
│       └── helpers.js        # Funciones helper para tests
│
├── hooks/__tests__/          # Tests de custom hooks
├── services/__tests__/       # Tests de services
├── context/__tests__/        # Tests de context
└── utils/__tests__/          # Tests de utilidades
```

### Ejemplo de Test
```javascript
// src/hooks/__tests__/useProducts.test.js
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import useProducts from '../useProducts';
import * as productService from '../../services/productService';

vi.mock('../../services/productService');

describe('useProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetchProducts carga productos correctamente', async () => {
    const mockProducts = [
      { id: 1, name: 'Producto 1', price: 100 },
      { id: 2, name: 'Producto 2', price: 200 }
    ];
    
    productService.default.getProducts = vi.fn().mockResolvedValue(mockProducts);
    
    const { result } = renderHook(() => useProducts());
    
    await result.current.fetchProducts();
    
    await waitFor(() => {
      expect(result.current.products).toEqual(mockProducts);
      expect(result.current.loading).toBe(false);
    });
  });
});
```

### Mejoras Futuras

- Implementar test factories para mock data centralizado
- Agregar integration tests para flujos críticos (login, CRUD admin)
- Implementar component tests para componentes clave
- Configurar CI/CD con ejecución automática de tests
- Aumentar cobertura en casos edge y escenarios de error

---

## UI/UX

### Sistema de Diseño

#### Paleta de Colores
```scss
:root {
  /* Primary */
  --accent-yellow: #ffca2c;
  --accent-yellow-hover: #ffd95a;
  --accent-yellow-transparent: rgba(255, 202, 44, 0.3);
  
  /* Backgrounds */
  --bg-dark: #000000;
  --bg-secondary: #0a0a0a;
  --bg-surface: #151515;
  --bg-card: #1a1a1a;
  
  /* Text */
  --text-primary: #ffffff;
  --text-secondary: #9ca3af;
  --text-muted: #6b7280;
  
  /* Status */
  --success: #10b981;
  --error: #ef4444;
  --warning: #f59e0b;
  --info: #3b82f6;
  
  /* Borders */
  --border: rgba(255, 255, 255, 0.08);
}
```

#### Tipografía Fluida
```scss
:root {
  /* Tamaños responsive con clamp() */
  --fz-title: clamp(2rem, 5vw + 1rem, 4rem);
  --fz-subtitle: clamp(1.7rem, 3vw + 0.5rem, 2.5rem);
  --fz-body: clamp(1rem, 1.5vw + 0.2rem, 1.25rem);
  
  /* Font Family */
  --font-primary: "Roboto", -apple-system, BlinkMacSystemFont, sans-serif;
}
```

#### Breakpoints
```scss
$breakpoints: (
  'mobile-sm': 375px,   // iPhone SE
  'mobile-md': 425px,   // Móviles grandes
  'mobile-lg': 768px,   // Tablets verticales
  'tablet': 1024px,     // Tablets horizontales
  'laptop': 1440px,     // Laptops
  'desktop': 1920px     // Monitores grandes
);
```

### Efectos Visuales

#### Glassmorphism
```scss
.glass-effect {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}
```

#### Neumorphism
```scss
.neuro-effect {
  background: #1a1a1a;
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.5),
    -8px -8px 16px rgba(40, 40, 40, 0.5);
}
```

### Animaciones
```scss
/* Respeta prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Transiciones suaves */
.smooth-transition {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

---

## Documentación

### Convenciones de Código

#### Nombrado de Archivos
```
Componentes:    PascalCase      Button.jsx, ProductCard.jsx
Hooks:          camelCase       useAuth.js, useProducts.js
Services:       camelCase       authService.js, productService.js
Utils:          camelCase       formatters.js, helpers.js
Pages:          PascalCase      Login.jsx, Dashboard.jsx
Styles:         match JS file   Button.scss, Dashboard.scss
Tests:          match source    useAuth.test.js, Button.test.jsx
```

#### Estructura de Imports
```javascript
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaShoppingCart } from 'react-icons/fa';

// 2. Services
import { productService } from '../services/productService';
import api from '../services/api';

// 3. Hooks
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';

// 4. Context
import { AuthContext } from '../context/AuthContext';

// 5. Components
import Button from '../components/common/Button';
import ProductCard from '../components/shop/ProductCard';

// 6. Utils
import { formatCurrency, formatDate } from '../utils/formatters';
import { ROUTES, ORDER_STATUS } from '../utils/constants';

// 7. Styles
import './Component.scss';
```

---

## Build y Deploy

### Build de Producción
```bash
# Build optimizado
npm run build

# Preview del build
npm run preview
```

### Variables de Entorno por Ambiente
```bash
# .env.development
VITE_API_URL=http://localhost:4001/api

# .env.production
VITE_API_URL=https://api.tudominio.com/api
```

### Deploy

#### Vercel
```bash
npm install -g vercel
vercel --prod
```

#### Netlify
```bash
npm run build
netlify deploy --prod --dir=dist
```

---

## Contribución

### Workflow de Git
```bash
# 1. Crear rama para feature
git checkout -b feature/nueva-funcionalidad

# 2. Hacer cambios y commits
git add .
git commit -m "feat: descripción del cambio"

# 3. Push a remoto
git push origin feature/nueva-funcionalidad

# 4. Crear Pull Request en GitHub
```

### Convención de Commits
```
feat:     Nueva funcionalidad
fix:      Corrección de bug
docs:     Cambios en documentación
style:    Cambios de formato (no afectan código)
refactor: Refactorización de código
test:     Agregar o modificar tests
chore:    Tareas de mantenimiento
```

### Code Review Checklist

- El código sigue las convenciones del proyecto
- No hay console.logs en producción
- Los componentes son reutilizables
- Las funciones tienen una sola responsabilidad
- Hay manejo de errores apropiado
- El código es responsive
- Se probó en diferentes navegadores
- La documentación está actualizada
- Los tests pasan correctamente

---

## Licencia

**Privado** - RIFLI © 2026

Todos los derechos reservados. Este proyecto es propiedad de RIFLI y su uso está restringido.

---

## Equipo

- **Frontend Lead**: Simón Santarelli
- **Backend**: Alan Carrizo

---

## Contacto

- **Email**: contacto@rifli.com
- **Website**: https://www.rifli.com
- **GitHub**: https://github.com/rifli

---

**Desarrollado por el equipo de RIFLI - 2026**