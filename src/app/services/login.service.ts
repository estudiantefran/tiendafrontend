import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Credenciales } from '../interfaces/credenciales';
import { Usuario } from '../interfaces/usuario';

export interface RespuestaLogin {
	mensaje: string;
	token: string;
	datos: Usuario;
}

@Injectable({ providedIn: 'root' })
export class LoginService {
	http = inject(HttpClient);
	URL_usuario = environment.apiUrl + '/usuarios';

	login(credenciales: Credenciales) {
		return this.http.post<RespuestaLogin>(this.URL_usuario + '/login', credenciales);
	}

	registrar(usuario: Partial<Usuario> & { password: string }) {
		return this.http.post(this.URL_usuario + '/crear', usuario);
	}
}