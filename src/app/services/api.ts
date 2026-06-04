import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) { }

  getRecetas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recetas`);
  }

  crearReceta(datosReceta: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recetas`, datosReceta);
  }

  actualizarReceta(id: number, datosReceta: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/recetas/${id}`, datosReceta);
  }

  eliminarReceta(id: number, idUsuario: number, rol: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/recetas/${id}?id_usuario=${idUsuario}&rol=${rol}`);
  }

  getRecetasDestacadas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/recetas/destacadas`);
  }

  getComentarios(idReceta: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/recetas/${idReceta}/comentarios`);
  }

  agregarComentario(idReceta: number, datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/recetas/${idReceta}/comentarios`, datos);
  }

  actualizarComentario(idComentario: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/comentarios/${idComentario}`, datos);
  }

  eliminarComentario(idComentario: number, idUsuario: number, rol: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comentarios/${idComentario}?id_usuario=${idUsuario}&rol=${rol}`);
  }

  getCategorias(): Observable<any> {
    return this.http.get(`${this.apiUrl}/categorias`);
  }
  crearCategoria(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/categorias`, datos);
  }
  actualizarCategoria(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/categorias/${id}`, datos);
  }
  eliminarCategoria(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/categorias/${id}`);
  }

  getUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`);
  }
  actualizarUsuario(id: number, datos: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}`, datos);
  }
  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }
}