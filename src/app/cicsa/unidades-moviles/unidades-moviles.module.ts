import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UnidadesMovilesRoutingModule } from './unidades-moviles-routing.module';
import { UnidadesMovilesComponent } from './unidades-moviles.component';
import { ListUnidadesMovilesComponent } from './list-unidades-moviles/list-unidades-moviles.component';
import { AddUnidadesMovilesComponent } from './add-unidades-moviles/add-unidades-moviles.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';
@NgModule({
  declarations: [
    UnidadesMovilesComponent,
    ListUnidadesMovilesComponent,
    AddUnidadesMovilesComponent
  ],
  imports: [
    CommonModule,
    UnidadesMovilesRoutingModule,
    SharedModule,
    MaterialModule,
    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatTooltipModule,
  ]
})
export class UnidadesMovilesModule { }
