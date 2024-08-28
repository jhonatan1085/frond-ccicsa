import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ConfigService } from '../../services/config.service';
import { Tipo } from 'src/app/cicsa/modelos/modelos';
import { UnidadesMovilesService } from '../../services/unidades-moviles.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-unidades-moviles',
  templateUrl: './add-unidades-moviles.component.html',
  styleUrls: ['./add-unidades-moviles.component.scss']
})
export class AddUnidadesMovilesComponent implements OnInit {
  // formularios
  datosForm: FormGroup;

  colores: Tipo[] = [];
  marcas: Tipo[] = [];
  modelos: Tipo[] = [];
  constructor(
    private configService: ConfigService,
    private fb: FormBuilder,
    private unidadMovilService: UnidadesMovilesService,
    private _snackBar: MatSnackBar,
  ) {
    this.datosForm = this.fb.group({
      marca: [null, Validators.required],
      modelo_id: [null, Validators.required],
      color_id: [null, Validators.required],
      placa: [null, Validators.required],
      kilometraje: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getConfig();
  }
  private getConfig() {
    this.configService.unidadesMoviles().subscribe((resp) => {
      console.log(resp)
      this.colores = resp.colores;
      this.marcas = resp.marcas;
      this.modelos = resp.modelos;
    });
  }


  saveUnidadMovil() {
    console.log(this.datosForm.value);
    const result = {
      ...this.datosForm.value,
    };
    this.unidadMovilService.create(result).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.snackBar('Falta ingresar datos');
      } else {
        this.snackBar('Registro Exitoso');
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
