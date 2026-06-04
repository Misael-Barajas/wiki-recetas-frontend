import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from '../../services/api';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-admin-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-usuarios.html'
})
export class AdminUsuarios implements OnInit {
  listaUsuarios: any[] = [];
  usuarioActual: any;
  
  formularioUsuario: FormGroup;
  usuarioSeleccionado: any = null;

  constructor(
    private apiService: ApiService, 
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.formularioUsuario = new FormGroup({
      nombre: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      rol: new FormControl('', Validators.required),
      password_hash: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuarioActual();
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
    this.apiService.getUsuarios().subscribe({
      next: (datos) => {
        this.listaUsuarios = datos;
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarUsuario(user: any): void {
    this.usuarioSeleccionado = user;
    this.formularioUsuario.patchValue({
      nombre: user.nombre,
      correo: user.correo,
      rol: user.rol,
      password_hash: ''
    });
  }

  guardarUsuario(): void {
    if (this.formularioUsuario.invalid || !this.usuarioSeleccionado) return;
    
    this.apiService.actualizarUsuario(this.usuarioSeleccionado.id_usuario, this.formularioUsuario.value).subscribe({
      next: () => {
        this.obtenerUsuarios();
        this.cancelarEdicion();
      }
    });
  }

  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
    this.formularioUsuario.reset();
  }

  borrarUsuario(id: number): void {
    if (id === this.usuarioActual.id_usuario) {
      alert('No puedes eliminar tu propia cuenta desde aquí.');
      return;
    }
    
    if (confirm('¿Eliminar definitivamente a este usuario y todos sus datos?')) {
      this.apiService.eliminarUsuario(id).subscribe({
        next: () => this.obtenerUsuarios()
      });
    }
  }
}