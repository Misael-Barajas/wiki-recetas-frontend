import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './registro.html'
})
export class Registro {
  registroForm: FormGroup;
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.registroForm = new FormGroup({
      nombre: new FormControl('', Validators.required),
      correo: new FormControl('', [Validators.required, Validators.email]),
      password_hash: new FormControl('', [Validators.required, Validators.minLength(6)])
    });
  }

  registrarUsuario() {
    if (this.registroForm.valid) {
      this.authService.registrar(this.registroForm.value).subscribe({
        next: () => {
          this.mensajeExito = '¡Cuenta creada con éxito! Redirigiendo al login...';
          this.mensajeError = '';
          
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (err) => {
          this.mensajeError = 'Ocurrió un error. Es posible que el correo ya esté registrado.';
          this.mensajeExito = '';
        }
      });
    }
  }
}