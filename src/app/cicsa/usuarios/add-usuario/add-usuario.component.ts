import { Component } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';

@Component({
  selector: 'app-add-usuario',
  templateUrl: './add-usuario.component.html',
  styleUrls: ['./add-usuario.component.scss']
})
export class AddUsuarioComponent {
  public selectedValue !: string;
  public selectedEducacion !: string;
  public selectedZona !: string;

  public name: string = '';
  public surname: string = '';
  public cel_corp: string = '';
  public dni: string = '';
  public cel_per: string = '';
  public email: string = '';
  public password: string = '';
  public password_confirmation: string = '';
  public birth_date: string = '';
  public gender: number = 1;
  public education: string = '';
  public designation: string = '';
  public address: string = '';

  public roles:any = [];
  public educacions:any = [];
  public zonas:any = [];

  public FILE_AVATAR:any;
  public IMAGEN_PREVIZUALIZA:any = 'assets/img/user-06.jpg';

  public text_success:string = '';
  public text_validation:string = '';

  constructor(
    public usuariosService: UsuariosService,
  ){

  }

  ngOnInit():void {
    this.usuariosService.listConfig().subscribe((resp:any) =>{
      console.log(resp);
      this.roles = resp.roles;
      this.educacions = resp.educacions;
      this.zonas = resp.zonas
    })
  }

  save(){
    this.text_validation = '';
    if(!this.name || !this.email || !this.surname || !this.FILE_AVATAR || !this.password){
      this.text_validation = "LOS CAMPOS SON NECESARIOS (nombre, apellidos, email, avatar)"
      return;
    }

    if(this.password != this.password_confirmation ){
      this.text_validation = "LAS CONTRASEÑAS DEBEN SER IGUALES"
      return;
    }
    console.log(this.selectedValue);
    let formData = new FormData();
    formData.append("name",this.name);
    formData.append("surname",this.surname);
    formData.append("email",this.email);
    formData.append("cel_corp",this.cel_corp);
    formData.append("cel_per",this.cel_per);
    formData.append("dni",this.dni);


    formData.append("birth_date",this.birth_date);
    formData.append("gender",this.gender+"");
    formData.append("address",this.address);
    formData.append("password",this.password);
    formData.append("role_id",this.selectedValue);
    formData.append("educacion_id",this.selectedEducacion);
    formData.append("zona_id",this.selectedZona);
    formData.append("imagen",this.FILE_AVATAR);

    this.usuariosService.registerUser(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.text_validation = resp.message_text;
      }else{
        this.text_success = 'El usuario ha sido registrado correctamente';
        this.name='';
        this.surname='';
        this.email='';
        this.cel_corp='';
        this.cel_per='';
        this.dni='';
        this.birth_date='';
        this.gender=1;
        this.education='';
        this.designation='';
        this.address='';
        this.password='';
        this.password_confirmation='';
        this.selectedValue='';
      this.selectedEducacion = '';
      this.selectedZona = '';
        this.FILE_AVATAR = null;
        this.IMAGEN_PREVIZUALIZA = null;
      }
      

    })
  }

  loadFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
     // alert("SOLO SE ADMITEN IMAGENES");
      this.text_validation = "SOLO SE ADMITEN IMAGENES";
      return;
    }
    this.text_validation = '';
    this.FILE_AVATAR = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.FILE_AVATAR);
    reader.onloadend = () => this.IMAGEN_PREVIZUALIZA = reader.result;
  }
}
