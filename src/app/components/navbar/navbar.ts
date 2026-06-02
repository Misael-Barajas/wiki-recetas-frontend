import { Component } from '@angular/core';
// 1. Importamos las herramientas de enrutamiento
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  // 2. Las agregamos al arreglo de imports
  imports: [RouterLink, RouterLinkActive], 
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {

}