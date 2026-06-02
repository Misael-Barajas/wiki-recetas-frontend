import { Routes } from '@angular/router';
// Actualizamos las rutas quitando ".component" al final
import { Inicio } from './pages/inicio/inicio'; 
import { Recetas } from './pages/recetas/recetas';
import { AdminRecetas } from './pages/admin-recetas/admin-recetas';

export const routes: Routes = [
  { path: 'inicio', component: Inicio },
  { path: 'recetas', component: Recetas },
  { path: 'admin-recetas', component: AdminRecetas },
  { path: '', redirectTo: '/inicio', pathMatch: 'full' },
  { path: '**', redirectTo: '/inicio' }
];