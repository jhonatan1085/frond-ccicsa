import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AgregaMaterialesBitacora, CrudResponse, Material, MovimientoMaterial, Page } from '../modelos';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root',
})
export class MaterialService extends AbstractCrudService<Material> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'materiales');
  }

  autocomplete(zona_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/autocomplete/${zona_id}`;
    return this.http.get<Page<Material>>(URL, { headers: headers });
  }


    listMAterialesBitacora(bitacora_id: number, almacen_id: number) {

const data = {
    bitacora_id,
    almacen_id
  };
      const headers = this.getHeaders();
      const URL = `${URL_SERVICIOS}/${this.endpoint}/materiales-bitacora`;
      //return this.http.get<Page<MovimientoMaterial>>(URL, { headers: headers });
      return this.http.post<Page<MovimientoMaterial>>(URL, data, { headers: headers });
    }
}
