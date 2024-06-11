import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SiteRoutingModule } from './site-routing.module';
import { SiteComponent } from './site.component';
import { AddSiteComponent } from './add-site/add-site.component';
import { EditSiteComponent } from './edit-site/edit-site.component';
import { ListSiteComponent } from './list-site/list-site.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    SiteComponent,
    AddSiteComponent,
    EditSiteComponent,
    ListSiteComponent
  ],
  imports: [
    CommonModule,
    SiteRoutingModule,
    SharedModule,

    //
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule
  ]
})
export class SiteModule { }
