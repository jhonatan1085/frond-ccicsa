import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AbstractCrudService } from './abstract-crud.service';
import { AgregaMaterialesBitacora, CrudResponse, Movimiento } from '../modelos';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class MovimientoService extends AbstractCrudService<Movimiento> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'movimientos');
  }

  guardarMaterialesEnBitacora(data: AgregaMaterialesBitacora) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/materiales-bitacora`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

    cargaMaterialesBrigada(data: Movimiento[]) {
      const headers = this.getHeaders();
      const URL = `${URL_SERVICIOS}/${this.endpoint}/agrega-material-brigada`;
      return this.http.post<CrudResponse>(URL, data, { headers: headers });
    }
}
