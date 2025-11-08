# Backend Course - E-commerce API con WebSockets

## Descripción

Este proyecto es una API REST completa para un sistema de e-commerce desarrollada con Node.js, Express y WebSockets. Implementa gestión de productos y carritos de compras tanto a través de endpoints HTTP como con comunicación en tiempo real mediante Socket.IO y vistas renderizadas con Handlebars.

## Características

- **Gestión de Productos**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Gestión de Carritos**: Crear carritos y agregar productos con manejo de cantidades
- **Motor de Plantillas**: Vistas renderizadas con Handlebars
- **Comunicación en Tiempo Real**: WebSockets con Socket.IO para actualizaciones instantáneas
- **Persistencia en archivos JSON**: Los datos se almacenan localmente
- **Validaciones Completas**: Validación de campos requeridos, unicidad de códigos y formatos
- **Manejo de Errores**: Respuestas de error estructuradas y códigos HTTP apropiados
- **Interfaz Web**: Formularios para gestión de productos en tiempo real

## Tecnologías Utilizadas

- **Backend**: Node.js, Express.js
- **Motor de Vistas**: Handlebars
- **Tiempo Real**: Socket.IO
- **Persistencia**: File System (fs) con archivos JSON
- **Identificadores**: UUID/crypto para IDs únicos
- **ES6 Modules**: Importación/exportación moderna de JavaScript

## Estructura del Proyecto

```
Backend-Course/
├── package.json
├── README.md
├── public/                 # Archivos estáticos
│   └── js/
│       └── realtime.js    # Cliente Socket.IO
├── src/
│   ├── app.js             # Configuración de Express y Handlebars
│   ├── server.js          # Servidor HTTP y Socket.IO
│   ├── instances.js       # Instancias compartidas de managers
│   ├── data/              # Persistencia JSON
│   │   ├── products.json
│   │   └── carts.json
│   ├── managers/          # Lógica de negocio
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   ├── routes/            # Endpoints de la API
│   │   ├── products.router.js
│   │   ├── carts.router.js
│   │   └── views.router.js
│   └── views/             # Plantillas Handlebars
│       ├── layouts/
│       │   └── main.handlebars
│       ├── home.handlebars
│       └── realTimeProducts.handlebars
```

## Instalación y Ejecución

1. **Cloná el repositorio**:
   ```bash
   git clone <url-del-repositorio>
   cd Backend-Course
   ```

2. **Instalá las dependencias**:
   ```bash
   npm install
   ```

3. **Ejecutá el servidor**:
   ```bash
   npm run dev    # Modo desarrollo con nodemon
   # o
   npm start      # Modo producción
   ```

4. **Accedé a la aplicación**:
   - Servidor: `http://localhost:8080`
   - Vista estática: `http://localhost:8080/`
   - Vista tiempo real: `http://localhost:8080/realtimeproducts`

## Endpoints de la API

### 🛍️ Productos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/api/products` | Obtener todos los productos (opcional: `?limit=N`) |
| `GET` | `/api/products/:pid` | Obtener un producto específico |
| `POST` | `/api/products` | Crear un nuevo producto |
| `PUT` | `/api/products/:pid` | Actualizar un producto existente |
| `DELETE` | `/api/products/:pid` | Eliminar un producto |

### 🛒 Carritos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/carts` | Crear un nuevo carrito vacío |
| `GET` | `/api/carts/:cid` | Obtener productos de un carrito |
| `POST` | `/api/carts/:cid/product/:pid` | Agregar/incrementar producto en carrito |

### 🌐 Vistas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Vista estática de productos (home.handlebars) |
| `GET` | `/realtimeproducts` | Vista en tiempo real con formularios y WebSockets |

## Formato de Datos

### Producto
```json
{
  "id": "uuid-generado-automaticamente",
  "title": "NVIDIA GeForce RTX 4070 Ti",
  "description": "Placa de video de alto rendimiento para gaming",
  "code": "GPU-RTX4070TI",
  "price": 89999,
  "status": true,
  "stock": 15,
  "category": "graphics-cards",
  "thumbnails": ["/images/rtx4070ti.jpg"]
}
```

### Carrito
```json
{
  "id": "uuid-generado-automaticamente",
  "products": [
    {
      "product": "id-del-producto",
      "quantity": 2
    }
  ]
}
```

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
- ✅ **Unicidad de Código**: No se permiten códigos duplicados
- ✅ **Tipos de Datos**: Validación de números, booleanos y arrays
- ✅ **Thumbnails**: Debe ser un array de strings (opcional)

### Carritos
- ✅ **Existencia de Carrito**: Validación de carrito existente
- ✅ **Gestión de Cantidad**: Incremento automático si el producto ya existe
- ✅ **Productos Únicos**: Un producto por carrito con cantidad acumulativa

## Tecnologías de Desarrollo

### Backend Architecture
- **Patrón MVC**: Separación clara entre rutas, lógica y persistencia
- **ES6 Modules**: Sintaxis moderna con import/export
- **Async/Await**: Manejo asíncrono de archivos y operaciones
- **Error Handling**: Manejo centralizado de errores con códigos HTTP apropiados

### Frontend Integration
- **Handlebars**: Motor de plantillas para renderizado server-side
- **Socket.IO Client**: Comunicación bidireccional en tiempo real
- **Vanilla JavaScript**: Cliente WebSocket sin dependencias adicionales
- **Responsive Design**: Interfaz adaptable con CSS Grid

## Casos de Uso

### 📊 Gestión de Inventario
```bash
# Crear producto de gaming
POST /api/products
{
  "title": "Razer DeathAdder V3 Pro",
  "description": "Mouse gaming inalámbrico de alta precisión",
  "code": "MOUSE-RZR-001",
  "price": 14999,
  "stock": 25,
  "category": "gaming-peripherals",
  "thumbnails": ["/images/razer-deathadder-v3.jpg"]
}
```

### 🛒 Flujo de Compra
```bash
# 1. Crear carrito
POST /api/carts
# Response: { "id": "cart-uuid", "products": [] }

# 2. Agregar productos
POST /api/carts/{cart-id}/product/{product-id}
# 3. Consultar carrito
GET /api/carts/{cart-id}
```

### ⚡ Tiempo Real
1. **Usuario A** entra a `/realtimeproducts`
2. **Usuario B** entra a `/realtimeproducts` en otra pestaña
3. **Usuario A** crea un producto → aparece instantáneamente en **Usuario B**
4. **Usuario B** elimina un producto → desaparece en **Usuario A**

## Monitoreo y Debugging

### Logs del Servidor
```
Server listening on http://localhost:8080
New client connected: socket-id-123
Products updated: 5
Client disconnected: socket-id-123
```

### Cliente WebSocket
```javascript
// Eventos disponibles para debugging
socket.on('connect', () => console.log('Connected'));
socket.on('products:update', (products) => console.log('Products:', products.length));
socket.on('disconnect', () => console.log('Disconnected'));
```

## Testing y Desarrollo

### 🧪 Testing Manual
1. **API HTTP**: Usar Postman o Thunder Client
2. **WebSockets**: Abrir múltiples pestañas del navegador
3. **Persistencia**: Verificar archivos JSON en `src/data/`

### 🔧 Desarrollo Local
```bash
# Modo desarrollo con auto-restart
npm run dev

# Modo producción
npm start
```

## Próximas Mejoras (Roadmap)

- [ ] Base de datos (MongoDB/PostgreSQL)
- [ ] Autenticación y autorización
- [ ] Paginación avanzada
- [ ] Filtros y búsqueda
- [ ] Upload de imágenes
- [ ] Tests automatizados
- [ ] Documentación con Swagger
- [ ] Rate limiting
- [ ] Logs estructurados

## Autor

**NICOLAS FERRARO**  
Desarrollador Full Stack en formación

## Propósito Educativo

Este proyecto se desarrolla con **fines exclusivamente educativos** como parte de un curso de desarrollo backend. Implementa patrones y tecnologías modernas para aprendizaje de:

- Arquitectura de APIs REST
- Comunicación en tiempo real
- Persistencia de datos
- Renderizado server-side
- Integración frontend-backend

No está destinado para uso comercial o en producción sin las debidas consideraciones de seguridad y escalabilidad.

## Licencia

MIT License - Uso educativo