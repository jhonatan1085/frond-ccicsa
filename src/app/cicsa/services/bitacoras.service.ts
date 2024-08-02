import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AtencionBitacora,
  Bitacora,
  CrudResponse,
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

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (resp) => {
          resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude });
        },
        (err) => {
          reject(err);
        }
      );
    });
  }
}
