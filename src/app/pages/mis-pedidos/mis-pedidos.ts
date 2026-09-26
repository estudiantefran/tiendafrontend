import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido } from '../../interfaces/pedido';

@Component({
	imports: [RouterLink, DatePipe],
	selector: 'app-mis-pedidos',
	styleUrl: './mis-pedidos.css',
	templateUrl: './mis-pedidos.html',
})
export class MisPedidos implements OnInit {
	private pedidoService = inject(PedidoService);

	pedidos = signal<Pedido[]>([]);
	cargando = signal(true);
	cancelandoId = signal<string | null>(null);

	ngOnInit() {
		this.cargarPedidos();
	}

	cargarPedidos() {
		this.cargando.set(true);
		this.pedidoService.getMisPedidos().subscribe({
			next: (respuesta) => {
				// Más recientes primero
				const ordenados = [...respuesta.datos].sort((a, b) =>
					new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
				);
				this.pedidos.set(ordenados);
				this.cargando.set(false);
			},
			error: () => {
				this.pedidos.set([]);
				this.cargando.set(false);
			}
		});
	}

	puedeCancelar(pedido: Pedido): boolean {
		return pedido.estado === 'Pendiente' || pedido.estado === 'Preparando';
	}

	cancelarPedido(pedido: Pedido) {
		if (!pedido._id) return;

		const confirmar = confirm('¿Seguro que quieres cancelar este pedido?');
		if (!confirmar) return;

		this.cancelandoId.set(pedido._id);

		this.pedidoService.cancelarPedido(pedido._id).subscribe({
			next: () => {
				this.cancelandoId.set(null);
				this.cargarPedidos();
			},
			error: () => {
				this.cancelandoId.set(null);
				alert('No se pudo cancelar el pedido.');
			}
		});
	}

	nombreProducto(item: any): string {
		return typeof item.producto === 'object' ? item.producto?.nombre : 'Producto';
	}

	claseEstado(estado?: string): string {
		switch (estado) {
			case 'Entregado': return 'estado-entregado';
			case 'Cancelado': return 'estado-cancelado';
			case 'Enviado': return 'estado-enviado';
			case 'Preparando': return 'estado-preparando';
			default: return 'estado-pendiente';
		}
	}
}