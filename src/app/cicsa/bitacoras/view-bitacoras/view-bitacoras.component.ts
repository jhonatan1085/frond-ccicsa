import { Clipboard } from '@angular/cdk/clipboard';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Atencion, Bitacora, Cuadrilla, UsuarioMovil } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';

@Component({
  selector: 'app-view-bitacoras',
  templateUrl: './view-bitacoras.component.html',
  styleUrls: ['./view-bitacoras.component.scss'],
})
export class ViewBitacorasComponent {
  bitacora?: Bitacora;
  brigadas = '';
  atenciones = '';
  causas = '';
  count = 1;

  @ViewChild('invoiceTotalInner', { static: true })
  invoiceTotalInner!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ViewBitacorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService
  ) {
    this.bitacoraService.read(data.id).subscribe((resp: Bitacora) => {
      //this.bitacora_selected = resp.bitacora.data;

      console.log('la bitacora: ', resp);
      this.bitacora = resp;
      this.count = 1;

      if (this.bitacora.estado == '0') {
        this.causas = '*Causa: ' + this.bitacora.causa_averia.nombre + ';* \n';
        this.causas =
          this.causas +
          '*Consecuencia: ' +
          this.bitacora.consecuencia_averia.nombre +
          ';* \n';
        this.causas =
          this.causas +
          '*Tipo de Reparación:* ' +
          this.bitacora.tipo_reparacion.nombre +
          '; \n';
        this.causas =
          this.causas +
          '*Tiempo de solución:* ' +
          this.bitacora.tiempo_solucion +
          '; \n';
        if (this.bitacora.herramientas) {
          this.causas =
            this.causas +
            '\n*Material Utilizado:*\n' +
            this.bitacora.herramientas +
            '\n';
        } else {
          this.causas =
            this.causas + '\n*Material Utilizado:*\n - Sin materiales \n';
        }
      }

      this.bitacora?.brigada.forEach((element: Cuadrilla) => {
        // let zona = element.zona.nombre;
        element.user_movil.forEach((item: UsuarioMovil) => {
          if (item.is_lider == '1') {
            this.brigadas =
              this.brigadas +
              '\n' +
              '_Bri' +
              this.count +
              ':_ ' +
              element.zona.nombre +
              ': ' +
              item.user.nombre +
              ' - Placa: ' +
              item.unidad_movil?.placa +
              ' Cel: ' +
              item.user.celular;
            this.count = this.count + 1;
          }
        });
      });

      this.bitacora?.atenciones.forEach((element: Atencion) => {
        element.bitacora_atencion.forEach((item: Atencion) => {
          if (item.is_coment == '0') {
            this.atenciones =
              this.atenciones +
              ' *' +
              item.hora +
              '* ' +
              item.descripcion +
              ' \n';
          } else {
            this.atenciones =
              this.atenciones + '   *-* ' + item.descripcion + ' \n';
          }
        });
        this.atenciones =
          this.atenciones +
          ' *' +
          element.hora +
          ' (' +
          element.atencion.orden +
          ') ' +
          element.atencion.descripcion +
          '* ' +
          element.descripcion +
          ' \n';
      });
    });
  }

  copiarTexto() {
    const texto = this.invoiceTotalInner.nativeElement.innerText;
    this.clipboard.copy(texto);
    this._snackBar.open('Bicatora copiada', 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
