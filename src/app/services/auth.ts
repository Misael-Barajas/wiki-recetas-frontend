import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  login(credenciales: { correo: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credenciales).pipe(
      tap((respuesta: any) => {
        if (respuesta.exito) {
          localStorage.setItem('usuarioLogueado', JSON.stringify(respuesta.usuario));
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('usuarioLogueado');
    this.router.navigate(['/inicio']);
  }

  estaAutenticado(): boolean {
    return !!localStorage.getItem('usuarioLogueado');
  }
}