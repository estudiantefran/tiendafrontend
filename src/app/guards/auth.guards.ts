import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

// IMPORTANTE (SSR): en el servidor no existe localStorage, así que el
// AuthService no puede saber todavía si hay sesión. Si el guard evaluara
// "no autorizado" en el servidor, redirigiría antes de que el navegador
// tenga oportunidad de leer la sesión real guardada en el cliente.
// Por eso, en el servidor se deja pasar sin bloquear; la verificación real
// ocurre en el navegador una vez la app hidrata.
export const authGuard: CanActivateFn = () => {
	const platformId = inject(PLATFORM_ID);
	if (!isPlatformBrowser(platformId)) {
		return true;
	}

	const auth = inject(AuthService);
	const router = inject(Router);

	if (auth.estaLogueado()) {
		return true;
	}

	router.navigate(['/login']);
	return false;
};

export const adminGuard: CanActivateFn = () => {
	const platformId = inject(PLATFORM_ID);
	if (!isPlatformBrowser(platformId)) {
		return true;
	}

	const auth = inject(AuthService);
	const router = inject(Router);

	if (auth.estaLogueado() && auth.esAdmin()) {
		return true;
	}

	router.navigate(['/']);
	return false;
};