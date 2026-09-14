import { Injectable, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { tap } from 'rxjs';
import { LoginService, RespuestaLogin } from './login.service';
import { Credenciales } from '../interfaces/credenciales';
import { Usuario } from '../interfaces/usuario';

const TOKEN_KEY = 'pilarDeOro_token';
const USUARIO_KEY = 'pilarDeOro_usuario';

@Injectable({ providedIn: 'root' })
export class AuthService {
	private router = inject(Router);
	private loginService = inject(LoginService);
	private platformId = inject(PLATFORM_ID);

	private esNavegador = isPlatformBrowser(this.platformId);

	private tokenSignal = signal<string | null>(
		this.esNavegador ? localStorage.getItem(TOKEN_KEY) : null
	);
	private usuarioSignal = signal<Usuario | null>(this.leerUsuarioGuardado());

	token = this.tokenSignal.asReadonly();
	usuarioActual = this.usuarioSignal.asReadonly();

	estaLogueado = computed(() => !!this.tokenSignal());
	esAdmin = computed(() => this.usuarioSignal()?.rol === 'administrador');

	login(credenciales: Credenciales) {
		return this.loginService.login(credenciales).pipe(
			tap((respuesta: RespuestaLogin) => {
				this.guardarSesion(respuesta.token, respuesta.datos);
			})
		);
	}

	logout() {
		this.tokenSignal.set(null);
		this.usuarioSignal.set(null);

		if (this.esNavegador) {
			localStorage.removeItem(TOKEN_KEY);
			localStorage.removeItem(USUARIO_KEY);
		}

		this.router.navigate(['/']);
	}

	private guardarSesion(token: string, usuario: Usuario) {
		this.tokenSignal.set(token);
		this.usuarioSignal.set(usuario);

		if (this.esNavegador) {
			localStorage.setItem(TOKEN_KEY, token);
			localStorage.setItem(USUARIO_KEY, JSON.stringify(usuario));
		}
	}

	private leerUsuarioGuardado(): Usuario | null {
		if (!this.esNavegador) return null;
		const guardado = localStorage.getItem(USUARIO_KEY);
		return guardado ? JSON.parse(guardado) : null;
	}
}