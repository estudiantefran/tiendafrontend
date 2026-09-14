# Tienda Virtual de Chocolates Artesanales Pilar de Oro - Frontend

## Descripción General
El frontend de la Tienda Virtual de Chocolates Artesanales Pilar de Oro es una aplicación web desarrollada en Angular que permite a los usuarios interactuar con la plataforma de comercio electrónico de manera intuitiva y dinámica.

La aplicación está orientada a promover la venta de chocolates artesanales mediante una interfaz moderna, responsive y fácil de usar, permitiendo a los clientes explorar productos, consultar información detallada y gestionar sus compras en línea.

### Funcionalidades Principales

- Visualización del catálogo de chocolates artesanales.
- Consulta detallada de productos.
- Registro e inicio de sesión de usuarios.
- Gestión de perfil de usuario.
- Carrito de compras.
- Gestión de pedidos.
- Navegación responsive para dispositivos móviles y de escritorio.
- Comunicación con la API backend para la gestión de información y procesos de compra.

---

## Autor
NombreRolFrancisco José Navarro RamosDesarrollador Full Stack
---

## Tecnologías Utilizadas

### Framework Frontend

- Angular

### Lenguajes

- TypeScript
- HTML5
- CSS3

### Librerías y Herramientas

- Angular CLI
- Bootstrap
- RxJS

### Control de Versiones

- Git
- GitHub

---

## Requisitos Previos
Antes de ejecutar el frontend, asegúrese de contar con las siguientes herramientas instaladas:

### Node.js
Se recomienda utilizar la versión 18 o superior.

Verificar instalación:

```bash
node -v
```

### npm
Verificar instalación:

```bash
npm -v
```

### Angular CLI
Instalar Angular CLI globalmente:

```bash
npm install -g @angular/cli
```

Verificar instalación:

```bash
ng version
```

### Git
Verificar instalación:

```bash
git --version
```

---

## Instalación y Ejecución

### 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
```

### 2. Ingresar a la carpeta del frontend

```bash
cd frontend
```

### 3. Instalar dependencias

```bash
npm install
```

Este comando descargará todas las dependencias especificadas en el archivo `package.json`.

### 4. Configurar el entorno
Verificar el archivo:

```bash
src/environments/environment.ts
```

Asegurar que la URL del backend corresponda al entorno de trabajo.

Ejemplo:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### 5. Ejecutar la aplicación

```bash
ng serve
```

### 6. Acceder desde el navegador
Abrir:

```text
http://localhost:4200
```

Si la compilación es exitosa, Angular recargará automáticamente los cambios realizados durante el desarrollo.

---

## Estructura General del Proyecto

```text
frontend/
│
├── src/
│   ├── app/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── models/
│   │   └── guards/
│   │
│   ├── assets/
│   │   ├── images/
│   │   └── styles/
│   │
│   ├── environments/
│   │
│   ├── index.html
│   ├── main.ts
│   └── styles.css
│
├── package.json
├── angular.json
└── README.md
```

---

## Dependencias Principales
Las principales dependencias utilizadas en el frontend incluyen:

```json
{
  "@angular/core": "Angular Framework",
  "@angular/router": "Manejo de rutas",
  "@angular/forms": "Formularios reactivos",
  "rxjs": "Programación reactiva",
  "bootstrap": "Diseño y estilos responsivos"
}
```

---

## Estado del Proyecto
🚧 **En Desarrollo**

El frontend cuenta con las funcionalidades esenciales para la navegación y gestión de compras de productos artesanales. Actualmente se encuentra en fase de mejora continua y optimización de características destinadas a fortalecer la experiencia de usuario.
