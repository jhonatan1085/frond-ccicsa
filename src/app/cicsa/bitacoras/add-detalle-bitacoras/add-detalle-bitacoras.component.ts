import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AtencionBitacora, BitacoraAtencion, Page } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { TimeUtilsService } from '../../services/time-utils.service';

@Component({
  selector: 'app-add-detalle-bitacoras',
  templateUrl: './add-detalle-bitacoras.component.html',
  styleUrls: ['./add-detalle-bitacoras.component.scss'],

})
export class AddDetalleBitacorasComponent implements OnInit {
  //bitacora: Bitacora;

  public itemDetails: number[] = [0];

  atenciones: AtencionBitacora[] = [];

  public bitacora_id = 0;

  constructor(
    public bitacorasServices: BitacorasService,
    public activeRoute: ActivatedRoute, // para las variables enviadas al formulario
    private _snackBar: MatSnackBar,
    private router: Router,
    private time_utils: TimeUtilsService,
  ) { }

  ngOnInit(): void {
    this.activeRoute.params.subscribe((resp) => {
      this.bitacora_id = resp['bitacora'];
    });

    this.bitacorasServices
      .listAtencion(this.bitacora_id)
      .subscribe((resp) => {
        console.log(resp.data);
        this.atenciones = resp.data;
      });
  }

  addItemAtencion(atencion: AtencionBitacora) {

    const now = this.time_utils.getLocalDateTime();

    if (atencion.bitacora_atencion.length == 0) {
      atencion.bitacora_atencion?.push({
        id: 0,
        hora: now,
        descripcion: '',
        orden: atencion.orden,
        is_coment: '0',
        atencion_id: atencion.id,
        bitacora_id: this.bitacora_id,
        parent_id: 0,
        bitacora_atencion: [],
      });
    }
  }

  valida(bitacoraAtencion: BitacoraAtencion) {
    if (bitacoraAtencion.bitacora_atencion.at(-1)?.is_coment == '0') {
      return (
        bitacoraAtencion.bitacora_atencion.at(-1)?.descripcion != '' &&
        bitacoraAtencion.bitacora_atencion.at(-1)?.hora != ''
      );
    } else {
      return bitacoraAtencion.bitacora_atencion.at(-1)?.descripcion != '';
    }
  }

  addItem(bitacoraAtencion: BitacoraAtencion, is_comentario: string) {
    const now = this.time_utils.getLocalDateTime();
    if (this.valida(bitacoraAtencion)) {
      bitacoraAtencion.bitacora_atencion?.push({
        id: 0,
        hora: now,
        descripcion: '',
        is_coment: is_comentario,
        orden: bitacoraAtencion.bitacora_atencion.length + 1,
        atencion_id: bitacoraAtencion.atencion_id,
        bitacora_id: bitacoraAtencion.bitacora_id,
        parent_id: bitacoraAtencion.atencion_id,
        bitacora_atencion: [],
      });
    } else {
      this.snackBar('Falta completar datos');
    }
  }

  deleteItemHijo(bitacoraAtencion: BitacoraAtencion, index: number) {
    bitacoraAtencion.bitacora_atencion?.splice(index, 1);
    bitacoraAtencion.bitacora_atencion?.forEach(
      (hijo: BitacoraAtencion, i: number) => (hijo.orden = i + 1)
    );
  }
  deleteItem(atencion: AtencionBitacora, index: number) {
    atencion.bitacora_atencion.splice(index, 1);
  }

  guardar() {
    console.log(this.atenciones);
    const formData = new FormData();
    formData.append('id', '' + this.bitacora_id);
    formData.append('atenciones', JSON.stringify(this.atenciones));

    

    this.bitacorasServices
      .createAtencionBitacora(formData)
      .subscribe((resp) => {
        console.log(resp);
        if (resp.message == 403) {
          this.snackBar('Falta ingresar datos');
        } else {
          this.snackBar('Registro Exitoso');
          this.router.navigate(['/bitacoras/list-bitacora']);
        }
      });
  }

  cancel() {
    this.router.navigate(['/bitacoras/list-bitacora']);
  }

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}