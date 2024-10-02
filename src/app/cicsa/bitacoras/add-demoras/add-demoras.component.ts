
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Bitacora, Tipo } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { ConfigService } from '../../services/config.service';
import { AtencionBitacora, DemoraBitacora } from '../../modelos';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
@Component({
  selector: 'app-add-demoras',
  templateUrl: './add-demoras.component.html',
  styleUrls: ['./add-demoras.component.scss']
})
export class AddDemorasComponent {

  tipoDemora: Tipo[] = [];
  demoras: DemoraBitacora[] = [];
  demorasForm: FormGroup;

  bitacora: Bitacora;
  constructor(
    public dialogRef: MatDialogRef<AddDemorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bitacora: Bitacora },
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private configService: ConfigService,
    private fb: FormBuilder,
  ) {
    this.bitacora = data.bitacora;

    this.demorasForm = this.fb.group({
      demoras: this.fb.array([], Validators.required),
    });
  }

  ngOnInit() {
    this.configService.bitacorasDemoras().subscribe((resp) => {
      this.tipoDemora = resp.demoras;
    });

    this.bitacoraService
      .listDemoras(this.bitacora.id)
      .subscribe((resp) => {
        this.demoras = resp.data;
        this.demorasForm.reset();
        this.demoras.forEach((demora) => {
          this.addDemora(demora, false);
        });
      });
  }


  newDemora() {
    const maxId = this.demoras.reduce((prev,item) => {
      return Math.max(prev,item.id??0)
    },0) //reduce una manera de sumar
    const newDemora = {
      id:maxId + 1 ,
      bitacora_id: this.bitacora.id,
      tipo_demora_id:0,
      fecha_inicio: '',
      fecha_fin: '',
      orden: this.demoras.length + 1,
    };
    this.addDemora(newDemora, true);

  }

  addDemora(demora: DemoraBitacora, update: boolean) {
    const demoras = this.demorasForm.get('demoras') as FormArray;
    const demorasValue = demoras.value;
    const INDEX = demorasValue.findIndex(
      (item: DemoraBitacora) => item.id == demora.id
    );
    if (INDEX != -1) {
      demoras.removeAt(INDEX);
    } else {
      demoras.push(
        this.fb.group({
          id: [demora.id],
          bitacora_id: [demora.bitacora_id],
          tipo_demora_id: [demora.tipo_demora_id],
          fecha_inicio: [demora.fecha_inicio],
          fecha_fin: [demora.fecha_fin],
          orden: [demora.orden],
        })
      );
    }

    this.demorasForm.setControl('demoras', demoras)
    if (update)
      this.demoras = demoras.value
  }



  /*   guardar() {
      const formData = new FormData();
      formData.append('id', '' + this.bitacora.id);
      formData.append('causa', '' + this.bitacora.causa_averia.id);
      formData.append('consecuencia', '' + this.bitacora.consecuencia_averia.id);
      formData.append('tipoReparacion', '' + this.bitacora.tipo_reparacion.id);
      formData.append('herramientas', this.bitacora.herramientas);
      formData.append('tiempo', this.bitacora.tiempo_solucion);
  
      this.bitacoraService
        .finalizar( formData)
        .subscribe((resp) => {
          console.log(resp);
          if (resp.message == 403) {
            //this.snackBar(resp.message_text);
            this.snackBar('Falta ingresar datos');
          } else {
            this.snackBar('Registro Exitoso');
            this.router.navigate(['/bitacoras/list-bitacora']);
          }
        });
    } */

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }
}
