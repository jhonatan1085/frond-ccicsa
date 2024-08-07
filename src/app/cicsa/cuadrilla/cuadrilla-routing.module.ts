import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CuadrillaComponent } from './cuadrilla.component';
import { ListCuadrillaComponent } from './list-cuadrilla/list-cuadrilla.component';

const routes: Routes = [{
  path:'',
  component: CuadrillaComponent,
  children:[
    {
      path:'list-cuadrilla',
      component:ListCuadrillaComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CuadrillaRoutingModule { }
