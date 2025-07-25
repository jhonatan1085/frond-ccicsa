import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Bitacora, Tipo } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { ConfigService } from '../../services/config.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-end-bitacoras',
  templateUrl: './end-bitacoras.component.html',
  styleUrls: ['./end-bitacoras.component.scss'],
})
export class EndBitacorasComponent {
  public selectedCausa!: string;
  public selectedConsecuencia!: string;
  public selectedTipoReparacion!: string;
  public tiempo = '';
  public causa: Tipo[] = [];
  public consecuencia: Tipo[] = [];
  public tipoReparacion: Tipo[] = [];

  bitacora: Bitacora;

  datosForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<EndBitacorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bitacora: Bitacora },
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private configService: ConfigService,
    private router: Router,
    private fb: FormBuilder,
    private utilities: UtilitiesService,
  ) {
    this.bitacora = data.bitacora;

      this.datosForm = this.fb.group({
      causa_averia_id: [this.bitacora.causa_averia?.id ?? null],
      consecuencia_averia_id: [this.bitacora.consecuencia_averia?.id ?? null],
      tipo_reparacion_id: [this.bitacora.tipo_reparacion?.id ?? null],
      tiempo_solucion:[this.bitacora.tiempo_solucion ?? null]
    })

    this.configService.bitacorasFinalizar().subscribe((resp) => {
      this.causa = resp.causa;
      this.consecuencia = resp.consecuencia;
      this.tipoReparacion = resp.tipoReparacion;
    });
  }

  guardar() {

    if (!this.bitacora.latitud || !this.bitacora.longitud) {
      this.utilities.snackBar('La bitacora no puede ser cerrada, no cuenta con latitud y longitud');
      return; // Detén el flujo si no son válidos
    }

    const result = {
      ...this.bitacora,
      ...this.datosForm.value,
    };

    this.bitacoraService
      .finalizar(result)
      .subscribe((resp) => {
        console.log(resp);
        if (resp.message == 403) {
          this.snackBar('Falta ingresar datos');
        } else {
          this.snackBar('Registro Exitoso');
          this.dialogRef.close();
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
