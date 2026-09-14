import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
	imports: [FormsModule],
	selector: 'app-nosotros',
	styleUrl: './nosotros.css',
	templateUrl: './nosotros.html',
})
export class Nosotros {
	formulario = {
		nombre: '',
		email: '',
		mensaje: ''
	};

	error = signal<string | null>(null);
	enviado = signal(false);

	enviarMensaje() {
		const { nombre, email, mensaje } = this.formulario;

		if (!nombre.trim() || !email.trim() || !mensaje.trim()) {
			this.error.set('Completa todos los campos antes de enviar.');
			this.enviado.set(false);
			return;
		}

		const emailValido = /^\S+@\S+\.\S+$/.test(email);
		if (!emailValido) {
			this.error.set('Ingresa un correo electrónico válido.');
			this.enviado.set(false);
			return;
		}

		this.error.set(null);
		this.enviado.set(true);
		this.formulario = { nombre: '', email: '', mensaje: '' };
	}
}