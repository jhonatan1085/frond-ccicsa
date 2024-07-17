import { Component } from '@angular/core';
import { CuadrillaService } from '../service/cuadrilla.service';
import { UsuariosService } from '../../usuarios/service/usuarios.service';
import { ListCuadrillaComponent } from '../list-cuadrilla/list-cuadrilla.component';
import { MatSnackBar } from '@angular/material/snack-bar';
declare var $: any;
@Component({
  selector: 'app-add-cuadrilla',
  templateUrl: './add-cuadrilla.component.html',
  styleUrls: ['./add-cuadrilla.component.scss']
})
export class AddCuadrillaComponent {

  public selectedTipobrigadas !: string;
  public selectedContratistas !: string;
  public selectedZona !: string;

  public tipobrigadas: any = [];
  public contratistas: any = [];
  public zonas: any = [];
  public users: any = [];

  public text_success: string = '';
  public text_validation: string = '';

  public user_selecteds: any = [];

  constructor(
    public cuadrillaService: CuadrillaService,
    public usuarioService: UsuariosService,
    public listaCuadrilla: ListCuadrillaComponent,
    private _snackBar: MatSnackBar
  ) {

  }

  ngOnInit(): void {
    this.cuadrillaService.listConfig().subscribe((resp: any) => {
      console.log(resp);
      this.tipobrigadas = resp.tipobrigadas;
      this.zonas = resp.zonas;
      this.contratistas = resp.contratistas;
    })
  }


  tecnicos() {
    this.user_selecteds = [];
    this.usuarioService.showUserZona(this.selectedZona).subscribe((resp: any) => {
      console.log(resp);
      this.users = resp.usuarios
    })
  }

  addUser(user: any, islider = 0) {


    let id_movil = null;

    console.log(user.unidad_movil.length)

    if (user.unidad_movil.length > 0) {
      user.unidad_movil.forEach((movil: any) => {
        id_movil = movil.id
      });
    }
    let INDEX = this.user_selecteds.findIndex((us: any) =>
      us.user_id == user.id);
    if (INDEX != -1) {
      this.user_selecteds.splice(INDEX, 1);
    } else {
      this.user_selecteds.push({
        "user_id": user.id,
        "movil_id": id_movil,
        "is_lider": islider,
      });
    }

    console.log(this.user_selecteds);
  }

  addLider(user: any) {

    const existe = this.user_selecteds.findIndex((us: any) =>
      us.is_lider == 1);

    if (existe != -1) {

      const INDEX = this.user_selecteds.findIndex((us: any) =>
        us.user_id == user.id && us.is_lider == 1);

      if (INDEX != -1) {
        const replace = {
          "user_id": this.user_selecteds[INDEX].user_id,
          "movil_id": this.user_selecteds[INDEX].movil_id,
          "is_lider": 0,
        }
        this.user_selecteds.splice(INDEX, 1, replace);
      } else {
        console.log('no se puede agregar otro cliente')
      }

    } else {

      let exislider = this.user_selecteds.findIndex((us: any) =>
        us.user_id == user.id);
      if (exislider != -1) {
        let replace = {
          "user_id": this.user_selecteds[exislider].user_id,
          "movil_id": this.user_selecteds[exislider].movil_id,
          "is_lider": 1,
        }
        this.user_selecteds.splice(exislider, 1, replace);
      } else {
        this.addUser(user, 1);
      }
      console.log('hace lo otro');
    }
    console.log(this.user_selecteds)
  }

  isCheck(user: any) {

    let INDEX = this.user_selecteds.findIndex((us: any) => us.user_id == user.id);
    if (INDEX != -1) {
      return true;
    } else {
      return false;
    }
  }

  islider(user: any) {
    let INDEX = this.user_selecteds.findIndex((us: any) => us.user_id == user.id && us.is_lider == 1);
    if (INDEX != -1) {
      return false;
    } else {
      let exis = this.user_selecteds.findIndex((us: any) => us.is_lider == 1);
      if (exis != -1) {
        return true;
      } else {
        return false;
      }
    }
  }


  snackBar(comentario: any) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000
    });
  }
  saveCuadrilla() {

    if (this.user_selecteds.length == 0) {
      console.log(this.user_selecteds.length);
      this.snackBar('No selecciono tecnico')
      return;
    }

    const INDEX = this.user_selecteds.findIndex((us: any) => us.is_lider == 1);
    console.log(INDEX);
    if (INDEX == -1) {
      console.log(this.user_selecteds.length);
      this.snackBar('No selecciono Lider')
      return;
    }


    let formData = new FormData();
    formData.append("zona_id", this.selectedZona);
    formData.append("tipo_brigada_id", this.selectedTipobrigadas);
    formData.append("contratista_id", this.selectedContratistas);
    formData.append("tecnicos", JSON.stringify(this.user_selecteds));


    this.cuadrillaService.registerCuadrilla(formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {

        this.snackBar('Falta ingresar datos');

      } else {
        
        this.snackBar('Registro Exitoso');

        this.listaCuadrilla.getTableData();
        $('#add_cuadrilla').hide();
        $('#add_cuadrilla').removeClass("show");
        $(".modal-backdrop").remove();
        $("body").removeClass();
        $("body").removeAttr("style");

        this.selectedZona = '';
        this.selectedTipobrigadas = '';
        this.selectedContratistas = '';
        this.user_selecteds = [];
        this.users = [];
      }


    })
  }
}
