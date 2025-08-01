import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MaterialesComponent } from './materiales.component';
import { ListMaterialesComponent } from './list-materiales/list-materiales.component';
import { AsignarMaterialesComponent } from './asignar-materiales/asignar-materiales.component';
import { ListMaterialesBrigadaComponent } from './list-materiales-brigada/list-materiales-brigada.component';

const routes: Routes = [{
  path:'',
  component: MaterialesComponent,
  children:[
    {
      path:'list-materiales',
      component:ListMaterialesComponent
    },
    {
      path:'list-materiales-brigada',
      component:ListMaterialesBrigadaComponent
    },
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MaterialesRoutingModule { }
