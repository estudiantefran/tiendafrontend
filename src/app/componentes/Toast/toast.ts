import { Component, inject } from '@angular/core';
import { ToastService } from '../../services/toast';

@Component({
	imports: [],
	selector: 'app-toast',
	styleUrl: './toast.css',
	templateUrl: './toast.html',
})
export class Toast {
	toastService = inject(ToastService);

	cerrar(id: number) {
		this.toastService.cerrar(id);
	}
}