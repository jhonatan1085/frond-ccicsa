import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
    UnidadMovil,
  CrudResponse,
  Page,
} from 'src/app/cicsa/modelos';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { AbstractCrudService } from './abstract-crud.service';

@Injectable({
  providedIn: 'root',
})
export class UnidadesMovilesService extends AbstractCrudService<UnidadMovil> {
  
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'unidades-moviles');
  }

}
