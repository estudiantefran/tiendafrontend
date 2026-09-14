import { Component, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { PedidoService } from '../../services/pedido.service';
import { AuthService } from '../../services/auth.service';

const COSTO_ENVIO = 8000;

@Component({
	imports: [FormsModule, RouterLink],
	selector: 'app-carrito',
	styleUrl: './carrito.css',
	templateUrl: './carrito.html',
})
export class Carrito {
	cartService = inject(CartService);
	authService = inject(AuthService);
	private pedidoService = inject(PedidoService);
	private router = inject(Router);

	metodoPago = signal('Contraentrega');

	direccionEnvio = {
		departamento: this.authService.usuarioActual()?.direccion?.departamento ?? '',
		ciudad: this.authService.usuarioActual()?.direccion?.ciudad ?? '',
		barrio: this.authService.usuarioActual()?.direccion?.barrio ?? '',
		direccion: this.authService.usuarioActual()?.direccion?.direccion ?? ''
	};

	envio = computed(() => (this.cartService.items().length > 0 ? COSTO_ENVIO : 0));
	total = computed(() => this.cartService.subtotal() + this.envio());

	cargando = signal(false);
	error = signal<string | null>(null);
	pedidoConfirmado = signal(false);

	aumentarCantidad(productoId: string, presentacionId: string, cantidadActual: number) {
		this.cartService.actualizarCantidad(productoId, presentacionId, cantidadActual + 1);
	}

	disminuirCantidad(productoId: string, presentacionId: string, cantidadActual: number) {
		this.cartService.actualizarCantidad(productoId, presentacionId, cantidadActual - 1);
	}

	quitarItem(productoId: string, presentacionId: string) {
		this.cartService.quitarItem(productoId, presentacionId);
	}

	confirmarPedido() {
		const { departamento, ciudad, direccion } = this.direccionEnvio;

		if (!departamento.trim() || !ciudad.trim() || !direccion.trim()) {
			this.error.set('Departamento, ciudad y dirección son obligatorios.');
			return;
		}

		if (this.cartService.items().length === 0) {
			this.error.set('Tu carrito está vacío.');
			return;
		}

		this.cargando.set(true);
		this.error.set(null);

		this.pedidoService.registrarPedido({
			productos: this.cartService.obtenerProductosParaPedido(),
			envio: this.envio(),
			metodoPago: this.metodoPago(),
			direccionEnvio: this.direccionEnvio
		}).subscribe({
			next: () => {
				this.cargando.set(false);
				this.pedidoConfirmado.set(true);
				this.cartService.vaciarCarrito();

				setTimeout(() => {
					this.router.navigate(['/']);
				}, 2500);
			},
			error: (respuesta) => {
				this.cargando.set(false);
				this.error.set(respuesta.error?.mensaje || 'No se pudo registrar el pedido.');
			}
		});
	}
}