import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LideresRoutingModule } from './lideres-routing.module';
import { LideresComponent } from './lideres.component';
import { AddLiderComponent } from './add-lider/add-lider.component';
import { ListLideresComponent } from './list-lideres/list-lideres.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [
    LideresComponent,
    AddLiderComponent,
    ListLideresComponent
  ],
  imports: [
    CommonModule,
    LideresRoutingModule,
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
export class LideresModule { }
