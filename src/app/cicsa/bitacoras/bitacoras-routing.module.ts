import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BitacorasComponent } from './bitacoras.component';
import { AddBitacorasComponent } from './add-bitacoras/add-bitacoras.component';
import { ListBitacorasComponent } from './list-bitacoras/list-bitacoras.component';
import { ViewBitacorasComponent } from './view-bitacoras/view-bitacoras.component';
import { AddDetalleBitacorasComponent } from './add-detalle-bitacoras/add-detalle-bitacoras.component';
import { AddMaterialesComponent } from './add-materiales/add-materiales.component';

const routes: Routes = [
  {
    path: '',
    component: BitacorasComponent,
    children: [
      {
        path: 'list-bitacora',
        component: ListBitacorasComponent,
      },
      {
        path:'add-bitacora',
        component:AddBitacorasComponent
      },
      {
        path:'edit-bitacora',
        component:AddBitacorasComponent
      }
      ,
      {
        path:'view-bitacora',
        component:ViewBitacorasComponent
      },
      {
        path: 'edit-bitacora/:id',
        component: AddBitacorasComponent,
      },
      {
        path: 'view-bitacora',
        component: ViewBitacorasComponent,
      },
      {
        path: 'list-bitacora/detalle-bitacora/:bitacora',
        component: AddDetalleBitacorasComponent,
      },{
        path: 'list-bitacora/materiales-bitacora/:bitacora',
        component: AddMaterialesComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BitacorasRoutingModule {}
