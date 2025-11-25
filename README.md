# Backend Course - E-commerce API con MongoDB

## Descripción

Este proyecto es una API REST profesional para un sistema de e-commerce desarrollada con Node.js, Express, MongoDB y WebSockets. Implementa gestión completa de productos y carritos de compras con paginación, filtros, ordenamiento y vistas renderizadas con Handlebars.

## Características Principales

- **Gestión de Productos con Paginación**: CRUD completo con soporte de paginación, filtros y ordenamiento
- **Gestión Avanzada de Carritos**: CRUD completo con populate de productos y actualización de cantidades
- **Base de Datos MongoDB**: Persistencia profesional con Mongoose y referencias entre colecciones
- **Motor de Plantillas**: Vistas renderizadas con Handlebars
- **Comunicación en Tiempo Real**: WebSockets con Socket.IO para actualizaciones instantáneas
- **API REST Profesional**: Respuestas estandarizadas con status, payload y metadata
- **Validaciones Completas**: Validación de campos requeridos, unicidad de códigos y formatos
- **Manejo de Errores**: Respuestas de error estructuradas y códigos HTTP apropiados
- **Interfaz Web Interactiva**: Vistas de productos paginados, detalles y carrito

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Base de Datos**: MongoDB, Mongoose
- **Paginación**: mongoose-paginate-v2
- **Motor de Vistas**: Handlebars
- **Tiempo Real**: Socket.IO
- **ES6 Modules**: Importación/exportación moderna de JavaScript

## Estructura del Proyecto

```
Backend-Course/
├── package.json
├── README.md
├── seed.js               # Script para poblar la BD con datos de prueba
├── public/               # Archivos estáticos
│   └── js/
│       └── realtime.js   # Cliente Socket.IO
├── src/
│   ├── app.js            # Configuración de Express y Handlebars
│   ├── server.js         # Servidor HTTP, Socket.IO y MongoDB
│   ├── instances.js      # (Legacy) Instancias de managers file-based
│   ├── models/           # Modelos Mongoose
│   │   ├── Product.js    # Schema de productos con paginate
│   │   └── Cart.js       # Schema de carritos con referencias
│   ├── routes/           # Endpoints de la API
│   │   ├── products.router.js  # CRUD + paginación/filtros
│   │   ├── carts.router.js     # CRUD + populate
│   │   └── views.router.js     # Vistas Handlebars
│   └── views/            # Plantillas Handlebars
│       ├── layouts/
│       │   └── main.handlebars
│       ├── home.handlebars              # Vista legacy simple
│       ├── realTimeProducts.handlebars  # Vista tiempo real
│       ├── products.handlebars          # Vista paginada
│       ├── productDetail.handlebars     # Detalle de producto
│       └── cart.handlebars              # Vista de carrito
```

## Instalación y Ejecución

### Requisitos Previos
- Node.js (v16 o superior)
- MongoDB (local o Atlas)

### Pasos de Instalación

1. **Cloná el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd Backend-Course
   ```

2. **Instalá las dependencias**:
   ```bash
   npm install
   ```

3. **Configurá MongoDB**:
   
   **Opción A - MongoDB Local (macOS):**
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   brew services start mongodb/brew/mongodb-community
   ```
   
   **Opción B - MongoDB Atlas (Cloud):**
   - Creá una cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Creá un cluster gratuito
   - Obtené tu connection string
   - Exportá la variable de entorno:
   ```bash
  # Ejemplo (usar SIEMPRE placeholders, NO comitear credenciales reales)
  # En tu archivo .env (ya ignorado en .gitignore):
  # MONGO_URI='mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_HOST>/<DBNAME>?retryWrites=true&w=majority'
   
  # Para una export manual temporal en la terminal:
  export MONGO_URI="mongodb+srv://<USERNAME>:<PASSWORD>@<CLUSTER_HOST>/<DBNAME>?retryWrites=true&w=majority"
   ```

4. **Poblá la base de datos** (opcional):
   ```bash
   node seed.js
   ```
   Esto creará 15 productos de ejemplo en diferentes categorías.

5. **Ejecutá el servidor**:
   ```bash
   npm run dev    # Modo desarrollo con nodemon
   # o
   npm start      # Modo producción
   ```

6. **Accedé a la aplicación**:
   - Servidor: `http://localhost:8080`
   - Vista productos paginados: `http://localhost:8080/products`
   - Vista tiempo real: `http://localhost:8080/realtimeproducts`
   - API: `http://localhost:8080/api/products`

## Endpoints de la API

### 🛍️ Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Obtener productos paginados (soporta filtros y ordenamiento) |
| `GET` | `/api/products/:pid` | Obtener un producto específico |
| `POST` | `/api/products` | Crear un nuevo producto |
| `PUT` | `/api/products/:pid` | Actualizar un producto existente |
| `DELETE` | `/api/products/:pid` | Eliminar un producto |

#### Query Params para GET /api/products
- `limit` (default: 10) - Cantidad de productos por página
- `page` (default: 1) - Número de página
- `query` - Filtrar por categoría o disponibilidad (`available` / `unavailable`)
- `sort` - Ordenar por precio (`asc` / `desc`)

**Ejemplo de respuesta:**
```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 3,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "http://localhost:8080/api/products?page=2&limit=10"
}
```

### 🛒 Carritos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/carts` | Crear un nuevo carrito vacío |
| `GET` | `/api/carts/:cid` | Obtener carrito con productos populados |
| `POST` | `/api/carts/:cid/products/:pid` | Agregar/incrementar producto en carrito |
| `DELETE` | `/api/carts/:cid/products/:pid` | Eliminar un producto específico del carrito |
| `PUT` | `/api/carts/:cid` | Actualizar carrito con array de productos |
| `PUT` | `/api/carts/:cid/products/:pid` | Actualizar solo la cantidad de un producto |
| `DELETE` | `/api/carts/:cid` | Vaciar el carrito completamente |

**Ejemplos de uso:**

```bash
# Actualizar cantidad de un producto
PUT /api/carts/:cid/products/:pid
{ "quantity": 5 }

# Reemplazar todos los productos del carrito
PUT /api/carts/:cid
[
  { "product": "id1", "quantity": 2 },
  { "product": "id2", "quantity": 1 }
]
```

### 🌐 Vistas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Vista home estática de productos |
| `GET` | `/products` | Vista paginada de productos con filtros |
| `GET` | `/products/:pid` | Detalle completo de un producto |
| `GET` | `/carts/:cid` | Vista del carrito con productos y totales |
| `GET` | `/realtimeproducts` | Vista en tiempo real con WebSockets |

## Formato de Datos

### Producto (Modelo Mongoose)
```javascript
{
  _id: ObjectId("..."),
  title: "NVIDIA GeForce RTX 4070",
  description: "Tarjeta gráfica de alto rendimiento",
  code: "GPU-RTX4070",
  price: 180000,
  status: true,
  stock: 3,
  category: "graphics-cards",
  thumbnails: ["https://example.com/image.jpg"],
  createdAt: "2025-11-24T...",
  updatedAt: "2025-11-24T..."
}
```

### Carrito (Modelo Mongoose con Referencias)
```javascript
{
  _id: ObjectId("..."),
  products: [
    {
      product: {
        _id: ObjectId("..."),
        title: "NVIDIA GeForce RTX 4070",
        price: 180000,
        // ... resto de campos del producto
      },
      quantity: 2
    }
  ],
  createdAt: "2025-11-24T...",
  updatedAt: "2025-11-24T..."
}
```

## Ejemplos de Uso

### 📊 Productos con Paginación y Filtros

```bash
# Obtener primera página con 5 productos
GET http://localhost:8080/api/products?limit=5&page=1

# Filtrar por categoría
GET http://localhost:8080/api/products?query=graphics-cards

# Solo productos disponibles
GET http://localhost:8080/api/products?query=available

# Ordenar por precio ascendente
GET http://localhost:8080/api/products?sort=asc

# Combinar filtros
GET http://localhost:8080/api/products?query=gaming-peripherals&sort=desc&limit=10&page=2
```

### 🛒 Gestión de Carritos

```bash
# 1. Crear un nuevo carrito
POST http://localhost:8080/api/carts
# Response: { "status": "success", "payload": { "_id": "...", "products": [] } }

# 2. Agregar producto al carrito
POST http://localhost:8080/api/carts/{cid}/products/{pid}
# Body (opcional): { "quantity": 3 }

# 3. Ver carrito con productos completos (populate)
GET http://localhost:8080/api/carts/{cid}

# 4. Actualizar cantidad de un producto específico
PUT http://localhost:8080/api/carts/{cid}/products/{pid}
# Body: { "quantity": 7 }

# 5. Eliminar un producto del carrito
DELETE http://localhost:8080/api/carts/{cid}/products/{pid}

# 6. Reemplazar todos los productos
PUT http://localhost:8080/api/carts/{cid}
# Body: [
#   { "product": "productId1", "quantity": 2 },
#   { "product": "productId2", "quantity": 1 }
# ]

# 7. Vaciar el carrito
DELETE http://localhost:8080/api/carts/{cid}
```

### ⚡ Vistas Interactivas

1. **Vista de Productos Paginada**: 
   - Navegar a `http://localhost:8080/products`
   - Usa botones "Anterior" / "Siguiente"
## Arquitectura y Patrones

### Base de Datos MongoDB
- **Modelos Mongoose**: Schemas con validaciones y tipos
- **Referencias**: Cart → Product usando `ref` y `populate()`
- **Paginación**: Plugin `mongoose-paginate-v2` para paginación eficiente
- **Timestamps**: Campos automáticos `createdAt` y `updatedAt`

### API REST Profesional
- **Respuestas Estandarizadas**: Formato consistente con `status` y `payload`
- **Códigos HTTP Apropiados**: 200, 201, 400, 404, 500
- **Manejo de Errores**: Try-catch en todos los endpoints
- **Query Parameters**: Soporte completo para filtrado y paginación

### Patrones de Diseño
- **Separación de Responsabilidades**: Routes → Controllers → Models
- **Async/Await**: Manejo asíncrono moderno
- **Populate**: Carga de referencias para evitar múltiples queries
- **Lean Queries**: `.lean()` para mejor performance en lectura

## Funcionalidades en Tiempo Real

### 🔄 Actualización Automática
- **Conexión WebSocket**: Los clientes se conectan automáticamente al servidor
- **Sincronización**: Cambios en productos se reflejan instantáneamente en todos los clientes conectados
- **Eventos Soportados**:
  - Creación de productos → `products:update`
  - Actualización de productos → `products:update`
  - Eliminación de productos → `products:update`

### 📝 Interfaz Web Interactiva
- **Formulario de Creación**: Agregar productos desde la web
- **Eliminación con Confirmación**: Botones de eliminar con confirmación
- **Mensajes de Estado**: Feedback visual de operaciones exitosas/fallidas
- **Contador Dinámico**: Cantidad total de productos actualizada en tiempo real

## Validaciones Implementadas

### Productos
- ✅ **Campos Requeridos**: title, description, code, price, stock, category
- ✅ **Unicidad de Código**: No se permiten códigos duplicados (unique index en MongoDB)
- ✅ **Tipos de Datos**: Validación a nivel de schema con Mongoose
- ✅ **Thumbnails**: Array de strings opcional
- ✅ **Status**: Boolean con valor por defecto `true`

### Carritos
- ✅ **Existencia de Producto**: Validación antes de agregar al carrito
- ✅ **Referencias Válidas**: ObjectId válidos para productos
- ✅ **Gestión de Cantidad**: Incremento automático si producto ya existe
- ✅ **Populate**: Carga completa de datos del producto al consultar carrito

## Testing y Desarrollo

### 🧪 Testing Manual
1. **API REST**: Usar Postman, Thunder Client o curl
2. **Paginación**: Probar diferentes valores de `page` y `limit`
3. **Filtros**: Verificar filtrado por categoría y disponibilidad
4. **Populate**: Confirmar que GET /api/carts/:cid devuelve productos completos
5. **WebSockets**: Abrir múltiples pestañas para ver sincronización

### 🔧 Desarrollo Local
```bash
# Modo desarrollo con auto-restart
npm run dev

# Poblar base de datos con datos de prueba
node seed.js

# Verificar conexión a MongoDB
mongosh "mongodb://localhost:27017/ecommerce"
```

### 📊 Verificación de Base de Datos
```bash
# Conectar a MongoDB
mongosh

# Seleccionar base de datos
use ecommerce

# Ver colecciones
show collections

# Contar productos
db.products.countDocuments()

# Ver carritos
db.carts.find().pretty()
```

## Monitoreo y Debugging

### Logs del Servidor
```
MongoDB connected
Server listening on http://localhost:8080
New client connected: socket-id-123
Client disconnected: socket-id-123
```

### Cliente WebSocket
```javascript
// Eventos disponibles para debugging
socket.on('connect', () => console.log('Connected'));
socket.on('products:update', (products) => console.log('Products:', products.length));
socket.on('disconnect', () => console.log('Disconnected'));
```

## Variables de Entorno

```bash
# MongoDB URI (opcional, default: mongodb://localhost:27017/ecommerce)
MONGO_URI=mongodb://localhost:27017/ecommerce

# Para MongoDB Atlas
MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority

# Puerto del servidor (opcional, default: 8080)
PORT=8080
```

## Próximas Mejoras (Roadmap)

- [x] Base de datos MongoDB
- [x] Paginación avanzada
- [x] Filtros y ordenamiento
- [x] Referencias con populate
- [ ] Autenticación y autorización (JWT)
- [ ] Roles y permisos
- [ ] Upload de imágenes (Cloudinary/S3)
- [ ] Tests automatizados (Jest/Mocha)
- [ ] Documentación con Swagger
- [ ] Rate limiting
- [ ] Logs estructurados (Winston)
- [ ] Checkout y órdenes
- [ ] Pasarela de pagos

## Autor

**Nicolás Ferraro**  
Desarrollador Full Stack en formación  
*Coderhouse Backend Course - Entrega N°3*

## Propósito Educativo

Este proyecto se desarrolla con **fines exclusivamente educativos** como parte del curso de Backend de Coderhouse. Implementa patrones y tecnologías profesionales para aprendizaje de:

- Arquitectura de APIs REST profesionales
- Base de datos MongoDB con Mongoose
- Paginación, filtros y ordenamiento
- Referencias entre colecciones (populate)
- Comunicación en tiempo real con WebSockets
- Renderizado server-side con Handlebars
- Operaciones CRUD completas

### Entrega N°3 - Requisitos Implementados

✅ **GET /api/products** con paginación, filtros y ordenamiento  
✅ Formato de respuesta estandarizado con metadata de paginación  
✅ **DELETE /api/carts/:cid/products/:pid** - eliminar producto del carrito  
✅ **PUT /api/carts/:cid** - actualizar array completo de productos  
✅ **PUT /api/carts/:cid/products/:pid** - actualizar cantidad  
✅ **DELETE /api/carts/:cid** - vaciar carrito  
✅ Modelo Cart con referencias a Product usando `ref`  
✅ Populate en GET /api/carts/:cid  
✅ Vista `/products` con paginación y links prev/next  
✅ Vista `/products/:pid` con detalle del producto  
✅ Vista `/carts/:cid` con productos, cantidades y totales

No está destinado para uso comercial o en producción sin las debidas consideraciones de seguridad, escalabilidad y optimización.

## Licencia

MIT License - Uso educativo