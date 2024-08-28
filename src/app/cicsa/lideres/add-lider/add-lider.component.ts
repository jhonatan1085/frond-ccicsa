import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfigService } from '../../services/config.service';
import { Role, Tipo, Usuario } from '../../modelos';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { LiderService } from '../../services/lider.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-add-lider',
  templateUrl: './add-lider.component.html',
  styleUrls: ['./add-lider.component.scss']
})
export class AddLiderComponent  implements OnInit {
  public selectedValue!: string;
  public selectedEducacion!: string;
  public selectedZona!: string;

  public name = '';
  public surname = '';
  public cel_corp = '';
  public dni = '';
  public cel_per = '';
  public email = '';
  public password = '';
  public password_confirmation = '';
  public birth_date = '';
  public gender = 1;
  public education = '';
  public designation = '';
  public address = '';

  public roles: Role[] = [];
  public educacions: Tipo[] = [];
  public zonas: Tipo[] = [];

  public FILE_AVATAR: any;
  public IMAGEN_PREVIZUALIZA: string | ArrayBuffer | null =
    'assets/img/user-06.jpg';

  public text_success = '';
  public text_validation = '';

  lider: Usuario = {
    zona: {} as any,
    educacion: {} as any,
    role: {} as any,
  } as any;


  datosForm: FormGroup;
  zonasForm: FormGroup;

  constructor(
    public usuariosService: UsuariosService,
    public liderService: LiderService,
    public configService: ConfigService,
    private fb: FormBuilder,
    private activateRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private router: Router,
  ) {
    this.datosForm = this.fb.group({
      name: [null, Validators.required],
      surname: [null, Validators.required],
      email: [null, Validators.required],
      cel_corp: [],
      cel_per: [],
      dni:  [null, Validators.required],
      birth_date: [null, Validators.required],
      gender: [],
      address: [],
      password: [null, Validators.required],
      password_confirmation: [null, Validators.required],
      role_id: [null, Validators.required],
      educacion_id: [null, Validators.required],
      zona_id: [null, Validators.required],
    });
   this.zonasForm = this.fb.group({
      zonas: this.fb.array([], Validators.required),
    });
  }

  ngOnInit(): void {
    this.getLiderFromParams();
    this.getConfig();
  }
  
  private getConfig() {
    this.configService.lideres().subscribe((resp) => {
      console.log(resp);
      this.roles = resp.roles;
      this.educacions = resp.educacions;
      this.zonas = resp.zonas;
    });
  }
  private getLiderFromParams() {
    /*  this.activateRoute.params
      .pipe(
        filter((params) => params['id']),
        switchMap((params) => this.liderService.read(params['id']))
      )
      .subscribe((resp) => {
        this.lider = resp;
        this.datosForm.patchValue({
          ...this.lider, //los campos que tiene bitacora
          role_id: resp.role.id, //campos especiales
          zona_id: resp.zona.id,
          educacion_id: resp.educacion.id,
        });
      });  */
  }

  addZona(zona: Tipo) {
    
    const zonas = this.zonasForm.get('zonas') as FormArray;
    const brigadasValue = zonas.value;
    const INDEX = brigadasValue.findIndex(
      (item: Tipo) => item.id == zona.id
    );
    if (INDEX != -1) {
      zonas.removeAt(INDEX);
    } else {
      zonas.push(
        this.fb.group({
          id: [zona.id],
          nombre: [zona.nombre]
        })
      );
    }
  }

  save() {
    const result = {
      ...this.lider,
      ...this.datosForm.value,
      ...this.zonasForm.value,
    };

    this.liderService.create(result).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.snackBar('Falta ingresar datos');
      } else {
        this.snackBar('Registro Exitoso');
        this.router.navigate(['/lideres/list-lideres']);
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
  loadFile($event: any) {
    if ($event.target.files[0].type.indexOf('image') < 0) {
      // alert("SOLO SE ADMITEN IMAGENES");
      this.text_validation = 'SOLO SE ADMITEN IMAGENES';
      return;
    }
    this.text_validation = '';
    this.FILE_AVATAR = $event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
    reader.onloadend = () => (this.IMAGEN_PREVIZUALIZA = reader.result);
  }
}
