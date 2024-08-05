import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { CrudResponse, Site } from '../modelos';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class LocationService extends AbstractCrudService<Site> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'sites');
  }

  showProvinciasDep(dep_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/provinciasdep/${dep_id}`;
    return this.http.get(URL, { headers: headers });
  }

  showDistritoProv(dist_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/distritoprov/${dist_id}`;
    return this.http.get(URL, { headers: headers });
  }

  createLocationBitacora(data: any) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/bitacoras/localizacion`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }
}
