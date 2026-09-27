import { Component, inject, signal, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoriaService } from '../../services/categoria.service';
import { Categoria } from '../../interfaces/categoria';
import { ToastService } from '../../services/toast';

@Component({
	imports: [FormsModule],
	selector: 'app-admin-categorias',
	styleUrl: './admin-categorias.css',
	templateUrl: './admin-categorias.html',
})
export class AdminCategorias implements OnInit {
	private categoriaService = inject(CategoriaService);
	private toastService = inject(ToastService);

	categorias = signal<Categoria[]>([]);
	cargando = signal(true);
	error = signal<string | null>(null);
	guardando = signal(false);

	// Formulario de creación
	nuevaCategoria: Partial<Categoria> = { nombre: '', descripcion: '', imagen: '' };
	mostrarFormulario = signal(false);

	// Edición inline
	idEnEdicion = signal<string | null>(null);
	borradorEdicion: Partial<Categoria> = {};

	ngOnInit() {
		this.cargarCategorias();
	}

	cargarCategorias() {
		this.cargando.set(true);
		this.categoriaService.mostrarCategoriasAdmin().subscribe({
			next: (respuesta) => {
				this.categorias.set(respuesta.datos);
				this.cargando.set(false);
			},
			error: () => {
				this.error.set('No se pudieron cargar las categorías.');
				this.cargando.set(false);
			}
		});
	}

	crearCategoria() {
		if (!this.nuevaCategoria.nombre?.trim()) {
			this.error.set('El nombre es obligatorio.');
			return;
		}

		this.guardando.set(true);
		this.error.set(null);

		this.categoriaService.registrarCategoria(this.nuevaCategoria).subscribe({
			next: () => {
				this.guardando.set(false);
				this.nuevaCategoria = { nombre: '', descripcion: '', imagen: '' };
				this.mostrarFormulario.set(false);
				this.toastService.exito('Categoría creada correctamente.');
				this.cargarCategorias();
			},
			error: (respuesta) => {
				this.guardando.set(false);
				this.error.set(respuesta.error?.mensaje || 'No se pudo crear la categoría.');
			}
		});
	}

	iniciarEdicion(categoria: Categoria) {
		this.idEnEdicion.set(categoria._id ?? null);
		this.borradorEdicion = {
			nombre: categoria.nombre,
			descripcion: categoria.descripcion,
			imagen: categoria.imagen
		};
	}

	cancelarEdicion() {
		this.idEnEdicion.set(null);
		this.borradorEdicion = {};
	}

	guardarEdicion(id: string) {
		this.guardando.set(true);
		this.categoriaService.actualizarCategoria(id, this.borradorEdicion).subscribe({
			next: () => {
				this.guardando.set(false);
				this.cancelarEdicion();
				this.toastService.exito('Categoría actualizada correctamente.');
				this.cargarCategorias();
			},
			error: (respuesta) => {
				this.guardando.set(false);
				this.error.set(respuesta.error?.mensaje || 'No se pudo actualizar la categoría.');
			}
		});
	}

	toggleEstado(categoria: Categoria) {
		if (!categoria._id) return;

		if (categoria.estado) {
			// Desactivar: usa el endpoint de "eliminar" (soft delete)
			this.categoriaService.eliminarCategoria(categoria._id).subscribe({
				next: () => {
					this.toastService.info('Categoría desactivada.');
					this.cargarCategorias();
				},
				error: (respuesta) => this.error.set(respuesta.error?.mensaje || 'No se pudo desactivar.')
			});
		} else {
			// Reactivar: se hace con un PUT normal
			this.categoriaService.actualizarCategoria(categoria._id, { estado: true }).subscribe({
				next: () => {
					this.toastService.exito('Categoría reactivada.');
					this.cargarCategorias();
				},
				error: () => this.error.set('No se pudo reactivar la categoría.')
			});
		}
	}
}