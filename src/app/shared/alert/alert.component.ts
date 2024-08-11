import { Component, Inject } from '@angular/core';
import { AlertOptions } from './alert-options.interface';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: AlertOptions) {}
}
