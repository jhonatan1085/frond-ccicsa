import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AbstractCrudService } from './abstract-crud.service';
import { Site } from '../modelos';
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

  listConfig() {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/config`;
    return this.http.get(URL, { headers: headers });
  }

  showProvinciasDep(dep_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/provinciasdep/${dep_id}`;
    return this.http.get(URL, { headers: headers });
  }

  showDistritoProv(dist_id: string) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/distritoprov/${dist_id}`;
    return this.http.get(URL, { headers: headers });
  }

  showSiteAutocomplete(site_search = '') {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/sitesautocomplete?search=${site_search}`;
    return this.http.get<{ sites: string }>(URL, { headers: headers });
  }
}
