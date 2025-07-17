import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  Atencion,
  Bitacora,
  Cuadrilla,
  UsuarioMovil,
  WhatsappGroup,
} from '../../modelos';
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
      console.log(resp)
      this.bitacoraPrint = this.utilities.armaBitacora(resp);
    });
  }

  copiarTexto() {
    const texto = this.invoiceTotalInner.nativeElement.innerText;
    this.clipboard.copy(texto);
    this.utilities.snackBar('Bicatora copiada');
  }

  /*enviaWhatsAap() {
    if (this.bitacora && this.bitacora.id) {
      //222   this.utilities.envioWhatsApp(this.bitacora.id, 'prueba envio');
    } else {
      this.utilities.snackBar('Bitacora no existe');
    }
  }*/

  sessionId = '';
  enviaWhatsAap(): void {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    if (user && user.name) {
      this.sessionId = user.whatsapp;
    }

    //const grupitos = 'prueba envio 2,prueba envio';
    /* const grupos = grupitos
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean);*/

    if (this.bitacora && this.bitacora.id) {
      const bitacoraId = this.bitacora.id;

      this.bitacoraService
        .groupWhastApp(this.bitacora.tipo_averia.id)
        .subscribe((Resp) => {


          // Resp.data es WhatsappGroup[]
    const grupos: WhatsappGroup[] = Resp.data as WhatsappGroup[];

    // Convierto WhatsappGroup[] a string[] con .map
    const nombresGrupos: string[] = grupos.map(g => g.nombre);

          console.log(nombresGrupos);

          this.utilities.enviarMensajeAGrupos(
            this.sessionId,
            nombresGrupos,
            bitacoraId
          );
        });

      /*this.bitacoraService.groupWhastApp(this.bitacora.tipo_averia.id).subscribe((resp: Bitacora) => { 
    console.log(resp.);
  });*/
    } else {
      this.utilities.snackBar('no se registro Grupos de Whasap');
    }
  }
}
