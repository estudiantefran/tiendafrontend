import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio';
import { Productos } from './pages/productos/productos';
import { Nosotros } from './pages/nosotros/nosotros';
import { Login } from './pages/login/login';
import { Carrito } from './pages/carrito/carrito';
import { Notfound } from './pages/notfound/notfound';

export const routes: Routes = [
	{ path: '', component: Inicio },
	{ path: 'productos', component: Productos },
	{ path: 'nosotros', component: Nosotros },
	{ path: 'login', component: Login },
	{ path: 'carrito', component: Carrito },
	{ path: '**', component: Notfound },
];