import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { UiService } from '../../services/Uiservice';

@Component({
  imports: [RouterLink, FormsModule],
  selector: 'app-header',
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  authService = inject(AuthService);
  cartService = inject(CartService);
  ui = inject(UiService);
  private router = inject(Router);

  terminoBusqueda = signal('');

  buscar() {
    const termino = this.terminoBusqueda().trim();
    if (!termino) return;
    this.router.navigate(['/productos'], { queryParams: { buscar: termino } });
    this.ui.cerrarMobileMenu();
  }

  cerrarSesion() {
    this.authService.logout();
    this.ui.cerrarMobileMenu();
  }
}