import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { PedidoService } from '../../services/pedido.service';
import { Pedido, EstadoPedido, EstadoPago } from '../../interfaces/pedido';
import { ToastService } from '../../services/toast';

const ESTADOS_PEDIDO: EstadoPedido[] = ['Pendiente', 'Preparando', 'Enviado', 'Entregado', 'Cancelado'];
const ESTADOS_PAGO: EstadoPago[] = ['Pendiente', 'Aprobado', 'Rechazado', 'Reembolsado'];

@Component({
	imports: [FormsModule, DatePipe],
	selector: 'app-admin-pedidos',
	styleUrl: './admin-pedidos.css',
	templateUrl: './admin-pedidos.html',
})
export class AdminPedidos implements OnInit {
	private pedidoService = inject(PedidoService);
	private toastService = inject(ToastService);

	pedidos = signal<Pedido[]>([]);
	cargando = signal(true);
	error = signal<string | null>(null);
	guardandoId = signal<string | null>(null);

	estadosPedido = ESTADOS_PEDIDO;
	estadosPago = ESTADOS_PAGO;

	// Filtro rápido por estado
	filtroEstado = signal<EstadoPedido | 'Todos'>('Todos');

	ngOnInit() {
		this.cargarPedidos();
	}

	cargarPedidos() {
		this.cargando.set(true);
		this.pedidoService.mostrarPedidos().subscribe({
			next: (respuesta) => {
				const ordenados = [...respuesta.datos].sort((a, b) =>
					new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime()
				);
				this.pedidos.set(ordenados);
				this.cargando.set(false);
			},
			error: () => {
				this.error.set('No se pudieron cargar los pedidos.');
				this.cargando.set(false);
			}
		});
	}

	pedidosFiltrados(): Pedido[] {
		if (this.filtroEstado() === 'Todos') return this.pedidos();
		return this.pedidos().filter((p) => p.estado === this.filtroEstado());
	}

	cambiarEstado(pedido: Pedido, nuevoEstado: EstadoPedido) {
		if (!pedido._id) return;
		this.guardandoId.set(pedido._id);

		this.pedidoService.actualizarPedido(pedido._id, { estado: nuevoEstado }).subscribe({
			next: () => {
				this.guardandoId.set(null);
				this.toastService.exito(`Estado del pedido actualizado a ${nuevoEstado}.`);
				this.cargarPedidos();
			},
			error: () => {
				this.guardandoId.set(null);
				this.error.set('No se pudo actualizar el estado del pedido.');
			}
		});
	}

	cambiarEstadoPago(pedido: Pedido, nuevoEstadoPago: EstadoPago) {
		if (!pedido._id) return;
		this.guardandoId.set(pedido._id);

		this.pedidoService.actualizarPedido(pedido._id, { estadoPago: nuevoEstadoPago }).subscribe({
			next: () => {
				this.guardandoId.set(null);
				this.toastService.exito(`Estado de pago actualizado a ${nuevoEstadoPago}.`);
				this.cargarPedidos();
			},
			error: () => {
				this.guardandoId.set(null);
				this.error.set('No se pudo actualizar el estado de pago.');
			}
		});
	}

	nombreCliente(pedido: Pedido): string {
		return typeof pedido.usuario === 'object' ? pedido.usuario?.nombre : 'Cliente';
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