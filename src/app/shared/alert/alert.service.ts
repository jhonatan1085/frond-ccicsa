import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from './alert.component';
import { AlertOptions } from './alert-options.interface';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor(private dialog: MatDialog) {}
  alert(options: AlertOptions) {
    this.dialog.open(AlertComponent, { data: options });
  }
}
