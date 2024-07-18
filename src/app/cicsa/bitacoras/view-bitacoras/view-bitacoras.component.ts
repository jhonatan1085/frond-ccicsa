import { Component, Inject, ViewChild, ElementRef } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Atencion, Bitacora, Brigada, UsuarioMovil } from 'src/app/modelos/Modelos';
import { BitacorasService } from '../services/bitacoras.service';

@Component({
  selector: 'app-view-bitacoras',
  templateUrl: './view-bitacoras.component.html',
  styleUrls: ['./view-bitacoras.component.scss'],
})
export class ViewBitacorasComponent {

  bitacora?: Bitacora;
  brigadas = '';
  atenciones = '';
  count = 1;

  @ViewChild('textoDelicioso', { static: true }) textoDelicioso!: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<ViewBitacorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: string },
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService
  ) {

    this.bitacoraService.read(data.id).subscribe((resp: Bitacora) => {

      //this.bitacora_selected = resp.bitacora.data;
      this.bitacora = resp;
      this.count = 1;

      this.bitacora?.brigada.forEach((element: Brigada) => {
        // let zona = element.zona.nombre;
        element.user_movil.forEach((item: UsuarioMovil) => {
          if (item.is_lider == '1') {
            this.brigadas =
              this.brigadas +
              '_Bri' +
              this.count +
              ':_ ' +
              element.zona.nombre +
              ': ' +
              item.user.nombre +
              ' - Placa: ' +
              item.unidad_movil?.placa +
              ' Cel: ' +
              item.user.celular +
              '\n';
            this.count = this.count + 1;
          }
        });
      });

      this.bitacora?.atenciones.forEach((element: Atencion) => {
        element.bitacora_atencion.forEach((item: Atencion) => {
          if(item.is_coment == "0"){
            this.atenciones =
            this.atenciones + ' *' + item.hora + '* ' + item.descripcion + ' \n';
       
          }else{
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
    })

  }


  copiarTexto() {
    const texto = this.textoDelicioso.nativeElement.innerText;
    this.clipboard.copy(texto);
    this._snackBar.open('Bicatora copiada', 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
