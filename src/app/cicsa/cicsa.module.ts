import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CicsaRoutingModule } from './cicsa-routing.module';
import { CicsaComponent } from './cicsa.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    CicsaComponent
  ],
  imports: [
    CommonModule,
    CicsaRoutingModule,
    SharedModule
  ]
})
export class CicsaModule { }
