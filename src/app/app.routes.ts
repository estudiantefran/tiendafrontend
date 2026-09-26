import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Productos } from './pages/productos/productos';
import { Nosotros } from './pages/nosotros/nosotros';
import { Login } from './pages/login/login';
import { Carrito } from './pages/carrito/carrito';
import { MisPedidos } from './pages/mis-pedidos/mis-pedidos';
import { AdminCategorias } from './pages/admin-categorias/admin-categorias';
import { AdminProductos } from './pages/admin-productos/admin-productos';
import { AdminPedidos } from './pages/admin-pedidos/admin-pedidos';
import { Notfound } from './pages/notfound/notfound';
import { authGuard, adminGuard } from './guards/auth.guards';

export const routes: Routes = [
	{ path: '', component: Inicio },
	{ path: 'productos', component: Productos },
	{ path: 'nosotros', component: Nosotros },
	{ path: 'login', component: Login },
	{ path: 'carrito', component: Carrito },
	{ path: 'mis-pedidos', component: MisPedidos, canActivate: [authGuard] },
	{ path: 'admin/categorias', component: AdminCategorias, canActivate: [adminGuard] },
	{ path: 'admin/productos', component: AdminProductos, canActivate: [adminGuard] },
	{ path: 'admin/pedidos', component: AdminPedidos, canActivate: [adminGuard] },
	{ path: '**', component: Notfound },
];