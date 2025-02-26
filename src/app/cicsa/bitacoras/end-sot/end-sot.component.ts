import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Bitacora, Tipo } from '../../modelos';
import { UtilitiesService } from '../../services/utilities.service';
import { BitacorasService } from '../../services/bitacoras.service';
@Component({
  selector: 'app-end-sot',
  templateUrl: './end-sot.component.html',
  styleUrls: ['./end-sot.component.scss']
})
export class EndSotComponent {

  bitacora: Bitacora;

  constructor(
    public dialogRef: MatDialogRef<EndSotComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bitacora: Bitacora },
    private utilities: UtilitiesService,
    private bitacoraService: BitacorasService
  ) {
    this.bitacora = data.bitacora;
  }

  guardar() {
    this.bitacoraService.closedSot(this.bitacora.id).subscribe((resp) => {
      if (resp.message == 403) {
        this.utilities.snackBar('Cerrar');
      } else {
        this.utilities.snackBar('Se Cerro Sot');
        this.dialogRef.close();
      }
    });

  }
}
