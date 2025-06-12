import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  AtencionBitacora,
  Bitacora,
  CrudResponse,
  Page,
  DemoraBitacora,
  WhatsappGroup,
} from 'src/app/cicsa/modelos';
import {  URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AbstractCrudService } from './abstract-crud.service';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class BitacorasService extends AbstractCrudService<Bitacora> {

private apiUrlEnviaWhasap = 'http://localhost:3000/api/enviar-whatsapp';
private apiUrlNode = 'http://localhost:3000/api/qr';

  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'bitacoras');
  }

  createAtencionBitacora(data: AtencionBitacora | FormData) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/atenciones`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

  finalizar(data: AtencionBitacora | FormData) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/finalizar`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

  demoras(data: AtencionBitacora | FormData) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/demoras`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

  listAtencion(bitacora_id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/atencion/${bitacora_id}`;
    return this.http.get<Page<AtencionBitacora>>(URL, { headers: headers });
  }

  listDemoras(bitacora_id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/demoras/${bitacora_id}`;
    return this.http.get<Page<DemoraBitacora>>(URL, { headers: headers });
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

  exportExcel() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/exportaBitacoras`;
    return this.http.get<Page<Bitacora>>(URL, { headers: headers });
  }

  closedSot(bitacora_id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/closed-sot/${bitacora_id}`;
    return this.http.patch<CrudResponse>(URL,{},{ headers: headers });
  }


    groupWhastApp(tipoAveria_id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/group-whastApp/${tipoAveria_id}`;
    return this.http.get<Page<WhatsappGroup>>(URL, { headers: headers });
  }


}
