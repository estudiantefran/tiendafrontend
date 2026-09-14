import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Categoria } from '../interfaces/categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
	http = inject(HttpClient);
	URL_categoria = environment.apiUrl + '/categorias';

	mostrarCategorias() {
		return this.http.get<{ mensaje: string; datos: Categoria[] }>(
			this.URL_categoria + '/mostrarcategoria'
		);
	}

	registrarCategoria(categoria: Categoria) {
		return this.http.post(this.URL_categoria + '/crearcategoria', categoria);
	}

	actualizarCategoria(id: string, categoriaActualizada: Categoria) {
		return this.http.put(this.URL_categoria + '/actualizarcategoria/' + id, categoriaActualizada);
	}

	eliminarCategoria(id: string) {
		return this.http.delete(this.URL_categoria + '/eliminarcategoria/' + id);
	}
}