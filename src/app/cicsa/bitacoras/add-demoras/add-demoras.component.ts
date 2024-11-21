
import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Bitacora, Tipo } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { ConfigService } from '../../services/config.service';
import { AtencionBitacora, DemoraBitacora,DemoraBitacoraExtended } from '../../modelos';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NumberValueAccessor,
  Validators,
} from '@angular/forms';
import { TimeUtilsService } from '../../services/time-utils.service';



@Component({
  selector: 'app-add-demoras',
  templateUrl: './add-demoras.component.html',
  styleUrls: ['./add-demoras.component.scss']
})
export class AddDemorasComponent {

  tipoDemora: Tipo[] = [];
  demorasBitacora: DemoraBitacoraExtended[] = [];
  demorasForm: FormGroup;

  bitacora: Bitacora;

  get demorasArray(): FormArray {
    return this.demorasForm.controls['demo'] as FormArray;
  }

  totalDemoras: string = "";

  constructor(
    public dialogRef: MatDialogRef<AddDemorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bitacora: Bitacora },
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private configService: ConfigService,
    private fb: FormBuilder,
    private router: Router,
    private time_utils: TimeUtilsService,
  ) {
    this.bitacora = data.bitacora;
    this.demorasForm = this.fb.group({
      demo: this.fb.array([], Validators.required),
    });
  }

  ngOnInit() {
    this.configService.bitacorasDemoras().subscribe((resp) => {
      this.tipoDemora = resp.demoras;
    });

    this.bitacoraService
      .listDemoras(this.bitacora.id)
      .subscribe((resp) => {
        this.demorasBitacora = resp.data.map((item) => {
          return {
            ...item, tiempoDemora: ""
          }

        });
        this.updateTiempoDemoras(null);
        this.updateTotalDemoras(this.demorasBitacora);

        this.demorasForm.reset();
        this.demorasBitacora.forEach((demora) => {
          this.addDemora(demora, false);
        });
      });
  }


  newDemora() {

    const now = this.time_utils.getLocalDateTime();

    const maxId = this.demorasBitacora.reduce((prev, item) => {
      return Math.max(prev, item.id ?? 0)
    }, 0) //reduce una manera de sumar
    const newDemora = {
      id: maxId + 1,
      bitacora_id: this.bitacora.id,
      tipo_demora_id: 0,
      fecha_inicio: now,
      fecha_fin: now,
      orden: this.demorasBitacora.length + 1,
    };
    this.addDemora(newDemora, true);
  }

  removeDemora(i: number) {
    this.addDemora({ id: i } as any, true);
  }

  addDemora(demora: DemoraBitacora, update: boolean) {
    const demoras = this.demorasForm.get('demo') as FormArray;
    const demorasValue = demoras.value;
    const INDEX = demorasValue.findIndex(
      (item: DemoraBitacora) => item.id == demora.id
    );
    if (INDEX != -1) {
      demoras.removeAt(INDEX);
    } else {
      demoras.push(
        this.fb.group({
          id: [demora.id, Validators.required],
          bitacora_id: [demora.bitacora_id, Validators.required],
          tipo_demora_id: [demora.tipo_demora_id, [Validators.required, Validators.min(1)]],
          fecha_inicio: [demora.fecha_inicio, Validators.required],
          fecha_fin: [demora.fecha_fin, Validators.required],
          orden: [demora.orden, Validators.required],
        }, { validators: this.time_utils.fechaEjecucionMayorValidator(
          'fecha_inicio',
          'fecha_fin'
        ) })
      );
    }

    this.demorasForm.setControl('demo', demoras)
    if (update) {
      this.demorasBitacora = demoras.value;
      this.updateTiempoDemoras(null);
    }
  }
  
 save() {
    console.log(this.bitacora);
    console.log(this.demorasForm.value);
    const result = {
      ...this.bitacora,
      ...this.demorasForm.value
    };

    console.log(result)

    this.bitacoraService
      .demoras(result)
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
  }

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  calcularTiempoDemora(item: DemoraBitacora) {
    const fechaFin = new Date(item.fecha_fin).valueOf();
    const fechaInicio = new Date(item.fecha_inicio).valueOf();
    const diferencia = fechaFin - fechaInicio;
    
    const horas = Math.floor(diferencia / 1000 / 60 / 60); //saca las horas sin decimales
    const minutos = diferencia / 1000 / 60 - horas * 60;
    return horas.toString().padStart(2, "0") + ":" + minutos.toString().padStart(2, "0");
  }

  updateTotalDemoras(demorasBitacora: DemoraBitacoraExtended[]) {
    let totalDemoras = 0;
    for (let index = 0; index < demorasBitacora.length; index++) {
      const item = demorasBitacora[index];
      const fechaFin = new Date(item.fecha_fin).valueOf();
      const fechaInicio = new Date(item.fecha_inicio).valueOf();
      const diferencia = fechaFin - fechaInicio;
      totalDemoras += diferencia;
    }
    const horas = Math.floor(totalDemoras / 1000 / 60 / 60); //saca las horas sin decimales
    const minutos = totalDemoras / 1000 / 60 - horas * 60;
    this.totalDemoras = horas.toString().padStart(2, "0") + ":" + minutos.toString().padStart(2, "0");
  }

  updateTiempoDemoras(target: any, tipo?: 'inicio' | 'fin', demora?: DemoraBitacora) {
    this.demorasBitacora = this.demorasBitacora.map((item) => {
      if (item.id === demora?.id) {
        if (tipo === 'inicio') {
          item.fecha_inicio = target.value
        } else if (tipo === 'fin') {
          item.fecha_fin = target.value
        }
      }
      return { ...item, tiempoDemora: this.calcularTiempoDemora(item) }
    })

    this.updateTotalDemoras(this.demorasBitacora);
  }

  // Validador personalizado
  fechaValidator(formGroup: FormGroup) {
    const fecha_inicio = formGroup.get('fecha_inicio')?.value;
    const fecha_fin = formGroup.get('fecha_fin')?.value;

    if (fecha_inicio && fecha_fin && new Date(fecha_inicio) > new Date(fecha_fin)) {
      return { fechasInvalidas: true };
    }
    return null;
  }

}
