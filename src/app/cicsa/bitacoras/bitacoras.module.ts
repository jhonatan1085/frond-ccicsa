import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BitacorasRoutingModule } from './bitacoras-routing.module';
import { BitacorasComponent } from './bitacoras.component';
import { AddBitacorasComponent } from './add-bitacoras/add-bitacoras.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { materialModule } from 'src/app/shared/material.module';

@NgModule({
  declarations: [
    BitacorasComponent,
    AddBitacorasComponent
  ],
  imports: [
    CommonModule,
    BitacorasRoutingModule,
    SharedModule,
    materialModule,
    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class BitacorasModule { }
