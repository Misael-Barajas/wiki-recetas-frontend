import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

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
  
  usuarioActual: any = null;
  nuevoComentario = { texto: '', calificacion: 5 };
  idComentarioEnEdicion: number | null = null;

  constructor(
    private apiService: ApiService, 
    private cdr: ChangeDetectorRef,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuarioActual();
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
    this.recargarComentarios();
  }

  recargarComentarios(): void {
    this.apiService.getComentarios(this.recetaSeleccionada.id_receta).subscribe({
      next: (datos) => {
        this.comentariosReceta = datos;
        this.idComentarioEnEdicion = null;
        this.nuevoComentario = { texto: '', calificacion: 5 };
        this.cdr.detectChanges();
      },
      error: (err) => console.error(err)
    });
  }

  puedeEditarOBorrarComentario(comentario: any): boolean {
    if (!this.usuarioActual) return false;
    if (this.usuarioActual.rol === 'admin') return true;
    return comentario.id_usuario === this.usuarioActual.id_usuario;
  }

  guardarComentario(): void {
    if (!this.nuevoComentario.texto.trim()) return;

    if (this.idComentarioEnEdicion) {
      const datosUpdate = {
        texto_comentario: this.nuevoComentario.texto,
        calificacion: this.nuevoComentario.calificacion,
        id_usuario_req: this.usuarioActual.id_usuario,
        rol_req: this.usuarioActual.rol
      };
      this.apiService.actualizarComentario(this.idComentarioEnEdicion, datosUpdate).subscribe({
        next: () => {
          this.recargarComentarios();
          this.cargarRecetas();
        }
      });
    } else {
      // CREAR
      const datosCreate = {
        id_usuario: this.usuarioActual.id_usuario,
        texto_comentario: this.nuevoComentario.texto,
        calificacion: this.nuevoComentario.calificacion
      };
      this.apiService.agregarComentario(this.recetaSeleccionada.id_receta, datosCreate).subscribe({
        next: () => {
          this.recargarComentarios();
          this.cargarRecetas();
        }
      });
    }
  }

  prepararEdicion(comentario: any): void {
    this.idComentarioEnEdicion = comentario.id_comentario;
    this.nuevoComentario.texto = comentario.texto_comentario;
    this.nuevoComentario.calificacion = comentario.calificacion;
  }

  cancelarEdicion(): void {
    this.idComentarioEnEdicion = null;
    this.nuevoComentario = { texto: '', calificacion: 5 };
  }

  borrarComentario(idComentario: number): void {
    if (confirm('¿Eliminar este comentario?')) {
      this.apiService.eliminarComentario(idComentario, this.usuarioActual.id_usuario, this.usuarioActual.rol).subscribe({
        next: () => {
          this.recargarComentarios();
          this.cargarRecetas();
        }
      });
    }
  }
}