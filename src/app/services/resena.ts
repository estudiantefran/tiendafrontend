import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Resena } from '../interfaces/resena';

@Injectable({ providedIn: 'root' })
export class ResenaService {
	http = inject(HttpClient);
	URL_resena = environment.apiUrl + '/resenas';

	mostrarResenas() {
		return this.http.get<{ mensaje: string; datos: Resena[] }>(this.URL_resena);
	}

	crearResena(resena: { producto: string; calificacion: number; comentario?: string }) {
		return this.http.post(this.URL_resena, resena);
	}

	actualizarResena(id: string, cambios: { calificacion?: number; comentario?: string }) {
		return this.http.put(this.URL_resena + '/' + id, cambios);
	}

	eliminarResena(id: string) {
		return this.http.delete(this.URL_resena + '/' + id);
	}
}