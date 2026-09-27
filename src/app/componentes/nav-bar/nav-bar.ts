import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { UiService } from '../../services/Uiservice';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-nav-bar',
  styleUrl: './nav-bar.css',
  templateUrl: './nav-bar.html',
})
export class NavBar {
  private router = inject(Router);
  ui = inject(UiService);

  irAContacto() {
    const formulario = document.getElementById('contacto-form');
    this.ui.cerrarMobileMenu();

    if (this.router.url.startsWith('/nosotros') && formulario) {
      // Ya estamos en la página, solo hacemos scroll.
      formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }

    // Estamos en otra página: navegamos primero y luego hacemos scroll,
    // dando un pequeño margen para que el DOM de la nueva página se pinte.
    this.router.navigate(['/nosotros']).then(() => {
      setTimeout(() => {
        document.getElementById('contacto-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 150);
    });
  }
}