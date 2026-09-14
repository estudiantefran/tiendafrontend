import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Usuario } from '../interfaces/usuario';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
	http = inject(HttpClient);
	URL_usuario = environment.apiUrl + '/usuarios';

	mostrarUsuarios() {
		return this.http.get<{ mensaje: string; datos: Usuario[] }>(
			this.URL_usuario + '/mostrar'
		);
	}

	actualizarUsuario(id: string, usuarioActualizado: Partial<Usuario> & { password?: string }) {
		return this.http.put(this.URL_usuario + '/modificar/' + id, usuarioActualizado);
	}

	eliminarUsuario(id: string) {
		return this.http.delete(this.URL_usuario + '/eliminar/' + id);
	}

	crearAdministrador(usuario: Partial<Usuario> & { password: string }) {
		return this.http.post(this.URL_usuario + '/admin', usuario);
	}
}