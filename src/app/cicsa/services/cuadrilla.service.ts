import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Cuadrilla, Page } from 'src/app/cicsa/modelos';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class CuadrillaService extends AbstractCrudService<Cuadrilla> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'brigadas');
  }

  listConfig() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/config`;
    return this.http.get(URL, { headers: headers });
  }

  activa() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = `${URL_SERVICIOS}/${this.endpoint}/brigadaactiva`;
    return this.http.get<Page<Cuadrilla>>(URL, { headers: headers });
  }
}
