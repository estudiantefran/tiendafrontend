import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Producto } from '../interfaces/producto';

@Injectable({ providedIn: 'root' })
export class FavoritoService {
	http = inject(HttpClient);
	URL_favorito = environment.apiUrl + '/favoritos';

	agregarFavorito(producto: string) {
		return this.http.post(this.URL_favorito + '/agregarfavorito', { producto });
	}

	quitarFavorito(productoId: string) {
		return this.http.delete(this.URL_favorito + '/eliminarfavorito/' + productoId);
	}

	mostrarMisFavoritos() {
		return this.http.get<{ mensaje: string; datos: Producto[] }>(
			this.URL_favorito + '/mostrarfavoritos'
		);
	}
}