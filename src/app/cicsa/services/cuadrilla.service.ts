import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudResponse, Cuadrilla, CuadrillaCreate, CuadrillaUpdate, Page } from 'src/app/cicsa/modelos';
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

  createCuadrilla(data: CuadrillaCreate) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

    updateCuadrilla(id: number,  data: CuadrillaUpdate) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/${id}`;
    return this.http.put<CrudResponse>(URL, data, { headers: headers });
  }

  activa() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/activas`;
    return this.http.get<Page<Cuadrilla>>(URL, { headers: headers });
  }
}
