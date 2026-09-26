import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Categoria } from '../interfaces/categoria';

@Injectable({ providedIn: 'root' })
export class CategoriaService {
	http = inject(HttpClient);
	URL_categoria = environment.apiUrl + '/categorias';

	// Pública: solo categorías activas
	mostrarCategorias() {
		return this.http.get<{ mensaje: string; datos: Categoria[] }>(
			this.URL_categoria + '/mostrarcategoria'
		);
	}

	// Admin: todas las categorías, activas e inactivas
	mostrarCategoriasAdmin() {
		return this.http.get<{ mensaje: string; datos: Categoria[] }>(
			this.URL_categoria + '/mostrarcategoria/admin'
		);
	}

	registrarCategoria(categoria: Partial<Categoria>) {
		return this.http.post(this.URL_categoria + '/crearcategoria', categoria);
	}

	actualizarCategoria(id: string, categoriaActualizada: Partial<Categoria>) {
		return this.http.put(this.URL_categoria + '/actualizarcategoria/' + id, categoriaActualizada);
	}

	// Soft delete (desactivar) en el backend
	eliminarCategoria(id: string) {
		return this.http.delete(this.URL_categoria + '/eliminarcategoria/' + id);
	}
}