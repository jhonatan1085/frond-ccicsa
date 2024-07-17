import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) { }

  listUsers() {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/staffs";
    return this.http.get(URL, { headers: headers });

  }

  listConfig() {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/staffs/config";
    return this.http.get(URL, { headers: headers });
  }

  registerUser(data: any) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/staffs";
    return this.http.post(URL, data, { headers: headers });
  }

  showUser(staff_id: string) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/staffs/" + staff_id;
    return this.http.get(URL, { headers: headers });

  }

  updateUser(staff_id: string, data: any) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/staffs/" + staff_id;
    return this.http.post(URL, data, { headers: headers });
  }

  deleteUSer(staff_id: string) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/staffs/" + staff_id;
    return this.http.delete(URL, { headers: headers });
  }


  //retorna la tecnicos por zona
  showUserZona(zona_id: string) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/usuariozonatecnico/" + zona_id;
    return this.http.get(URL, { headers: headers });
  }

  showResponsables(zona_id: string) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/usuariozonaresponsables/" + zona_id;
    return this.http.get(URL, { headers: headers });
  }
}
