import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitacorasComponent } from './bitacoras.component';
import { AddBitacorasComponent } from './add-bitacoras/add-bitacoras.component';

const routes: Routes = [
  {
    path:'',
    component: BitacorasComponent,
    children:[
      {
        path:'add-bitacora',
        component:AddBitacorasComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BitacorasRoutingModule { }
