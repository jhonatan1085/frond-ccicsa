import { Component } from '@angular/core';
import { UsuariosService } from '../../services/usuarios.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-edit-usuario',
  templateUrl: './edit-usuario.component.html',
  styleUrls: ['./edit-usuario.component.scss'],
})
export class EditUsuarioComponent {
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

  public roles: any[] = [];
  public educacions: any[] = [];
  public zonas: any[] = [];
  public FILE_AVATAR: any;
  IMAGEN_PREVIZUALIZA = 'assets/img/user-06.jpg';

  public text_success = '';
  public text_validation = '';

  public usuario_id?: number;
  public usuario_selected: any;

  constructor(
    public usuariosService: UsuariosService,
    public activeRoute: ActivatedRoute // para las variables enviadas al formulario
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((resp) => {
      console.log(resp);
      this.usuario_id = Number(resp['id']);

      this.usuariosService.read(this.usuario_id).subscribe((resp: any) => {
        console.log(resp);
        this.usuario_selected = resp.user;

        this.selectedValue = this.usuario_selected.role.id;
        this.selectedEducacion = this.usuario_selected.educacion.id;
        this.selectedZona = this.usuario_selected.zona.id;

        this.name = this.usuario_selected.name;
        this.surname = this.usuario_selected.surname;
        this.cel_corp = this.usuario_selected.cel_corp;
        this.dni = this.usuario_selected.dni;
        this.cel_per = this.usuario_selected.cel_per;

        this.email = this.usuario_selected.email;
        this.birth_date = new Date(
          this.usuario_selected.birth_date
        ).toISOString();
        this.gender = this.usuario_selected.gender;
        this.education = this.usuario_selected.education;
        this.designation = this.usuario_selected.designation;
        this.address = this.usuario_selected.address;
        this.IMAGEN_PREVIZUALIZA = this.usuario_selected.avatar;
      });
    });

    this.usuariosService.listConfig().subscribe((resp) => {
      console.log(resp);
      this.roles = resp.roles;
      this.educacions = resp.educacions;
      this.zonas = resp.zonas;
    });
  }

  save() {
    this.text_validation = '';
    if (!this.name || !this.email || !this.surname) {
      this.text_validation =
        'LOS CAMPOS SON NECESARIOS (nombre, apellidos, email)';
      return;
    }

    if (this.password) {
      if (this.password != this.password_confirmation) {
        this.text_validation = 'LAS CONTRASEÑAS DEBEN SER IGUALES';
        return;
      }
    }

    console.log(this.selectedValue);
    const formData = new FormData();
    formData.append('name', this.name);
    formData.append('surname', this.surname);
    formData.append('email', this.email);
    formData.append('cel_corp', this.cel_corp);
    formData.append('dni', this.dni);
    formData.append('cel_per', this.cel_per);

    formData.append('birth_date', this.birth_date);
    formData.append('gender', this.gender + '');

    if (this.education) {
      formData.append('education', this.education);
    }
    if (this.designation) {
      formData.append('designation', this.designation);
    }
    if (this.address) {
      formData.append('address', this.address);
    }

    if (this.password) {
      formData.append('password', this.password);
    }
    formData.append('role_id', this.selectedValue);
    if (this.FILE_AVATAR) {
      formData.append('imagen', this.FILE_AVATAR);
    }
    if (this.usuario_id) {
      this.usuariosService
        .update(this.usuario_id, formData)
        .subscribe((resp) => {
          console.log(resp);
          if (resp.message == 403) {
            this.text_validation = resp.message_text;
          } else {
            this.text_success = 'El usuario ha editado correctamente';
          }
        });
    } else {
      console.error('No user id present');
    }
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
    reader.onloadend = () =>
      (this.IMAGEN_PREVIZUALIZA = reader.result as string);
  }
}
