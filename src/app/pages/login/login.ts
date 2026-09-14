import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LoginService } from '../../services/login.service';

@Component({
  imports: [FormsModule],
  selector: 'app-login',
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class Login {
  private authService = inject(AuthService);
  private loginService = inject(LoginService);
  private router = inject(Router);

  pestanaActiva = signal<'login' | 'registro'>('login');
  cargando = signal(false);
  error = signal<string | null>(null);

  credencialesLogin = {
    email: '',
    password: ''
  };

  formularioRegistro = {
    nombre: '',
    email: '',
    telefono: '',
    password: ''
  };

  cambiarPestana(pestaña: 'login' | 'registro') {
    this.pestanaActiva.set(pestaña);
    this.error.set(null);
  }

  iniciarSesion() {
    if (!this.credencialesLogin.email || !this.credencialesLogin.password) {
      this.error.set('Ingresa tu correo y contraseña.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.authService.login(this.credencialesLogin).subscribe({
      next: () => {
        this.cargando.set(false);
        this.router.navigate(['/']);
      },
      error: (respuesta) => {
        this.cargando.set(false);
        this.error.set(respuesta.error?.mensaje || 'Credenciales inválidas.');
      }
    });
  }

  registrarse() {
    const { nombre, email, telefono, password } = this.formularioRegistro;

    if (!nombre || !email || !telefono || !password) {
      this.error.set('Todos los campos son obligatorios.');
      return;
    }

    if (password.length < 8) {
      this.error.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    this.cargando.set(true);
    this.error.set(null);

    this.loginService.registrar(this.formularioRegistro).subscribe({
      next: () => {
        this.authService.login({ email, password }).subscribe({
          next: () => {
            this.cargando.set(false);
            this.router.navigate(['/']);
          },
          error: () => {
            this.cargando.set(false);
            this.pestanaActiva.set('login');
            this.error.set('Cuenta creada. Ahora inicia sesión.');
          }
        });
      },
      error: (respuesta) => {
        this.cargando.set(false);
        this.error.set(respuesta.error?.mensaje || 'No se pudo crear la cuenta.');
      }
    });
  }
}