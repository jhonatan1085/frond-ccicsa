import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AtencionBitacora, Bitacora } from '../../modelos';

@Injectable({
  providedIn: 'root',
})
export class BitacorasService {
  constructor(public http: HttpClient, public authService: AuthService) {}

  readAll(page = 1, search = '') {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras?page=' + page + '&search=' + search;
    return this.http.get<Bitacora[]>(URL, { headers: headers });
  }

  listConfig() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras/config';
    return this.http.get(URL, { headers: headers });
  }

  registerBitacora(data: any) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras';
    return this.http.post(URL, data, { headers: headers });
  }

  registerAtencionBitacora(data: any) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras/addAtencionBitacora';
    return this.http.post(URL, data, { headers: headers });
  }

  registerEndBitacora(data: any) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras/endBitacora';
    return this.http.post(URL, data, { headers: headers });
  }

  //retorna la provincia
  showProvinciasDep(dep_id: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/provinciasdep/' + dep_id;
    return this.http.get(URL, { headers: headers });
  }
  showDistritoProv(dist_id: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/distritoprov/' + dist_id;
    return this.http.get(URL, { headers: headers });
  }

  showSite(site_id: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/sites/' + site_id;
    return this.http.get(URL, { headers: headers });
  }

  updateSite(site_id: string, data: any) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/sites/' + site_id;
    return this.http.post(URL, data, { headers: headers });
  }

  listAtencion(bitacora_id: number) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras/atencion/' + bitacora_id;
    return this.http.get<AtencionBitacora[]>(URL, { headers: headers });
  }

  read(bitacora_id: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras/viewBitacora/' + bitacora_id;
    return this.http.get<Bitacora>(URL, { headers: headers });
  }

  listEndConfig() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/bitacoras/endConfig';
    return this.http.get(URL, { headers: headers });
  }
}
