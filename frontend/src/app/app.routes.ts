import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'publicidades',
    pathMatch: 'full'
  },
  {
    path: 'publicidades',
    loadComponent: () => import('./features/publicidade/pages/publicidade-list.page').then(m => m.PublicidadeListPage)
  },
  {
    path: 'publicidades/nova',
    loadComponent: () => import('./features/publicidade/pages/publicidade-form.page').then(m => m.PublicidadeFormPage)
  },
  {
    path: 'publicidades/:id/editar',
    loadComponent: () => import('./features/publicidade/pages/publicidade-form.page').then(m => m.PublicidadeFormPage)
  },
  {
    path: 'estados',
    loadComponent: () => import('./features/estado/pages/estado-list.page').then(m => m.EstadoListPage)
  },
  {
    path: '**',
    redirectTo: 'publicidades'
  }
];