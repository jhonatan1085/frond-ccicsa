import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialesRoutingModule } from './materiales-routing.module';
import { MaterialesComponent } from './materiales.component';
import { ListMaterialesComponent } from './list-materiales/list-materiales.component';


@NgModule({
  declarations: [
    MaterialesComponent,
    ListMaterialesComponent
  ],
  imports: [
    CommonModule,
    MaterialesRoutingModule
  ]
})
export class MaterialesModule { }
