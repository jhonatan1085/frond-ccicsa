import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UnidadesMovilesComponent } from './unidades-moviles.component';
import { ListUnidadesMovilesComponent } from './list-unidades-moviles/list-unidades-moviles.component';

const routes: Routes = [
  {
    path:'',
    component:UnidadesMovilesComponent,
    children:[
      {
        path: 'list-unidades-moviles',
        component: ListUnidadesMovilesComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UnidadesMovilesRoutingModule { }
