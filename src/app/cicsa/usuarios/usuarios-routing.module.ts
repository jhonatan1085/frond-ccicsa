import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsuariosComponent } from './usuarios.component';
import { AddUsuarioComponent } from './add-usuario/add-usuario.component';
import { ListUsuarioComponent } from './list-usuario/list-usuario.component';
import { EditUsuarioComponent } from './edit-usuario/edit-usuario.component';

const routes: Routes = [
  {
    path:'',
    component: UsuariosComponent,
    children:[
      {
        path:'add-usuario',
        component:AddUsuarioComponent
      },
      {
        path:'list-usuario',
        component:ListUsuarioComponent
      },
      {
        path:'list-usuario/edit-usuario/:id',
        component:EditUsuarioComponent
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsuariosRoutingModule { }
