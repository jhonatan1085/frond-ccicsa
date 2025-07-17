import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CicsaComponent } from './cicsa.component';
import { AuthGuard } from '../shared/gaurd/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CicsaComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'usuarios',
        loadChildren: () =>
          import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path: 'site',
        loadChildren: () =>
          import('./site/site.module').then((m) => m.SiteModule),
      },
      {
        path: 'bitacoras',
        loadChildren: () =>
          import('./bitacoras/bitacoras.module').then((m) => m.BitacorasModule),
      },
      {
        path: 'cuadrilla',
        loadChildren: () =>
          import('./cuadrilla/cuadrilla.module').then((m) => m.CuadrillaModule),
      },
      {
        path: 'unidades-moviles',
        loadChildren: () =>
          import('./unidades-moviles/unidades-moviles.module').then(
            (m) => m.UnidadesMovilesModule
          ),
      },
      {
        path: 'lideres',
        loadChildren: () =>
          import('./lideres/lideres.module').then((m) => m.LideresModule),
      },
      {
        path: 'materiales',
        loadChildren: () =>
          import('./materiales/materiales.module').then(
            (m) => m.MaterialesModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CicsaRoutingModule {}
