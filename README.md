# Backend Course - E-commerce API

## Descripción

Este proyecto es una API REST para un sistema de e-commerce desarrollada con Node.js y Express. Permite gestionar productos y carritos de compras a través de endpoints HTTP.

## Características

- **Gestión de Productos**: CRUD completo (Crear, Leer, Actualizar, Eliminar)
- **Gestión de Carritos**: Crear carritos y agregar productos
- **Persistencia en archivos JSON**: Los datos se almacenan en archivos JSON
- **Validaciones**: Validación de campos requeridos y formatos
- **Manejo de errores**: Respuestas de error estructuradas

## Tecnologías Utilizadas

- Node.js
- Express.js
- File System (fs) para persistencia
- UUID para generación de IDs únicos

## Estructura del Proyecto

```
Backend-Course/
├── package.json
├── src/
│   ├── server.js           # Servidor principal
│   ├── data/               # Archivos de datos JSON
│   │   ├── products.json
│   │   └── carts.json
│   ├── managers/           # Clases para manejo de datos
│   │   ├── ProductManager.js
│   │   └── CartManager.js
│   └── routes/             # Rutas de la API
│       ├── products.router.js
│       └── carts.router.js
```

## Instalación

1. Cloná el repositorio
2. Instalá las dependencias:
   ```bash
   npm install
   ```
3. Ejecutá el servidor:
   ```bash
   npm start
   ```

El servidor se ejecutará en `http://localhost:8080`

## Endpoints de la API

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:pid` - Obtener un producto por ID
- `POST /api/products` - Crear un nuevo producto
- `PUT /api/products/:pid` - Actualizar un producto
- `DELETE /api/products/:pid` - Eliminar un producto

### Carritos

- `POST /api/carts` - Crear un nuevo carrito
- `GET /api/carts/:cid` - Obtener productos de un carrito
- `POST /api/carts/:cid/product/:pid` - Agregar producto a un carrito

## Formato de Producto

```json
{
  "title": "Nombre del producto",
  "description": "Descripción del producto",
  "code": "CODIGO-UNICO",
  "price": 29999,
  "status": true,
  "stock": 100,
  "category": "categoria",
  "thumbnails": ["imagen1.jpg", "imagen2.jpg"]
}
```

## Health Check

- `GET /health` - Verificar estado del servidor

## Autor

**NICOLAS FERRARO**

## Propósito Educativo

Este proyecto se desarrolla con **fines exclusivamente educativos** como parte de un curso de desarrollo backend. No está destinado para uso comercial o en producción.

## Licencia

Este proyecto es de uso educativo y no tiene fines comerciales.