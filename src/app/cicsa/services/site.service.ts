import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AbstractCrudService } from './abstract-crud.service';
import { CrudResponse, Distrito, Page, Provincia, Site } from '../modelos';
@Injectable({
  providedIn: 'root',
})
export class SiteService extends AbstractCrudService<Site> {
  constructor(
    public override http: HttpClient,
    public override authService: AuthService
  ) {
    super(http, authService, 'sites');
  }

  showProvinciasDep(dep_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/provincias/depto/${dep_id}`;
    return this.http.get<Page<Provincia>>(URL, { headers: headers });
  }

  showDistritoProv(dist_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/distritos/provincia/${dist_id}`;
    return this.http.get<Page<Distrito>>(URL, { headers: headers });
  }

  autocomplete(site_search = '') {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/autocomplete?search=${site_search}`;
    return this.http.get<Page<Site>>(URL, { headers: headers });
  }
}
