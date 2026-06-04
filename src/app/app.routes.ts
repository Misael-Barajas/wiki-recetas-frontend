import { Routes } from '@angular/router';
import { Inicio } from './pages/inicio/inicio'; 
import { Recetas } from './pages/recetas/recetas';
import { AdminRecetas } from './pages/admin-recetas/admin-recetas';
import { Login } from './pages/login/login'; 
import { Registro } from './pages/registro/registro';
import { AdminCategorias } from './pages/admin-categorias/admin-categorias';
import { AdminUsuarios } from './pages/admin-usuarios/admin-usuarios';

export const routes: Routes = [
  { path: 'inicio', component: Inicio },
  { path: 'recetas', component: Recetas },
  { path: 'login', component: Login }, 
  { path: 'registro', component: Registro },
  { path: 'admin-recetas', component: AdminRecetas },
  
  { path: 'admin-categorias', component: AdminCategorias },
  { path: 'admin-usuarios', component: AdminUsuarios },
  
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' } 
];