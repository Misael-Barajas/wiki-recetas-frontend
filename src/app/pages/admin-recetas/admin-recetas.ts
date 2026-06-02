import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';

@Component({
  selector: 'app-admin-recetas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-recetas.html',
  styleUrl: './admin-recetas.css'
})
export class AdminRecetas implements OnInit {
  formularioReceta: FormGroup;
  listaRecetas: any[] = []; // Para mostrar en la tabla de gestión
  mensajeExito: string = '';
  
  // Variables de control para la edición
  modoEdicion: boolean = false;
  idRecetaAEditar: number | null = null;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {
    this.formularioReceta = new FormGroup({
      titulo: new FormControl('', Validators.required),
      instrucciones: new FormControl('', Validators.required),
      tiempo_preparacion: new FormControl('', [Validators.required, Validators.min(1)]),
      porciones: new FormControl('', [Validators.required, Validators.min(1)]),
      id_categoria: new FormControl('', Validators.required),
      id_usuario: new FormControl(1)
    });
  }

  ngOnInit(): void {
    this.obtenerRecetas();
  }

  obtenerRecetas(): void {
    this.apiService.getRecetas().subscribe({
      next: (datos) => {
        this.listaRecetas = datos;
        this.cdr.detectChanges(); // Asegura la actualización inmediata de la tabla
      },
      error: (err) => console.error('Error al listar recetas', err)
    });
  }

  guardarReceta() {
    if (this.formularioReceta.invalid) return;

    if (this.modoEdicion && this.idRecetaAEditar !== null) {
      // --- LÓGICA DE ACTUALIZAR (PUT) ---
      this.apiService.actualizarReceta(this.idRecetaAEditar, this.formularioReceta.value).subscribe({
        next: () => {
          this.mensajeExito = '¡Receta actualizada correctamente!';
          this.limpiarFormulario();
          this.obtenerRecetas();
        },
        error: (err) => console.error('Error al actualizar', err)
      });
    } else {
      // --- LÓGICA DE CREAR (POST) ---
      this.apiService.crearReceta(this.formularioReceta.value).subscribe({
        next: () => {
          this.mensajeExito = '¡Receta guardada exitosamente!';
          this.limpiarFormulario();
          this.obtenerRecetas();
        },
        error: (err) => console.error('Error al guardar', err)
      });
    }
  }

  // Carga los datos de la fila de la tabla directamente al formulario
  seleccionarParaEditar(receta: any): void {
    this.modoEdicion = true;
    this.idRecetaAEditar = receta.id_receta;

    // Seteamos los valores en los inputs del formulario
    this.formularioReceta.patchValue({
      titulo: receta.titulo,
      instrucciones: receta.instrucciones,
      tiempo_preparacion: receta.tiempo_preparacion,
      porciones: receta.porciones,
      id_categoria: receta.id_categoria || ''
    });
  }

  // --- LÓGICA DE ELIMINAR (DELETE) ---
  borrarReceta(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.apiService.eliminarReceta(id).subscribe({
        next: () => {
          this.mensajeExito = 'Receta eliminada de la base de datos.';
          this.obtenerRecetas();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => console.error('Error al eliminar', err)
      });
    }
  }

  limpiarFormulario(): void {
    this.formularioReceta.reset({ id_usuario: 1 });
    this.modoEdicion = false;
    this.idRecetaAEditar = null;
    setTimeout(() => this.mensajeExito = '', 3000);
  }
}