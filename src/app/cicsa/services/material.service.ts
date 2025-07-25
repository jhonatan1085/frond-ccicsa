import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import {
  AgregaMaterialesBitacora,
  CrudResponse,
  Material,
  MaterialCreate,
  MovimientoMaterial,
  Page,
} from '../modelos';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class MaterialService extends AbstractCrudService<MaterialCreate> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'materiales');
  }

  autocomplete(brigada_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/autocomplete/${brigada_id}`;
    return this.http.get<Page<Material>>(URL, { headers: headers });
  }

  listMaterialesBitacora(bitacora_id: number, brigada_id: number) {
    const data = {
      bitacora_id,
      brigada_id,
    };
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/materiales-bitacora`;
    //return this.http.get<Page<MovimientoMaterial>>(URL, { headers: headers });
    return this.http.post<Page<MovimientoMaterial>>(URL, data, {
      headers: headers,
    });
  }

cargaMasiva(data: MaterialCreate[]){
const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/carga-masiva`;
    return this.http.post<CrudResponse>(URL, data, {headers: headers });
}

}
