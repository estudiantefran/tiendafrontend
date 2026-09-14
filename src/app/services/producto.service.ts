import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Producto, Presentacion } from '../interfaces/producto';

export interface FiltrosProductos {
	categoria?: string;
	buscar?: string;
	page?: number;
	limit?: number;
}

export interface RespuestaProductos {
	mensaje: string;
	datos: Producto[];
	paginacion: {
		total: number;
		paginaActual: number;
		totalPaginas: number;
		porPagina: number;
	};
}

@Injectable({ providedIn: 'root' })
export class ProductoService {
	http = inject(HttpClient);
	URL_producto = environment.apiUrl + '/productos';

	registrarProducto(producto: Partial<Producto>) {
		return this.http.post(this.URL_producto + '/crearproducto', producto);
	}

	mostrarProductos(filtros?: FiltrosProductos) {
		let params = new HttpParams();

		if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
		if (filtros?.buscar) params = params.set('buscar', filtros.buscar);
		if (filtros?.page) params = params.set('page', filtros.page);
		if (filtros?.limit) params = params.set('limit', filtros.limit);

		return this.http.get<RespuestaProductos>(this.URL_producto + '/mostrarproducto', { params });
	}

	actualizarProducto(id: string, productoActualizado: Partial<Producto>) {
		return this.http.put(this.URL_producto + '/actualizarproducto/' + id, productoActualizado);
	}

	eliminarProducto(id: string) {
		return this.http.delete(this.URL_producto + '/eliminarproducto/' + id);
	}

	agregarPresentacion(productoId: string, presentacion: Partial<Presentacion>) {
		return this.http.post(this.URL_producto + '/' + productoId + '/presentaciones', presentacion);
	}

	actualizarPresentacion(productoId: string, presentacionId: string, cambios: Partial<Presentacion>) {
		return this.http.put(
			this.URL_producto + '/' + productoId + '/presentaciones/' + presentacionId,
			cambios
		);
	}

	eliminarPresentacion(productoId: string, presentacionId: string) {
		return this.http.delete(
			this.URL_producto + '/' + productoId + '/presentaciones/' + presentacionId
		);
	}
}