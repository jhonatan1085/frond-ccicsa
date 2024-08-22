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
    private fb: FormBuilder
  ) {
    this.datosForm = this.fb.group({
      marca: [null, Validators.required],
      modelo: [null, Validators.required],
      color: [null, Validators.required],
      placa: [null, Validators.required],
      kilometraje: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getConfigBitacora();
  }
  private getConfigBitacora() {
    this.configService.unidadesMoviles().subscribe((resp) => {
      this.colores = resp.colores;
      this.marcas = resp.marcas;
      this.modelos = resp.modelos;
    });
  }

}
