import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CicsaComponent } from './cicsa.component';
import { AuthGuard } from '../shared/gaurd/auth.guard';

const routes: Routes = [
  {
    path:'',
    component:CicsaComponent,
    canActivate:[AuthGuard],
    children:[
      {
        path:'usuarios',
        loadChildren: () => 
          import('./usuarios/usuarios.module').then((m) => m.UsuariosModule),
      },
      {
        path:'site',
        loadChildren: () => 
          import('./site/site.module').then((m) => m.SiteModule),
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CicsaRoutingModule { }
