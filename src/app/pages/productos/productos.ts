import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { CartService } from '../../services/cart.service';
import { Producto, Presentacion } from '../../interfaces/producto';
import { Categoria } from '../../interfaces/categoria';

const TAMANOS_DISPONIBLES = ['50g', '100g', '250g', '500g'];

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

	presentacionElegida = signal<Record<string, string>>({});

	productosFiltrados = computed(() => {
		const tamanos = this.tamanosSeleccionados();
		if (tamanos.size === 0) return this.productos();

		return this.productos().filter((producto) =>
			producto.presentaciones?.some((p) => tamanos.has(p.peso))
		);
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
				this.inicializarPresentaciones(respuesta.datos);
				this.cargando.set(false);
			},
			error: () => {
				this.productos.set([]);
				this.cargando.set(false);
			}
		});
	}

	private inicializarPresentaciones(productos: Producto[]) {
		const mapa = { ...this.presentacionElegida() };
		for (const producto of productos) {
			if (producto._id && producto.presentaciones?.length && !mapa[producto._id]) {
				mapa[producto._id] = producto.presentaciones[0]._id!;
			}
		}
		this.presentacionElegida.set(mapa);
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

	seleccionarPresentacion(productoId: string, presentacionId: string) {
		this.presentacionElegida.set({ ...this.presentacionElegida(), [productoId]: presentacionId });
	}

	presentacionDe(producto: Producto): Presentacion | undefined {
		const id = producto._id ? this.presentacionElegida()[producto._id] : undefined;
		return producto.presentaciones?.find((p) => p._id === id) ?? producto.presentaciones?.[0];
	}

	agregarAlCarrito(producto: Producto) {
		const presentacion = this.presentacionDe(producto);
		if (!producto._id || !presentacion?._id) return;

		this.cartService.agregarItem({
			productoId: producto._id,
			presentacionId: presentacion._id,
			nombre: producto.nombre,
			peso: presentacion.peso,
			precio: presentacion.precio,
			imagen: producto.imagenes?.[0],
			cantidad: 1
		});
	}

	cambiarPagina(nuevaPagina: number) {
		if (nuevaPagina < 1 || nuevaPagina > this.totalPaginas()) return;
		this.paginaActual.set(nuevaPagina);
		this.cargarProductos();
	}
}