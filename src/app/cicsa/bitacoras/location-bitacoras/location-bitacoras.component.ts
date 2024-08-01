import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Bitacora, Tipo } from 'src/app/modelos/Modelos';
import { BitacorasService } from '../services/bitacoras.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-location-bitacoras',
  templateUrl: './location-bitacoras.component.html',
  styleUrls: ['./location-bitacoras.component.scss']
})
export class LocationBitacorasComponent {
  public selectedCausa !: string;
  public selectedConsecuencia !: string;
  public selectedTipoReparacion !: string;
  public herramientas = '';
  public tiempo = '';
  public causa: Tipo[] = [];
  public consecuencia: Tipo[] = [];
  public tipoReparacion: Tipo[] = [];

  bitacora: Bitacora;

  constructor(
    public dialogRef: MatDialogRef<LocationBitacorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bitacora: Bitacora },
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private router: Router,

  ) {
    this.bitacora = data.bitacora;
    this.bitacoraService.listEndConfig().subscribe((resp: any) => {
      this.causa = resp.causa;
      this.consecuencia = resp.consecuencia;
      this.tipoReparacion = resp.tipoReparacion;
    })
  }

  

  guardar() {
    const formData = new FormData();
    formData.append("id", "" + this.bitacora.id);
    formData.append("latitud", "" +  this.bitacora.latitud);
    formData.append("longitud", "" +  this.bitacora.longitud);
    formData.append("distancia", "" +  this.bitacora.distancia);



    this.bitacoraService.registerLocationBitacora(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.snackBar('Falta ingresar datos');
      } else {
        this.snackBar('Registro Exitoso');
        this.router.navigate(['/bitacoras/list-bitacora']);
      }
    })
  }

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000
    });
  }


  getLocation() {
    this.bitacoraService.getPosition().then(pos => {
        this.bitacora.latitud = pos.lat;
        this.bitacora.longitud = pos.lng;
    });
}
}
