import { Component, Inject} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import {  Bitacora,  Tipo } from 'src/app/modelos/Modelos';
import { BitacorasService } from '../services/bitacoras.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-end-bitacoras',
  templateUrl: './end-bitacoras.component.html',
  styleUrls: ['./end-bitacoras.component.scss'],
})
export class EndBitacorasComponent {
  public selectedCausa!: string;
  public selectedConsecuencia!: string;
  public selectedTipoReparacion!: string;
  public herramientas = '';
  public tiempo = '';
  public causa: Tipo[] = [];
  public consecuencia: Tipo[] = [];
  public tipoReparacion: Tipo[] = [];

  bitacora: Bitacora;

  constructor(
    public dialogRef: MatDialogRef<EndBitacorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bitacora: Bitacora },
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private router: Router
  ) {
    console.log(data.bitacora);
    this.bitacora = data.bitacora;
    this.bitacora.causa_averia = this.bitacora.causa_averia??{}
    this.bitacora.consecuencia_averia = this.bitacora.consecuencia_averia??{}
    this.bitacora.tipo_reparacion = this.bitacora.tipo_reparacion??{}
    this.bitacora.herramientas??=''
    this.bitacora.incidencia??=''
    this.bitacoraService.listEndConfig().subscribe((resp: any) => {
      this.causa = resp.causa;
      this.consecuencia = resp.consecuencia;
      this.tipoReparacion = resp.tipoReparacion;
    });
  }

  guardar() {
    const formData = new FormData();
    formData.append("id", ""+this.bitacora.id);
    formData.append("causa",""+ this.bitacora.causa_averia.id);
    formData.append("consecuencia", "" + this.bitacora.consecuencia_averia.id);
    formData.append("tipoReparacion", "" + this.bitacora.tipo_reparacion.id);
    formData.append("herramientas", this.bitacora.herramientas);
    formData.append("tiempo", this.bitacora.tiempo_solucion);

    this.bitacoraService
      .registerEndBitacora(formData)
      .subscribe((resp: any) => {
        console.log(resp);
        if (resp.message == 403) {
          this.snackBar('Falta ingresar datos');
        } else {
          this.snackBar('Registro Exitoso');
          this.router.navigate(['/bitacoras/list-bitacora']);
        }
      });
  }

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
