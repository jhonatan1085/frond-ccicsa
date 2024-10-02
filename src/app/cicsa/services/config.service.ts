import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import {
  Config,
  Departamento,
  Distrito,
  Provincia,
  Role,
  Tipo,
} from '../modelos';
import { AbstractCrudService } from './abstract-crud.service';

export interface UsuariosConfig {
  roles: Role[];
  educacions: Tipo[];
  zonas: Tipo[];
}
export interface SitesConfig {
  distritos: Distrito[];
  provincias: Provincia[];
  departamentos: Departamento[];
  tipoEnergia: Tipo[];
  prioridad: Tipo[];
  tipoAcceso: Tipo[];
  contratistas: Tipo[];
  roomtypes: Tipo[];
  consesionarias: Tipo[];
  regionGeograficas: Tipo[];
  regions: Tipo[];
  tiposites: Tipo[];
  municipalidades: Tipo[];
  zonas: Tipo[];
}

export interface BitacorasConfig {
  serv: Tipo[];
  red: Tipo[];
  tipoaveria: Tipo[];
  zonas: Tipo[];
}
export interface BitacorasFinalizarConfig {
  tipoReparacion: Tipo[];
  consecuencia: Tipo[];
  causa: Tipo[];
}
export interface BitacorasDemorasConfig {
  demoras: Tipo[];
}
export interface CuadrillasConfig {
  contratistas: Tipo[];
  zonas: Tipo[];
  tipobrigadas: Tipo[];
}

export interface UnidadesMovilesConfig {
  colores: Tipo[];
  marcas: Tipo[];
  modelos: Tipo[];
}

@Injectable({
  providedIn: 'root',
})
export class ConfigService extends AbstractCrudService<Config> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'config');
  }

  usuarios() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/usuarios`;
    return this.http.get<UsuariosConfig>(URL, {
      headers,
    });
  }

  
  lideres() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/lideres`;
    return this.http.get<UsuariosConfig>(URL, {
      headers,
    });
  }

  sites() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/sites`;
    return this.http.get<SitesConfig>(URL, {
      headers,
    });
  }

  bitacoras() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/bitacoras/start`;
    return this.http.get<BitacorasConfig>(URL, {
      headers,
    });
  }

  bitacorasFinalizar() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/bitacoras/end`;
    return this.http.get<BitacorasFinalizarConfig>(URL, {
      headers,
    });
  }

  bitacorasDemoras() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/bitacoras/demoras`;
    return this.http.get<BitacorasDemorasConfig>(URL, {
      headers,
    });
  }


  cuadrillas() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/brigadas`;
    return this.http.get<CuadrillasConfig>(URL, {
      headers,
    });
  }
  unidadesMoviles() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/unidades-moviles`;
    return this.http.get<UnidadesMovilesConfig>(URL, {
      headers,
    });
  }

}
