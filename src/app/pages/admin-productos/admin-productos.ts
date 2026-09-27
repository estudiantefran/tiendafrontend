import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ProductoService } from '../../services/producto.service';
import { CategoriaService } from '../../services/categoria.service';
import { Producto, Presentacion } from '../../interfaces/producto';
import { Categoria } from '../../interfaces/categoria';
import { ToastService } from '../../services/toast';

interface PresentacionForm {
	peso: string;
	precio: number | null;
	stockActual: number | null;
}

@Component({
	imports: [FormsModule],
	selector: 'app-admin-productos',
	styleUrl: './admin-productos.css',
	templateUrl: './admin-productos.html',
})
export class AdminProductos implements OnInit {
	private productoService = inject(ProductoService);
	private categoriaService = inject(CategoriaService);
	private toastService = inject(ToastService);

	productos = signal<Producto[]>([]);
	categorias = signal<Categoria[]>([]);
	cargando = signal(true);
	error = signal<string | null>(null);
	guardando = signal(false);

	mostrarFormulario = signal(false);

	nuevoProducto: {
		nombre: string;
		descripcion: string;
		categoria: string;
		porcentajeCacao: string;
		imagenesTexto: string;
	} = { nombre: '', descripcion: '', categoria: '', porcentajeCacao: '', imagenesTexto: '' };

	presentacionesForm = signal<PresentacionForm[]>([this.presentacionVacia()]);

	// Controla qué producto tiene su panel de presentaciones desplegado
	productoExpandido = signal<string | null>(null);

	// Edición de imágenes de un producto existente
	imagenesEnEdicion = signal<string | null>(null);
	borradorImagenes = '';

	iniciarEdicionImagenes(producto: Producto) {
		this.imagenesEnEdicion.set(producto._id ?? null);
		this.borradorImagenes = (producto.imagenes ?? []).join(', ');
	}

	cancelarEdicionImagenes() {
		this.imagenesEnEdicion.set(null);
		this.borradorImagenes = '';
	}

	guardarImagenes(producto: Producto) {
		if (!producto._id) return;

		const imagenes = this.borradorImagenes
			.split(',')
			.map((url) => url.trim())
			.filter((url) => url.length > 0);

		this.guardando.set(true);

		this.productoService.actualizarProducto(producto._id, { imagenes } as Partial<Producto>).subscribe({
			next: () => {
				this.guardando.set(false);
				this.cancelarEdicionImagenes();
					this.toastService.exito('Imágenes actualizadas correctamente.');
				this.cargarProductos();
			},
			error: () => {
				this.guardando.set(false);
				this.error.set('No se pudieron actualizar las imágenes.');
			}
		});
	}

	// Formulario para agregar una presentación nueva a un producto existente
	nuevaPresentacion: PresentacionForm = this.presentacionVacia();

	ngOnInit() {
		this.cargarProductos();
		this.categoriaService.mostrarCategorias().subscribe({
			next: (respuesta) => this.categorias.set(respuesta.datos),
			error: () => this.categorias.set([])
		});
	}

	private presentacionVacia(): PresentacionForm {
		return { peso: '', precio: null, stockActual: null };
	}

	cargarProductos() {
		this.cargando.set(true);
		this.productoService.mostrarProductosAdmin().subscribe({
			next: (respuesta) => {
				this.productos.set(respuesta.datos);
				this.cargando.set(false);
			},
			error: () => {
				this.error.set('No se pudieron cargar los productos.');
				this.cargando.set(false);
			}
		});
	}

	agregarFilaPresentacion() {
		this.presentacionesForm.set([...this.presentacionesForm(), this.presentacionVacia()]);
	}

	quitarFilaPresentacion(index: number) {
		const actuales = this.presentacionesForm().filter((_, i) => i !== index);
		this.presentacionesForm.set(actuales.length > 0 ? actuales : [this.presentacionVacia()]);
	}

	crearProducto() {
		const { nombre, descripcion, categoria } = this.nuevoProducto;

		if (!nombre.trim() || !descripcion.trim() || !categoria) {
			this.error.set('Nombre, descripción y categoría son obligatorios.');
			return;
		}

		const presentacionesValidas = this.presentacionesForm().filter(
			(p) => p.peso.trim() && p.precio !== null
		);

		if (presentacionesValidas.length === 0) {
			this.error.set('Agrega al menos una presentación con peso y precio.');
			return;
		}

		this.guardando.set(true);
		this.error.set(null);

		const imagenes = this.nuevoProducto.imagenesTexto
			.split(',')
			.map((url) => url.trim())
			.filter((url) => url.length > 0);

		const { imagenesTexto, ...datosBasicos } = this.nuevoProducto;

		this.productoService.registrarProducto({
			...datosBasicos,
			imagenes,
			presentaciones: presentacionesValidas.map((p) => ({
				peso: p.peso,
				precio: p.precio!,
				stockActual: p.stockActual ?? 0
			})) as Presentacion[]
		}).subscribe({
			next: () => {
				this.guardando.set(false);
				this.nuevoProducto = { nombre: '', descripcion: '', categoria: '', porcentajeCacao: '', imagenesTexto: '' };
				this.presentacionesForm.set([this.presentacionVacia()]);
				this.mostrarFormulario.set(false);
				this.toastService.exito('Producto creado correctamente.');
				this.cargarProductos();
			},
			error: (respuesta) => {
				this.guardando.set(false);
				this.error.set(respuesta.error?.mensaje || 'No se pudo crear el producto.');
			}
		});
	}

	toggleEstado(producto: Producto) {
		if (!producto._id) return;

		if (producto.estado) {
			this.productoService.eliminarProducto(producto._id).subscribe({
				next: () => {
					this.toastService.info('Producto desactivado.');
					this.cargarProductos();
				},
				error: () => this.error.set('No se pudo desactivar el producto.')
			});
		} else {
			this.productoService.actualizarProducto(producto._id, { estado: true } as Partial<Producto>).subscribe({
				next: () => {
					this.toastService.exito('Producto reactivado.');
					this.cargarProductos();
				},
				error: () => this.error.set('No se pudo reactivar el producto.')
			});
		}
	}

	toggleExpandir(productoId: string) {
		this.productoExpandido.set(this.productoExpandido() === productoId ? null : productoId);
		this.nuevaPresentacion = this.presentacionVacia();
	}

	agregarPresentacion(producto: Producto) {
		if (!producto._id || !this.nuevaPresentacion.peso.trim() || this.nuevaPresentacion.precio === null) {
			this.error.set('Indica peso y precio para la nueva presentación.');
			return;
		}

		this.guardando.set(true);

		this.productoService.agregarPresentacion(producto._id, {
			peso: this.nuevaPresentacion.peso,
			precio: this.nuevaPresentacion.precio,
			stockActual: this.nuevaPresentacion.stockActual ?? 0
		}).subscribe({
			next: () => {
				this.guardando.set(false);
				this.nuevaPresentacion = this.presentacionVacia();
				this.toastService.exito('Presentación agregada correctamente.');
				this.cargarProductos();
			},
			error: (respuesta) => {
				this.guardando.set(false);
				this.error.set(respuesta.error?.mensaje || 'No se pudo agregar la presentación.');
			}
		});
	}

	actualizarStock(producto: Producto, presentacion: Presentacion, nuevoStock: number) {
		if (!producto._id || !presentacion._id) return;

		this.productoService.actualizarPresentacion(producto._id, presentacion._id, {
			stockActual: nuevoStock
		}).subscribe({
			next: () => {
				this.toastService.exito('Stock actualizado correctamente.');
				this.cargarProductos();
			},
			error: () => this.error.set('No se pudo actualizar el stock.')
		});
	}

	actualizarPrecio(producto: Producto, presentacion: Presentacion, nuevoPrecio: number) {
		if (!producto._id || !presentacion._id) return;

		this.productoService.actualizarPresentacion(producto._id, presentacion._id, {
			precio: nuevoPrecio
		}).subscribe({
			next: () => {
				this.toastService.exito('Precio actualizado correctamente.');
				this.cargarProductos();
			},
			error: () => this.error.set('No se pudo actualizar el precio.')
		});
	}

	togglePresentacionEstado(producto: Producto, presentacion: Presentacion) {
		if (!producto._id || !presentacion._id) return;

		if (presentacion.estado) {
			this.productoService.eliminarPresentacion(producto._id, presentacion._id).subscribe({
				next: () => {
					this.toastService.info('Presentación desactivada.');
					this.cargarProductos();
				},
				error: () => this.error.set('No se pudo desactivar la presentación.')
			});
		} else {
			this.productoService.actualizarPresentacion(producto._id, presentacion._id, { estado: true }).subscribe({
				next: () => {
					this.toastService.exito('Presentación reactivada.');
					this.cargarProductos();
				},
				error: () => this.error.set('No se pudo reactivar la presentación.')
			});
		}
	}

	nombreCategoria(producto: Producto): string {
		if (typeof producto.categoria === 'object' && producto.categoria) {
			return producto.categoria.nombre;
		}
		return '—';
	}
}