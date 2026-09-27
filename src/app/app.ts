import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './componentes/header/header';
import { NavBar } from './componentes/nav-bar/nav-bar';
import { Footer } from './componentes/footer/footer';
import { Toast } from './componentes/Toast/toast';
import { UiService } from './services/Uiservice';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, NavBar, Footer, Toast],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  ui = inject(UiService);
}