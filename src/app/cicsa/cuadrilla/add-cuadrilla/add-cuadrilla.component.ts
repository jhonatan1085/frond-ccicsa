import { Component } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../services/config.service';
import { CuadrillaService } from '../../services/cuadrilla.service';
import { UsuariosService } from '../../services/usuarios.service';
import { Tipo } from '../../modelos';
import { UtilitiesService } from '../../services/utilities.service';

// declare const $: any;

@Component({
  selector: 'app-add-cuadrilla',
  templateUrl: './add-cuadrilla.component.html',
  styleUrls: ['./add-cuadrilla.component.scss'],
})
export class AddCuadrillaComponent {
  selectedTipobrigadas!: string;
  selectedContratistas!: string;
  selectedZona!: string;
  nombre!:string;
  tipobrigadas: any[] = [];
  contratistas: any[] = [];
  zonas: Tipo[] = [];
  users: any[] = [];

  text_success = '';
  text_validation = '';

  user_selecteds: any[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddCuadrillaComponent>,
    private cuadrillaService: CuadrillaService,
    private configService: ConfigService,
    private usuarioService: UsuariosService,
    private _snackBar: MatSnackBar,
    private utilities:UtilitiesService
  ) {
    this.configService.cuadrillas().subscribe((resp) => {
      this.tipobrigadas = resp.tipobrigadas;
      this.zonas = resp.zonas;
      this.contratistas = resp.contratistas;
    });
  }

  tecnicos() {
    this.user_selecteds = [];
    this.usuarioService.showUserZona(this.selectedZona).subscribe((resp) => {
      console.log(resp);
      this.users = resp.data;
    });
  }

  addUser(user: any, islider = 0) {
    let id_movil = null;

    console.log(user.unidad_movil.length);

    if (user.unidad_movil.length > 0) {
      user.unidad_movil.forEach((movil: any) => {
        id_movil = movil.id;
      });
    }
    const INDEX = this.user_selecteds.findIndex(
      (us: any) => us.user_id == user.id
    );
    if (INDEX != -1) {
      this.user_selecteds.splice(INDEX, 1);
    } else {
      this.user_selecteds.push({
        user_id: user.id,
        movil_id: id_movil,
        is_lider: islider,
      });
    }

    console.log(this.user_selecteds);
  }

  addLider(user: any) {
    const existe = this.user_selecteds.findIndex((us: any) => us.is_lider == 1);

    if (existe != -1) {
      const INDEX = this.user_selecteds.findIndex(
        (us: any) => us.user_id == user.id && us.is_lider == 1
      );

      if (INDEX != -1) {
        const replace = {
          user_id: this.user_selecteds[INDEX].user_id,
          movil_id: this.user_selecteds[INDEX].movil_id,
          is_lider: 0,
        };
        this.user_selecteds.splice(INDEX, 1, replace);
      } else {
        console.log('no se puede agregar otro cliente');
      }
    } else {
      const exislider = this.user_selecteds.findIndex(
        (us: any) => us.user_id == user.id
      );
      if (exislider != -1) {
        const replace = {
          user_id: this.user_selecteds[exislider].user_id,
          movil_id: this.user_selecteds[exislider].movil_id,
          is_lider: 1,
        };
        this.user_selecteds.splice(exislider, 1, replace);
      } else {
        this.addUser(user, 1);
      }
      console.log('hace lo otro');
    }
    console.log(this.user_selecteds);
  }

  isCheck(user: any) {
    const INDEX = this.user_selecteds.findIndex(
      (us: any) => us.user_id == user.id
    );
    if (INDEX != -1) {
      return true;
    } else {
      return false;
    }
  }

  islider(user: any) {
    const INDEX = this.user_selecteds.findIndex(
      (us: any) => us.user_id == user.id && us.is_lider == 1
    );
    if (INDEX != -1) {
      return false;
    } else {
      const exis = this.user_selecteds.findIndex((us: any) => us.is_lider == 1);
      if (exis != -1) {
        return true;
      } else {
        return false;
      }
    }
  }


  saveCuadrilla() {
    if (this.user_selecteds.length == 0) {
      console.log(this.user_selecteds.length);
      this.utilities.snackBar('No selecciono tecnico');
      return;
    }

    const INDEX = this.user_selecteds.findIndex((us: any) => us.is_lider == 1);
    console.log(INDEX);
    if (INDEX == -1) {
      console.log(this.user_selecteds.length);
      this.utilities.snackBar('No selecciono Lider');
      return;
    }

    const formData = new FormData();
    formData.append('zona_id', this.selectedZona);
    formData.append('tipo_brigada_id', this.selectedTipobrigadas);
    formData.append('contratista_id', this.selectedContratistas);
    formData.append('nombre', this.nombre);
    formData.append('tecnicos', JSON.stringify(this.user_selecteds));

    this.cuadrillaService.create(formData).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.utilities.snackBar('Falta ingresar datos');
      } else {
        this.utilities.snackBar('Registro Exitoso');

        this.dialogRef.close();

        this.selectedZona = '';
        this.selectedTipobrigadas = '';
        this.selectedContratistas = '';
        this.nombre = '';
        this.user_selecteds = [];
        this.users = [];
        //
        this.refresh();
      }
    });
  }

  refresh() {
    this.configService.cuadrillas().subscribe((resp) => {
      this.tipobrigadas = resp.tipobrigadas;
      this.zonas = resp.zonas;
      this.contratistas = resp.contratistas;
    });
  }
}
