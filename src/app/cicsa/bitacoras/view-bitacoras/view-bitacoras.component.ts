import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Atencion, Bitacora, Cuadrilla, UsuarioMovil } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { DatePipe } from '@angular/common';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-view-bitacoras',
  templateUrl: './view-bitacoras.component.html',
  styleUrls: ['./view-bitacoras.component.scss'],
  providers: [DatePipe], // Agregar DatePipe aquí
})
export class ViewBitacorasComponent {
  bitacora?: Bitacora;
  brigadas = '';
  atenciones = '';
  causas = '';
  count = 1;

  bitacoraPrint = '';

  @ViewChild('invoiceTotalInner', { static: true })
  invoiceTotalInner!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ViewBitacorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private datePipe: DatePipe,
    private utilities: UtilitiesService
  ) {
    this.bitacoraService.read(data.id).subscribe((resp: Bitacora) => {
      this.bitacora = resp;

      this.bitacoraPrint = this.utilities.armaBitacora(resp);
    });
  }

  copiarTexto() {
    const texto = this.invoiceTotalInner.nativeElement.innerText;
    this.clipboard.copy(texto);
    this.utilities.snackBar('Bicatora copiada');
  }

  enviaWhatsAap() {
    if (this.bitacora && this.bitacora.id) {
      this.utilities.envioWhatsApp(this.bitacora.id, 'prueba envio');
    } else {
      this.utilities.snackBar('Bitacora no existe');
    }
  }
}
