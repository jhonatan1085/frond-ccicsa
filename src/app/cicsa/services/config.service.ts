import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { Config } from '../modelos';
import { AbstractCrudService } from './abstract-crud.service';

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
}
