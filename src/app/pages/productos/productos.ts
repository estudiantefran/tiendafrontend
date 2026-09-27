import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CartService } from '../../services/cart.service';
import { ToastService } from '../../services/toast';
import { Producto, Presentacion } from '../../interfaces/producto';
import { Categoria } from '../../interfaces/categoria';

const TAMANOS_DISPONIBLES = ['50g', '100g', '250g', '500g'];

export interface TarjetaProducto {
	producto: Producto;
	presentacion: Presentacion;
}

@Component({
	imports: [],
	selector: 'app-productos',
	styleUrl: './productos.css',
	templateUrl: './productos.html',
})
export class Productos implements OnInit {
	private productoService = inject(ProductoService);
	private categoriaService = inject(CategoriaService);
	private cartService = inject(CartService);
	private toastService = inject(ToastService);
	private route = inject(ActivatedRoute);

	categorias = signal<Categoria[]>([]);
	productos = signal<Producto[]>([]);
	cargando = signal(true);

	categoriaSeleccionada = signal<string | null>(null);
	tamanosSeleccionados = signal<Set<string>>(new Set());
	terminoBusqueda = signal<string | null>(null);

	tamanosDisponibles = TAMANOS_DISPONIBLES;

	paginaActual = signal(1);
	totalPaginas = signal(1);

	// Cada presentación activa se convierte en su propia tarjeta, en vez de
	// agrupar todas las presentaciones de un producto bajo un selector.
	tarjetas = computed<TarjetaProducto[]>(() => {
		const tamanos = this.tamanosSeleccionados();
		const resultado: TarjetaProducto[] = [];

		for (const producto of this.productos()) {
			for (const presentacion of producto.presentaciones ?? []) {
				if (!presentacion.estado) continue;
				if (tamanos.size > 0 && !tamanos.has(presentacion.peso)) continue;
				resultado.push({ producto, presentacion });
			}
		}

		return resultado;
	});

	ngOnInit() {
		this.route.queryParams.subscribe((params) => {
			this.terminoBusqueda.set(params['buscar'] || null);
			this.categoriaSeleccionada.set(params['categoria'] || null);
			this.cargarProductos();
		});

		this.categoriaService.mostrarCategorias().subscribe({
			next: (respuesta) => this.categorias.set(respuesta.datos),
			error: () => this.categorias.set([])
		});
	}

	cargarProductos() {
		this.cargando.set(true);

		this.productoService.mostrarProductos({
			categoria: this.categoriaSeleccionada() ?? undefined,
			buscar: this.terminoBusqueda() ?? undefined,
			page: this.paginaActual(),
			limit: 9
		}).subscribe({
			next: (respuesta) => {
				this.productos.set(respuesta.datos);
				this.totalPaginas.set(respuesta.paginacion.totalPaginas);
				this.cargando.set(false);
			},
			error: () => {
				this.productos.set([]);
				this.cargando.set(false);
			}
		});
	}

	filtrarPorCategoria(categoriaId: string | null) {
		this.categoriaSeleccionada.set(categoriaId);
		this.paginaActual.set(1);
		this.cargarProductos();
	}

	toggleTamano(tamano: string) {
		const actuales = new Set(this.tamanosSeleccionados());
		actuales.has(tamano) ? actuales.delete(tamano) : actuales.add(tamano);
		this.tamanosSeleccionados.set(actuales);
	}

	tamanoActivo(tamano: string): boolean {
		return this.tamanosSeleccionados().has(tamano);
	}

	agregarAlCarrito(tarjeta: TarjetaProducto) {
		const { producto, presentacion } = tarjeta;
		if (!producto._id || !presentacion._id) return;

		this.cartService.agregarItem({
			productoId: producto._id,
			presentacionId: presentacion._id,
			nombre: producto.nombre,
			peso: presentacion.peso,
			precio: presentacion.precio,
			imagen: producto.imagenes?.[0],
			cantidad: 1
		});
		this.toastService.exito(`${producto.nombre} se agregó al carrito.`);
	}

	cambiarPagina(nuevaPagina: number) {
		if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas()) return;
		this.paginaActual.set(nuevaPagina);
		this.cargarProductos();
	}
}