
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';


@Injectable({
  providedIn: 'root'
})
export class CuadrillaService {

  constructor(
    public http: HttpClient,
    public authService: AuthService
  ) { }

  listCuadrillas(page: number = 1, search: string = '') {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/brigadas?page=" + page + "&search=" + search;
    return this.http.get(URL, { headers: headers });
  }


  listConfig() {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/brigadas/config";
    return this.http.get(URL, { headers: headers });
  }

  brigadaactiva() {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/brigadas/brigadaactiva";
    return this.http.get(URL, { headers: headers });
  }

  registerCuadrilla(data: any) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/brigadas";
    return this.http.post(URL, data, { headers: headers });
  }

  showCuadrilla(cuadrilla_id: string) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/brigadas/" + cuadrilla_id;
    return this.http.get(URL, { headers: headers });

  }

  updateCuadrilla(cuadrilla_id: string, data: any) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/brigadas/" + cuadrilla_id;
    return this.http.post(URL, data, { headers: headers });
  }

  inactivaCuadrilla(cuadrilla_id: string) {
    let headers = new HttpHeaders({ 'Authorization': 'Bearer ' + this.authService.token })
    let URL = URL_SERVICIOS + "/brigadas/" + cuadrilla_id;
    return this.http.delete(URL, { headers: headers });
  }

}
