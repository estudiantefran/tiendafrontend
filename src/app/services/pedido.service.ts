import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Pedido, DireccionEnvio } from '../interfaces/pedido';

export interface ProductoParaCrearPedido {
	producto: string;
	presentacion: string;
	cantidad: number;
}

export interface CrearPedidoPayload {
	productos: ProductoParaCrearPedido[];
	envio?: number;
	metodoPago: string;
	direccionEnvio?: DireccionEnvio;
}

@Injectable({ providedIn: 'root' })
export class PedidoService {
	http = inject(HttpClient);
	URL_pedido = environment.apiUrl + '/pedidos';

	registrarPedido(pedido: CrearPedidoPayload) {
		return this.http.post(this.URL_pedido + '/agregarpedido', pedido);
	}

	mostrarPedidos() {
		return this.http.get<{ mensaje: string; datos: Pedido[] }>(
			this.URL_pedido + '/mostrarpedidos'
		);
	}

	getMisPedidos() {
		return this.http.get<{ mensaje: string; datos: Pedido[] }>(
			this.URL_pedido + '/mispedidos'
		);
	}

	actualizarPedido(id: string, pedidoActualizado: Partial<Pedido>) {
		return this.http.put(this.URL_pedido + '/actualizarpedido/' + id, pedidoActualizado);
	}

	cancelarPedido(id: string) {
		return this.http.patch(this.URL_pedido + '/cancelarpedido/' + id, {});
	}
}