// 1. Agregamos ChangeDetectorRef a los imports de Angular
import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recetas.html',
  styleUrl: './recetas.css'
})
export class Recetas implements OnInit {
  listaRecetas: any[] = [];

  // 2. Inyectamos private cdr: ChangeDetectorRef en el constructor
  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef 
  ) {}

  ngOnInit(): void {
    this.cargarRecetas();
  }

  cargarRecetas(): void {
    this.apiService.getRecetas().subscribe({
      next: (datos) => {
        this.listaRecetas = datos;
        
        // 3. Le decimos a Angular: "¡Oye, ya llegaron los datos, actualiza la pantalla YA!"
        this.cdr.detectChanges(); 
        
        console.log('Recetas cargadas y vista actualizada:', this.listaRecetas);
      },
      error: (err) => {
        console.error('Error al conectar con la API', err);
      }
    });
  }
}