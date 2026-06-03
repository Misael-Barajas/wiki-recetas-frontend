// 1. Agregamos ChangeDetectorRef a la importación
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html'
})
export class Inicio implements OnInit {
  mejoresRecetas: any[] = [];

  // 2. Inyectamos cdr en el constructor
  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.apiService.getRecetasDestacadas().subscribe({
      next: (datos) => {
        this.mejoresRecetas = datos;
        
        // 3. Forzamos a Angular a redibujar la pantalla YA
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error('Error al cargar destacadas:', err)
    });
  }
}