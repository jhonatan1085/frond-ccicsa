import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialesComponent } from './materiales.component';
import { ListMaterialesComponent } from './list-materiales/list-materiales.component';

const routes: Routes = [{
  path:'',
  component: MaterialesComponent,
  children:[
    {
      path:'list-materiales',
      component:ListMaterialesComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
