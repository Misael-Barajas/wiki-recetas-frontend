import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-recetas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recetas.html'
})
export class Recetas implements OnInit {
  listaRecetas: any[] = [];
  recetasFiltradas: any[] = [];
  textoBusqueda: string = '';
  recetaSeleccionada: any = null;
  comentariosReceta: any[] = [];

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.cargarRecetas();
  }

  cargarRecetas(): void {
    this.apiService.getRecetas().subscribe({
      next: (datos) => {
        this.listaRecetas = datos;
        this.recetasFiltradas = datos;
        this.cdr.detectChanges(); 
      },
      error: (err) => console.error(err)
    });
  }

  filtrar(): void {
    const termino = this.textoBusqueda.toLowerCase();
    this.recetasFiltradas = this.listaRecetas.filter(receta => 
      receta.titulo.toLowerCase().includes(termino) || 
      (receta.nombre_categoria && receta.nombre_categoria.toLowerCase().includes(termino))
    );
  }

  verDetalle(receta: any): void {
    this.recetaSeleccionada = receta;
    this.comentariosReceta = [];

    this.apiService.getComentarios(receta.id_receta).subscribe({
      next: (datos) => {
        this.comentariosReceta = datos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }
}