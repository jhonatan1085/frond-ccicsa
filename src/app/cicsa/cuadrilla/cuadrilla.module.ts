import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CuadrillaRoutingModule } from './cuadrilla-routing.module';
import { CuadrillaComponent } from './cuadrilla.component';
import { ListCuadrillaComponent } from './list-cuadrilla/list-cuadrilla.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AddCuadrillaComponent } from './add-cuadrilla/add-cuadrilla.component';

@NgModule({
  declarations: [
    CuadrillaComponent,
    ListCuadrillaComponent,
    AddCuadrillaComponent
  ],
  imports: [
    CommonModule,
    CuadrillaRoutingModule,
    SharedModule,

    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class CuadrillaModule { }
