import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AtencionBitacora,
  Bitacora,
  CrudResponse,
  Tipo,
} from 'src/app/cicsa/modelos';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class BitacorasService extends AbstractCrudService<Bitacora> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'bitacoras');
  }

  createAtencionBitacora(data: AtencionBitacora | FormData) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/addAtencionBitacora`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

  listAtencion(bitacora_id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/atencion/${bitacora_id}`;
    return this.http.get<AtencionBitacora[]>(URL, { headers: headers });
  }

  listConfig() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/config`;
    return this.http.get<{ tipoaveria: Tipo[]; red: Tipo[]; serv: Tipo[] }>(
      URL,
      {
        headers: headers,
      }
    );
  }
}
