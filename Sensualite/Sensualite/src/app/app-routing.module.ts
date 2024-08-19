import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },
  {
    path: 'auth',
    loadChildren: () => import('./pages/auth/auth.module').then( m => m.AuthPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/auth/dashboard/dashboard.module').then(m => m.DashboardPageModule)
  },
  {
    path: 'perfil',
    loadChildren: () => import('./pages/auth/perfil/perfil.module').then(m => m.PerfilPageModule)
  },
  {
    path: 'edituser',
    loadChildren: () => import('./pages/auth/edituser/edituser.module').then(m => m.EdituserPageModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./pages/auth/cart/cart.module').then(m => m.CartPageModule)
  },
  {
    path: 'categorias',
    loadChildren: () => import('./pages/auth/categorias/categorias.module').then(m => m.CategoriasPageModule)
  },

  {
    path: '**',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
    
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
