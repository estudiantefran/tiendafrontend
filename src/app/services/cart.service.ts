import { Injectable, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface CartItem {
	productoId: string;
	presentacionId: string;
	nombre: string;
	peso: string;
	precio: number;
	imagen?: string;
	cantidad: number;
}

const CARRITO_KEY = 'pilarDeOro_carrito';

@Injectable({ providedIn: 'root' })
export class CartService {
	private platformId = inject(PLATFORM_ID);
	private esNavegador = isPlatformBrowser(this.platformId);

	private itemsSignal = signal<CartItem[]>(this.leerCarritoGuardado());

	items = this.itemsSignal.asReadonly();

	cantidadTotal = computed(() =>
		this.itemsSignal().reduce((total, item) => total + item.cantidad, 0)
	);

	subtotal = computed(() =>
		this.itemsSignal().reduce((total, item) => total + item.precio * item.cantidad, 0)
	);

	agregarItem(nuevoItem: CartItem) {
		const items = this.itemsSignal();
		const existente = items.find(
			(item) =>
				item.productoId === nuevoItem.productoId &&
				item.presentacionId === nuevoItem.presentacionId
		);

		let actualizados: CartItem[];

		if (existente) {
			actualizados = items.map((item) =>
				item === existente
					? { ...item, cantidad: item.cantidad + nuevoItem.cantidad }
					: item
			);
		} else {
			actualizados = [...items, nuevoItem];
		}

		this.actualizarEstado(actualizados);
	}

	actualizarCantidad(productoId: string, presentacionId: string, cantidad: number) {
		if (cantidad < 1) {
			this.quitarItem(productoId, presentacionId);
			return;
		}

		const actualizados = this.itemsSignal().map((item) =>
			item.productoId === productoId && item.presentacionId === presentacionId
				? { ...item, cantidad }
				: item
		);

		this.actualizarEstado(actualizados);
	}

	quitarItem(productoId: string, presentacionId: string) {
		const actualizados = this.itemsSignal().filter(
			(item) => !(item.productoId === productoId && item.presentacionId === presentacionId)
		);
		this.actualizarEstado(actualizados);
	}

	vaciarCarrito() {
		this.actualizarEstado([]);
	}

	obtenerProductosParaPedido() {
		return this.itemsSignal().map((item) => ({
			producto: item.productoId,
			presentacion: item.presentacionId,
			cantidad: item.cantidad
		}));
	}

	private actualizarEstado(items: CartItem[]) {
		this.itemsSignal.set(items);
		if (this.esNavegador) {
			localStorage.setItem(CARRITO_KEY, JSON.stringify(items));
		}
	}

	private leerCarritoGuardado(): CartItem[] {
		if (!this.esNavegador) return [];
		const guardado = localStorage.getItem(CARRITO_KEY);
		return guardado ? JSON.parse(guardado) : [];
	}
}