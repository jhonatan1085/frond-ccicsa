import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { Atencion, AtencionBitacora, Bitacora, BitacoraAtencion } from 'src/app/modelos/Modelos';

import { BitacorasService } from '../services/bitacoras.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-detalle-bitacoras',
  templateUrl: './add-detalle-bitacoras.component.html',
  styleUrls: ['./add-detalle-bitacoras.component.scss'],

})
export class AddDetalleBitacorasComponent {

  //bitacora: Bitacora;

  public itemDetails: number[] = [0];

  atenciones: AtencionBitacora[]=[];

  public bitacora_id: any;

  constructor(
    public bitacorasServices: BitacorasService,
    public activeRoute: ActivatedRoute, // para las variables enviadas al formulario
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {

  }

  ngOnInit(): void {

    this.activeRoute.params.subscribe((resp: any) => {
      this.bitacora_id = resp.bitacora;
    });

    this.bitacorasServices.listAtencion(this.bitacora_id).subscribe((resp: AtencionBitacora[]) => {
      this.atenciones = resp
    })

  }


  addItemAtencion(atencion: AtencionBitacora) {

    if (atencion.bitacora_atencion.length == 0) {
      atencion.bitacora_atencion?.push({
        id: 0,
        hora: '',
        descripcion: '',
        orden: atencion.orden,
        atencion_id: atencion.id,
        bitacora_id: this.bitacora_id,
        parent_id:0,
        bitacora_atencion: []
      });
    }

  }
  addItem(bitacoraAtencion: BitacoraAtencion) {

    bitacoraAtencion.bitacora_atencion?.push({
      id: 0,
      hora: '',
      descripcion: '',
      orden: bitacoraAtencion.bitacora_atencion.length + 1,
      atencion_id: bitacoraAtencion.atencion_id,
      bitacora_id: bitacoraAtencion.bitacora_id,
      parent_id: bitacoraAtencion.atencion_id,
      bitacora_atencion:[]
    });

    console.log(this.atenciones)
  }

  deleteItem(bitacoraAtencion: any, index: number) {
    bitacoraAtencion.bitacora_atencion?.splice(index, 1)
    bitacoraAtencion.bitacora_atencion?.forEach((hijo:any, i:number) => hijo.orden = i + 1)
  }

  guardar(){
    console.log(this.atenciones)

    const formData = new FormData();
    formData.append("id", this.bitacora_id);
    formData.append("atenciones", JSON.stringify(this.atenciones));

    this.bitacorasServices.registerAtencionBitacora(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.snackBar('Falta ingresar datos');
      } else {
        this.snackBar('Registro Exitoso');
       // this.router.navigate(['/bitacoras/list-bitacora']);
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
}
