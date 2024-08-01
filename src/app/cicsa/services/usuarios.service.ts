import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AbstractCrudService } from './abstract-crud.service';
import { Tipo, Usuario, Zona } from '../modelos';

@Injectable({
  providedIn: 'root',
})
export class UsuariosService extends AbstractCrudService<Usuario> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'staffs');
  }

  listConfig() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/config`;
    return this.http.get<{ roles: Tipo[]; educacions: Tipo[]; zonas: Tipo[] }>(
      URL,
      {
        headers: headers,
      }
    );
  }

  //retorna la tecnicos por zona
  showUserZona(zona_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/usuario-zona-tecnico/${zona_id}`;
    return this.http.get<Zona>(URL, { headers: headers });
  }

  showResponsables(zona_id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/usuario-zona-responsables/${zona_id}`;
    return this.http.get<{ lidercicsa: unknown; liderclaro: unknown }>(URL, {
      headers: headers,
    });
  }
}
