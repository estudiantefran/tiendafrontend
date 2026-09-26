import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CategoriaService } from '../../services/categoria.service';
import { ProductoService } from '../../services/producto.service';
import { FavoritoService } from '../../services/favorito.service';
import { AuthService } from '../../services/auth.service';
import { Categoria } from '../../interfaces/categoria';
import { Producto } from '../../interfaces/producto';

interface Slide {
	titulo: string;
	subtitulo: string;
	imagen?: string;
}

@Component({
	imports: [RouterLink],
	selector: 'app-inicio',
	styleUrl: './inicio.css',
	templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
	private categoriaService = inject(CategoriaService);
	private productoService = inject(ProductoService);
	private favoritoService = inject(FavoritoService);
	authService = inject(AuthService);

	categorias = signal<Categoria[]>([]);
	productosDestacados = signal<Producto[]>([]);
	favoritosIds = signal<Set<string>>(new Set());

	slides: Slide[] = [
		{
			titulo: 'Tradición hecha chocolate',
			subtitulo: 'Cacao artesanal, técnicas tradicionales, sabor único.',
			imagen: 'https://res.cloudinary.com/ahgdoqw3/image/upload/v1790203219/imagen1.webp'
		},
		{
			titulo: 'Línea Gourmet 70%+',
			subtitulo: 'Cacao de origen cordobés, tostado a la manera tradicional.',
			imagen: 'https://res.cloudinary.com/ahgdoqw3/image/upload/v1790203233/imagen2.webp'
		},
		{
			titulo: 'Envíos a toda Colombia',
			subtitulo: 'Del pueblo a tu mesa, sin perder el sabor artesanal.',
			imagen: 'https://res.cloudinary.com/ahgdoqw3/image/upload/v1790203219/imagen1.webp'
		},
	];
	slideActual = signal(0);

	ngOnInit() {
		this.cargarCategorias();
		this.cargarDestacados();
		this.cargarFavoritos();

		setInterval(() => this.siguienteSlide(), 6000);
	}

	private cargarCategorias() {
		this.categoriaService.mostrarCategorias().subscribe({
			next: (respuesta) => this.categorias.set(respuesta.datos),
			error: () => this.categorias.set([])
		});
	}

	private cargarDestacados() {
		this.productoService.mostrarProductos({ limit: 4 }).subscribe({
			next: (respuesta) => this.productosDestacados.set(respuesta.datos),
			error: () => this.productosDestacados.set([])
		});
	}

	private cargarFavoritos() {
		if (!this.authService.estaLogueado()) return;

		this.favoritoService.mostrarMisFavoritos().subscribe({
			next: (respuesta) => {
				const ids = respuesta.datos.map((producto) => producto._id!).filter(Boolean);
				this.favoritosIds.set(new Set(ids));
			},
			error: () => this.favoritosIds.set(new Set())
		});
	}

	esFavorito(productoId?: string): boolean {
		return productoId ? this.favoritosIds().has(productoId) : false;
	}

	toggleFavorito(producto: Producto) {
		if (!producto._id) return;

		if (!this.authService.estaLogueado()) {
			return; // El header ya ofrece el link de login; aquí no hacemos nada sin sesión.
		}

		const id = producto._id;
		const yaEsFavorito = this.esFavorito(id);

		const actualizar = (agregar: boolean) => {
			const actuales = new Set(this.favoritosIds());
			agregar ? actuales.add(id) : actuales.delete(id);
			this.favoritosIds.set(actuales);
		};

		if (yaEsFavorito) {
			this.favoritoService.quitarFavorito(id).subscribe({ next: () => actualizar(false) });
		} else {
			this.favoritoService.agregarFavorito(id).subscribe({ next: () => actualizar(true) });
		}
	}

	precioDesde(producto: Producto): number | null {
		if (!producto.presentaciones || producto.presentaciones.length === 0) return null;
		return Math.min(...producto.presentaciones.map((p) => p.precio));
	}

	siguienteSlide() {
		this.slideActual.set((this.slideActual() + 1) % this.slides.length);
	}

	anteriorSlide() {
		this.slideActual.set((this.slideActual() - 1 + this.slides.length) % this.slides.length);
	}

	irASlide(indice: number) {
		this.slideActual.set(indice);
	}
}