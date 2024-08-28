import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LideresComponent } from './lideres.component';
import { AddLiderComponent } from './add-lider/add-lider.component';
import { ListLideresComponent } from './list-lideres/list-lideres.component';

const routes: Routes = [
  {
    path:'',
    component: LideresComponent,
    children:[
      {
        path:'add-lider',
        component:AddLiderComponent
      },
      {
        path:'list-lideres',
        component:ListLideresComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LideresRoutingModule { }
