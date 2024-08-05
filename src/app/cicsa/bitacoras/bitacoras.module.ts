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
import { ListBitacorasComponent } from './list-bitacoras/list-bitacoras.component';
import { ViewBitacorasComponent } from './view-bitacoras/view-bitacoras.component';
import { AddDetalleBitacorasComponent } from './add-detalle-bitacoras/add-detalle-bitacoras.component';
import { EndBitacorasComponent } from './end-bitacoras/end-bitacoras.component';
import { LocationBitacorasComponent } from './location-bitacoras/location-bitacoras.component';
import {MatTooltipModule} from '@angular/material/tooltip';
@NgModule({
  declarations: [
    BitacorasComponent,
    AddBitacorasComponent,
    ListBitacorasComponent,
    ViewBitacorasComponent,
    AddDetalleBitacorasComponent,
    EndBitacorasComponent,
    LocationBitacorasComponent
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
    RouterModule,
    MatTooltipModule
    
  ]
})
export class BitacorasModule { }
