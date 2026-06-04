import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-categorias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-categorias.html'
})
export class AdminCategorias implements OnInit {
  formularioCategoria: FormGroup;
  listaCategorias: any[] = [];
  modoEdicion: boolean = false;
  idCategoriaEdicion: number | null = null;

  constructor(
    private apiService: ApiService,
    private cdr: ChangeDetectorRef
  ) {
    this.formularioCategoria = new FormGroup({
      nombre_categoria: new FormControl('', Validators.required),
      descripcion: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    this.obtenerCategorias();
  }

  obtenerCategorias(): void {
    this.apiService.getCategorias().subscribe({
      next: (datos) => {
        this.listaCategorias = datos;
        this.cdr.detectChanges();
      }
    });
  }

  guardarCategoria() {
    if (this.formularioCategoria.invalid) return;

    if (this.modoEdicion && this.idCategoriaEdicion) {
      this.apiService.actualizarCategoria(this.idCategoriaEdicion, this.formularioCategoria.value).subscribe({
        next: () => { this.limpiarFormulario(); this.obtenerCategorias(); }
      });
    } else {
      this.apiService.crearCategoria(this.formularioCategoria.value).subscribe({
        next: () => { this.limpiarFormulario(); this.obtenerCategorias(); }
      });
    }
  }

  seleccionar(categoria: any): void {
    this.modoEdicion = true;
    this.idCategoriaEdicion = categoria.id_categoria;
    this.formularioCategoria.patchValue(categoria);
  }

  borrarCategoria(id: number): void {
    if (confirm('¿Eliminar esta categoría? Esto podría afectar las recetas asociadas.')) {
      this.apiService.eliminarCategoria(id).subscribe({
        next: () => this.obtenerCategorias()
      });
    }
  }

  limpiarFormulario(): void {
    this.formularioCategoria.reset();
    this.modoEdicion = false;
    this.idCategoriaEdicion = null;
  }
}