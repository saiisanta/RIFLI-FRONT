#!/bin/bash
# create-structure.sh - Script para crear estructura del frontend

echo "🚀 Creando estructura del frontend..."

# Crear directorios principales
echo "📁 Creando directorios principales..."
mkdir -p public
mkdir -p src/assets/images
mkdir -p src/assets/icons
mkdir -p src/components/common
mkdir -p src/components/dashboard
mkdir -p src/components/shop
mkdir -p src/components/services
mkdir -p src/components/user
mkdir -p src/components/admin
mkdir -p src/context
mkdir -p src/hooks
mkdir -p src/pages
mkdir -p src/routes
mkdir -p src/services
mkdir -p src/styles
mkdir -p src/utils

# ==================== ASSETS ====================
echo "🎨 Creando assets..."
touch src/assets/images/.gitkeep
touch src/assets/icons/.gitkeep

# ==================== COMPONENTS - COMMON ====================
echo "🧩 Creando componentes comunes..."
touch src/components/common/Button.jsx
touch src/components/common/Button.css
touch src/components/common/Input.jsx
touch src/components/common/Input.css
touch src/components/common/Card.jsx
touch src/components/common/Card.css
touch src/components/common/Modal.jsx
touch src/components/common/Modal.css
touch src/components/common/Spinner.jsx
touch src/components/common/Spinner.css
touch src/components/common/Header.jsx
touch src/components/common/Header.css
touch src/components/common/Footer.jsx
touch src/components/common/Footer.css
touch src/components/common/Navbar.jsx
touch src/components/common/Navbar.css
touch src/components/common/Alert.jsx
touch src/components/common/Alert.css

# ==================== COMPONENTS - DASHBOARD ====================
echo "📊 Creando componentes de dashboard..."
touch src/components/dashboard/Dashboard.jsx
touch src/components/dashboard/Dashboard.css
touch src/components/dashboard/UserSection.jsx
touch src/components/dashboard/UserSection.css
touch src/components/dashboard/AdminSection.jsx
touch src/components/dashboard/AdminSection.css
touch src/components/dashboard/QuickActions.jsx
touch src/components/dashboard/QuickActions.css
touch src/components/dashboard/UserStats.jsx
touch src/components/dashboard/UserStats.css
touch src/components/dashboard/RecentOrders.jsx
touch src/components/dashboard/RecentOrders.css
touch src/components/dashboard/RecentQuotes.jsx
touch src/components/dashboard/RecentQuotes.css

# ==================== COMPONENTS - SHOP ====================
echo "🛒 Creando componentes de tienda..."
touch src/components/shop/ProductCard.jsx
touch src/components/shop/ProductCard.css
touch src/components/shop/ProductList.jsx
touch src/components/shop/ProductList.css
touch src/components/shop/ProductDetail.jsx
touch src/components/shop/ProductDetail.css
touch src/components/shop/ProductFilters.jsx
touch src/components/shop/ProductFilters.css
touch src/components/shop/Cart.jsx
touch src/components/shop/Cart.css
touch src/components/shop/CartItem.jsx
touch src/components/shop/CartItem.css
touch src/components/shop/Checkout.jsx
touch src/components/shop/Checkout.css

# ==================== COMPONENTS - SERVICES ====================
echo "💼 Creando componentes de servicios..."
touch src/components/services/ServiceCard.jsx
touch src/components/services/ServiceCard.css
touch src/components/services/ServiceList.jsx
touch src/components/services/ServiceList.css
touch src/components/services/QuoteForm.jsx
touch src/components/services/QuoteForm.css
touch src/components/services/QuoteList.jsx
touch src/components/services/QuoteList.css
touch src/components/services/QuoteDetail.jsx
touch src/components/services/QuoteDetail.css

# ==================== COMPONENTS - USER ====================
echo "👤 Creando componentes de usuario..."
touch src/components/user/Profile.jsx
touch src/components/user/Profile.css
touch src/components/user/Orders.jsx
touch src/components/user/Orders.css
touch src/components/user/OrderDetail.jsx
touch src/components/user/OrderDetail.css
touch src/components/user/Quotes.jsx
touch src/components/user/Quotes.css
touch src/components/user/Addresses.jsx
touch src/components/user/Addresses.css
touch src/components/user/AddressForm.jsx
touch src/components/user/Settings.jsx
touch src/components/user/Settings.css

# ==================== COMPONENTS - ADMIN ====================
echo "🔧 Creando componentes de admin..."
touch src/components/admin/AdminPanel.jsx
touch src/components/admin/AdminPanel.css
touch src/components/admin/AdminSidebar.jsx
touch src/components/admin/AdminSidebar.css
touch src/components/admin/Analytics.jsx
touch src/components/admin/Analytics.css
touch src/components/admin/ProductManager.jsx
touch src/components/admin/ProductManager.css
touch src/components/admin/ProductForm.jsx
touch src/components/admin/OrderManager.jsx
touch src/components/admin/OrderManager.css
touch src/components/admin/QuoteManager.jsx
touch src/components/admin/QuoteManager.css
touch src/components/admin/QuoteResponseForm.jsx
touch src/components/admin/UserManager.jsx
touch src/components/admin/UserManager.css
touch src/components/admin/ServiceManager.jsx

# ==================== CONTEXT ====================
echo "🔄 Creando contexts..."
touch src/context/AuthContext.jsx
touch src/context/CartContext.jsx
touch src/context/NotificationContext.jsx

# ==================== HOOKS ====================
echo "🪝 Creando hooks..."
touch src/hooks/useAuth.js
touch src/hooks/useCart.js
touch src/hooks/useProducts.js
touch src/hooks/useOrders.js
touch src/hooks/useQuotes.js
touch src/hooks/useServices.js
touch src/hooks/useNotifications.js
touch src/hooks/useUsers.js
touch src/hooks/useAdminStats.js
touch src/hooks/useDebounce.js
touch src/hooks/useLocalStorage.js
touch src/hooks/useForm.js

# ==================== PAGES ====================
echo "📄 Creando páginas..."
touch src/pages/Home.jsx
touch src/pages/Home.css
touch src/pages/Shop.jsx
touch src/pages/Shop.css
touch src/pages/ProductDetailPage.jsx
touch src/pages/ProductDetailPage.css
touch src/pages/CartPage.jsx
touch src/pages/CartPage.css
touch src/pages/CheckoutPage.jsx
touch src/pages/CheckoutPage.css
touch src/pages/Services.jsx
touch src/pages/Services.css
touch src/pages/ServiceDetailPage.jsx
touch src/pages/ServiceDetailPage.css
touch src/pages/Login.jsx
touch src/pages/Login.css
touch src/pages/Register.jsx
touch src/pages/Register.css
touch src/pages/DashboardPage.jsx
touch src/pages/DashboardPage.css
touch src/pages/AdminPanelPage.jsx
touch src/pages/AdminPanelPage.css
touch src/pages/NotFound.jsx
touch src/pages/NotFound.css
touch src/pages/Unauthorized.jsx
touch src/pages/Unauthorized.css

# ==================== ROUTES ====================
echo "🛣️ Creando rutas..."
touch src/routes/AppRoutes.jsx
touch src/routes/PrivateRoute.jsx

# ==================== SERVICES ====================
echo "📡 Creando services..."
touch src/services/api.js
touch src/services/authService.js
touch src/services/userService.js
touch src/services/productService.js
touch src/services/cartService.js
touch src/services/orderService.js
touch src/services/serviceService.js
touch src/services/quoteService.js
touch src/services/notificationService.js
touch src/services/fileService.js
touch src/services/adminService.js

# ==================== STYLES ====================
echo "🎨 Creando estilos..."
touch src/styles/global.css
touch src/styles/variables.css
touch src/styles/reset.css
touch src/styles/utilities.css

# ==================== UTILS ====================
echo "🔧 Creando utils..."
touch src/utils/constants.js
touch src/utils/formatters.js
touch src/utils/helpers.js
touch src/utils/validation.js
touch src/utils/localStorage.js

# ==================== ROOT ====================
echo "📦 Creando archivos raíz..."
touch src/App.jsx
touch src/App.css
touch src/main.jsx

# ==================== CONFIG FILES ====================
echo "⚙️ Creando archivos de configuración..."
touch .env.example
touch README.md

# Crear .gitignore si no existe
if [ ! -f .gitignore ]; then
  echo "📝 Creando .gitignore..."
  cat > .gitignore << 'EOF'
# Dependencies
node_modules/
package-lock.json
yarn.lock
pnpm-lock.yaml

# Build
dist/
build/

# Environment
.env
.env.local

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Logs
*.log
EOF
fi

echo ""
echo "✅ ¡Estructura creada exitosamente!"
echo ""
echo "📊 Resumen de archivos creados:"
echo "   📁 Carpetas principales: 13"
echo "   🧩 Componentes: $(find src/components -name "*.jsx" 2>/dev/null | wc -l)"
echo "   🪝 Hooks: $(find src/hooks -name "*.js" 2>/dev/null | wc -l)"
echo "   📄 Páginas: $(find src/pages -name "*.jsx" 2>/dev/null | wc -l)"
echo "   📡 Services: $(find src/services -name "*.js" 2>/dev/null | wc -l)"
echo ""
echo "🎯 Próximos pasos:"
echo "   1. npm install (instalar dependencias)"
echo "   2. Copiar .env.example a .env y configurar"
echo "   3. npm run dev (iniciar servidor de desarrollo)"
echo ""
echo "🚀 ¡Listo para empezar a codear!"