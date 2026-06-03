import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-recetas',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-recetas.html',
  styleUrl: './admin-recetas.css'
})
export class AdminRecetas implements OnInit {
  formularioReceta: FormGroup;
  listaRecetas: any[] = [];
  mensajeExito: string = '';
  
  modoEdicion: boolean = false;
  idRecetaAEditar: number | null = null;

  usuarioActual: any = null;

  get recetasAMostrar() {
    if (!this.usuarioActual) return [];
    
    if (this.usuarioActual.rol === 'admin') {
      return this.listaRecetas;
    }
    
    return this.listaRecetas.filter(receta => receta.id_usuario === this.usuarioActual.id_usuario);
  }

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef, private authService: AuthService) {
    this.formularioReceta = new FormGroup({
      titulo: new FormControl('', Validators.required),
      instrucciones: new FormControl('', Validators.required),
      tiempo_preparacion: new FormControl('', [Validators.required, Validators.min(1)]),
      porciones: new FormControl('', [Validators.required, Validators.min(1)]),
      id_categoria: new FormControl('', Validators.required),
      id_usuario: new FormControl('')
    });
  }

  ngOnInit(): void {    
    this.usuarioActual = this.authService.getUsuarioActual();
    if (this.usuarioActual) {
      this.formularioReceta.patchValue({ id_usuario: this.usuarioActual.id_usuario });
    }
    this.obtenerRecetas();
  }

  puedeEditarOBorrar(receta: any): boolean {
    if (!this.usuarioActual) return false;
    if (this.usuarioActual.rol === 'admin') return true;
    return receta.id_usuario === this.usuarioActual.id_usuario;
  }

  obtenerRecetas(): void {
    this.apiService.getRecetas().subscribe({
      next: (datos) => {
        this.listaRecetas = datos;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error al listar recetas', err)
    });
  }

  guardarReceta() {
    if (this.formularioReceta.invalid) return;

    const datosConPermisos = {
      ...this.formularioReceta.value,
      id_usuario_req: this.usuarioActual.id_usuario,
      rol_req: this.usuarioActual.rol
    };

    if (this.modoEdicion && this.idRecetaAEditar !== null) {
      this.apiService.actualizarReceta(this.idRecetaAEditar, datosConPermisos).subscribe({
        next: () => {
          this.mensajeExito = '¡Receta actualizada!';
          this.limpiarFormulario();
          this.obtenerRecetas();
        },
        error: (err) => console.error(err)
      });
    } else {
      this.apiService.crearReceta(this.formularioReceta.value).subscribe({
        next: () => {
          this.mensajeExito = '¡Receta guardada exitosamente!';
          this.limpiarFormulario();
          this.obtenerRecetas();
        },
        error: (err) => console.error(err)
      });
    }
  }

  seleccionarParaEditar(receta: any): void {
    this.modoEdicion = true;
    this.idRecetaAEditar = receta.id_receta;

    this.formularioReceta.patchValue({
      titulo: receta.titulo,
      instrucciones: receta.instrucciones,
      tiempo_preparacion: receta.tiempo_preparacion,
      porciones: receta.porciones,
      id_categoria: receta.id_categoria || ''
    });
  }

  borrarReceta(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta receta?')) {
      this.apiService.eliminarReceta(id, this.usuarioActual.id_usuario, this.usuarioActual.rol).subscribe({
        next: () => {
          this.mensajeExito = 'Receta eliminada.';
          this.obtenerRecetas();
          setTimeout(() => this.mensajeExito = '', 3000);
        },
        error: (err) => alert('No tienes permiso para borrar esta receta.')
      });
    }
  }

  limpiarFormulario(): void {
    this.formularioReceta.reset({ id_usuario: this.usuarioActual?.id_usuario });
    this.modoEdicion = false;
    this.idRecetaAEditar = null;
    setTimeout(() => this.mensajeExito = '', 3000);
  }
}