import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxBootstrapModule } from './ngx-bootstrap/ngx-bootstrap.module';
import { CountUpModule } from 'ngx-countup';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { MaterialModule } from './material.module';
import { NgxEditorModule } from 'ngx-editor';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FullCalendarModule } from '@fullcalendar/angular';
import { HttpClientModule } from '@angular/common/http';
import { DataService } from './data/data.service';
import { MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { HeaderComponent } from '../common-component/header/header.component';
import { SidebarComponent } from '../common-component/sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [HeaderComponent, SidebarComponent, AlertComponent],
  imports: [
    CommonModule,
    NgxBootstrapModule,
    CountUpModule,
    NgApexchartsModule,
    NgCircleProgressModule.forRoot({
      radius: 40,
      space: -10,
      outerStrokeWidth: 10,
      innerStrokeWidth: 10,
      animationDuration: 1000,
      clockwise: false,
      startFromZero: false,
      lazy: false,
      outerStrokeLinecap: 'square',
      showSubtitle: false,
      showTitle: false,
      showUnits: false,
      showBackground: false,
    }),
    SlickCarouselModule,
    MaterialModule,
    NgxEditorModule,
    FullCalendarModule,
    HttpClientModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    //NgxMaterialTimepickerModule,
    RouterModule,
  ],
  exports: [
    CommonModule,
    NgxBootstrapModule,
    CountUpModule,
    NgApexchartsModule,
    NgCircleProgressModule,
    SlickCarouselModule,
    MaterialModule,
    NgxEditorModule,
    FullCalendarModule,
    HttpClientModule,
    MatSortModule,
    FormsModule,
    ReactiveFormsModule,
    //NgxMaterialTimepickerModule,
    HeaderComponent,
    SidebarComponent,
    AlertComponent,
  ],
  providers: [DataService],
})
export class SharedModule {}
