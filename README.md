# Pilar de Oro — Frontend

Tienda virtual para la comercialización de chocolates artesanales. Este repositorio contiene el frontend de la aplicación, desarrollado en **Angular**.

## 📋 Descripción General

Pilar de Oro es una plataforma de e-commerce que permite a los clientes explorar un catálogo digital de chocolates artesanales, filtrar productos por categoría y presentación (peso), gestionar un carrito de compras, y realizar pedidos en línea de forma rápida y segura.

**Funcionalidades principales:**

- 🛍️ **Catálogo de productos** con filtros por categoría y tamaño, búsqueda por nombre y paginación.
- 🔐 **Autenticación de usuarios** (registro e inicio de sesión) con JSON Web Tokens (JWT).
- 🛒 **Carrito de compras** persistente, con selección de presentación por producto (gramaje/precio independiente).
- 📦 **Checkout completo**: dirección de envío, método de pago y confirmación de pedido contra el backend real.
- 📄 **Historial de pedidos** ("Mis Pedidos"), con opción de cancelar pedidos pendientes.
- ⭐ **Favoritos**: guardar productos de interés para consultarlos después.
- 🛠️ **Panel de administración** (solo para usuarios con rol *administrador*):
  - Gestión de categorías (crear, editar, activar/desactivar).
  - Gestión de productos y sus presentaciones (crear, editar precio/stock, activar/desactivar).
  - Gestión de pedidos (ver todos, actualizar estado y estado de pago).
- 📖 Página "Nosotros" con historia de la marca y formulario de contacto.
- ⚡ Renderizado del lado del servidor (SSR) para mejor rendimiento y SEO.

## 👥 Autores

| Nombre | Rol |
|---|---|
| Francisco Navarro | Desarrollador Full Stack |

## 🔧 Requisitos Previos

Antes de ejecutar este proyecto, asegúrate de tener instalado:

- **[Node.js](https://nodejs.org/)** (versión 18 o superior recomendada)
- **npm** (se instala junto con Node.js) o **pnpm**
- **Angular CLI** — se instala globalmente con:
  ```bash
  npm install -g @angular/cli
  ```
- El **backend de Pilar de Oro** corriendo localmente (por defecto en `http://localhost:3000`), ya que este frontend consume su API REST. Ver el repositorio del backend para sus propias instrucciones de instalación.

## 🚀 Instrucciones de Instalación y Ejecución

1. **Clonar el repositorio**
   ```bash
   git clone <URL-del-repositorio>
   cd tiendafrontend
   ```

2. **Instalar las dependencias**
   ```bash
   npm install
   ```

3. **Configurar la URL del backend**

   Verifica que el archivo `src/environments/environment.development.ts` apunte a tu backend local:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:3000/api',
   };
   ```

4. **Asegúrate de que el backend esté corriendo**

   Este frontend depende de la API del backend para funcionar (login, catálogo, pedidos, etc.). Debe estar activo en paralelo, normalmente en `http://localhost:3000`.

5. **Levantar el servidor de desarrollo**
   ```bash
   ng serve
   ```
   o, si el proyecto usa SSR en modo desarrollo:
   ```bash
   npm start
   ```

6. **Abrir la aplicación**

   Ve a [http://localhost:4200](http://localhost:4200) en tu navegador. La aplicación recargará automáticamente si modificas algún archivo fuente.

7. **(Opcional) Compilar para producción**
   ```bash
   ng build
   ```
   Los archivos compilados se generan en la carpeta `dist/`.

### Cuentas de prueba

- **Cliente:** puedes registrar una cuenta nueva desde la pantalla de "Crear cuenta".
- **Administrador:** el rol de administrador se asigna manualmente desde la base de datos (MongoDB Atlas) cambiando el campo `rol` de un usuario existente a `"administrador"`. Es necesario volver a iniciar sesión después del cambio para que el nuevo rol se refleje en la sesión.

## 📌 Estado del Proyecto

🟢 **En desarrollo activo.**

**Completado:**
- Autenticación (registro, login, JWT, guards de rutas).
- Catálogo de productos con filtros, presentaciones y paginación.
- Carrito de compras y checkout funcional contra el backend real.
- Historial de pedidos del cliente.
- Panel de administración (categorías, productos, pedidos).
- Página "Nosotros" con formulario de contacto.

**Pendiente / próximas mejoras:**
- Integración de una pasarela de pago real (actualmente el checkout registra el pedido sin procesar el pago).
- Página de detalle individual de producto.
- Formulario visual para dejar reseñas de productos comprados.
- Subida de imágenes desde la interfaz (actualmente se usan URLs externas).
- Vista de perfil de usuario editable.

## 🛠️ Tecnologías Utilizadas

- **Angular** (standalone components, signals, Server-Side Rendering)
- **TypeScript**
- **RxJS**
- Consumo de API REST (Node.js + Express + MongoDB) mediante `HttpClient`
