import { Injectable, signal } from '@angular/core';

export type TipoToast = 'exito' | 'error' | 'info';

export interface Toast {
	id: number;
	mensaje: string;
	tipo: TipoToast;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
	private contador = 0;
	toasts = signal<Toast[]>([]);

	mostrar(mensaje: string, tipo: TipoToast = 'info', duracionMs = 3500) {
		const id = ++this.contador;
		this.toasts.set([...this.toasts(), { id, mensaje, tipo }]);

		setTimeout(() => this.cerrar(id), duracionMs);
	}

	exito(mensaje: string) {
		this.mostrar(mensaje, 'exito');
	}

	error(mensaje: string) {
		this.mostrar(mensaje, 'error');
	}

	info(mensaje: string) {
		this.mostrar(mensaje, 'info');
	}

	cerrar(id: number) {
		this.toasts.set(this.toasts().filter((t) => t.id !== id));
	}
}