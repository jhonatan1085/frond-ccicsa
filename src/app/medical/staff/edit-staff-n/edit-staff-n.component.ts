import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ConfigService } from 'src/app/cicsa/services/config.service';
import { UsuariosService } from 'src/app/cicsa/services/usuarios.service';

@Component({
  selector: 'app-edit-staff-n',
  templateUrl: './edit-staff-n.component.html',
  styleUrls: ['./edit-staff-n.component.scss'],
})
export class EditStaffNComponent implements OnInit {
  public selectedValue!: string;

  public name = '';
  public surname = '';
  public mobile = '';
  public email = '';
  public password = '';
  public password_confirmation = '';
  public birth_date = '';
  public gender = 1;
  public education = '';
  public designation = '';
  public address = '';

  public roles: any[] = [];
  public FILE_AVATAR: any;
  public IMAGEN_PREVIZUALIZA: any = 'assets/img/user-06.jpg';

  public text_success = '';
  public text_validation = '';

  public staff_id: any;
  public staff_selected: any;

  constructor(
    public staffService: UsuariosService,
    public configService: ConfigService,
    public activeRoute: ActivatedRoute // para las variables enviadas al formulario
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe((resp) => {
      console.log(resp);
      this.staff_id = resp['id'];
    });

    this.staffService.read(this.staff_id).subscribe((resp) => {
      console.log(resp);
      this.staff_selected = resp;

      this.selectedValue = this.staff_selected.role.id;
      this.name = this.staff_selected.name;
      this.surname = this.staff_selected.surname;
      this.mobile = this.staff_selected.mobile;
      this.email = this.staff_selected.email;
      this.birth_date = new Date(this.staff_selected.birth_date).toISOString();
      this.gender = this.staff_selected.gender;
      this.education = this.staff_selected.education;
      this.designation = this.staff_selected.designation;
      this.address = this.staff_selected.address;
      this.IMAGEN_PREVIZUALIZA = this.staff_selected.avatar;
    });

    this.configService.usuarios().subscribe((resp: any) => {
      console.log(resp);
      this.roles = resp.roles;
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
    formData.append('mobile', this.mobile);
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

    this.staffService.update(this.staff_id, formData).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
      } else {
        this.text_success = 'El usuario ha editado correctamente';
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
