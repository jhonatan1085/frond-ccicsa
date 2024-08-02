import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfigService } from '../../services/config.service';
import { Role, Tipo } from '../../modelos';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss'],
})
export class AddUsuarioComponent implements OnInit {
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

  constructor(
    public usuariosService: UsuariosService,
    public configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.configService.usuarios().subscribe((resp) => {
      console.log(resp);
      this.roles = resp.roles;
      this.educacions = resp.educacions;
      this.zonas = resp.zonas;
    });
  }

  save() {
    this.text_validation = '';
    if (!this.name || !this.email || !this.surname || !this.password) {
      this.text_validation =
        'LOS CAMPOS SON NECESARIOS (nombre, apellidos, email)';
      return;
    }

    if (this.password != this.password_confirmation) {
      this.text_validation = 'LAS CONTRASEÑAS DEBEN SER IGUALES';
      return;
    }
    console.log(this.selectedValue);
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    formData.append('cel_corp', this.cel_corp);
    formData.append('cel_per', this.cel_per);
    formData.append('dni', this.dni);

    formData.append('birth_date', this.birth_date);
    formData.append('gender', this.gender + '');
    formData.append('address', this.address);
    formData.append('password', this.password);
    formData.append('role_id', this.selectedValue);
    formData.append('educacion_id', this.selectedEducacion);
    formData.append('zona_id', this.selectedZona);
    formData.append('imagen', this.FILE_AVATAR);

    this.usuariosService.create(formData).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
      } else {
        this.text_success = 'El usuario ha sido registrado correctamente';
        this.name = '';
        this.surname = '';
        this.email = '';
        this.cel_corp = '';
        this.cel_per = '';
        this.dni = '';
        this.birth_date = '';
        this.gender = 1;
        this.education = '';
        this.designation = '';
        this.address = '';
        this.password = '';
        this.password_confirmation = '';
        this.selectedValue = '';
        this.selectedEducacion = '';
        this.selectedZona = '';
        this.FILE_AVATAR = null;
        this.IMAGEN_PREVIZUALIZA = null;
      }
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
