import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UiService {
	mobileMenuOpen = signal(false);

	toggleMobileMenu() {
		this.mobileMenuOpen.set(!this.mobileMenuOpen());
	}

	cerrarMobileMenu() {
		this.mobileMenuOpen.set(false);
	}
}