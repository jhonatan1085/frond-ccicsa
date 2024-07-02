import { NgModule } from "@angular/core";
import { CommonModule } from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatCardModule} from '@angular/material/card';
import {MatNativeDateModule} from '@angular/material/core';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef, MatDialogModule} from '@angular/material/dialog';
import {FormsModule} from '@angular/forms';



@NgModule({
declarations:[],
imports: [
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatAutocompleteModule,
],
exports: [
    CommonModule,
    MatDatepickerModule,
    MatCardModule,
    MatNativeDateModule,
    MatSelectModule,
    MatFormFieldModule,
    MatExpansionModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatDialogModule,
    FormsModule,
    MatAutocompleteModule

]
})

export class materialModule {}