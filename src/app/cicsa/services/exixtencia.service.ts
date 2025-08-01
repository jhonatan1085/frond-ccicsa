import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AbstractCrudService } from './abstract-crud.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import {
  AgregaMaterialesBitacora,
  CrudResponse,
  Existencias,
  Material,
  MaterialCreate,
  MovimientoMaterial,
  Page,
} from '../modelos';
import { URL_SERVICIOS } from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class ExixtenciaService extends AbstractCrudService<Existencias> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'existencias');
  }
  
}
