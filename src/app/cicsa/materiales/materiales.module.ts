import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MaterialesRoutingModule } from './materiales-routing.module';
import { MaterialesComponent } from './materiales.component';
import { ListMaterialesComponent } from './list-materiales/list-materiales.component';
import { AddMaterialesComponent } from './add-materiales/add-materiales.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SharedModule } from 'src/app/shared/shared.module';
import { CargaMasivaComponent } from './carga-masiva/carga-masiva.component';
import { AsignarMaterialesComponent } from './asignar-materiales/asignar-materiales.component';
import { ListMaterialesBrigadaComponent } from './list-materiales-brigada/list-materiales-brigada.component';

@NgModule({
  declarations: [
    MaterialesComponent,
    ListMaterialesComponent,
    AddMaterialesComponent,
    CargaMasivaComponent,
    AsignarMaterialesComponent,
    ListMaterialesBrigadaComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    MaterialesRoutingModule,
    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    MatTooltipModule,
  ],
})
export class MaterialesModule {}
