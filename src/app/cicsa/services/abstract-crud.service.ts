import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { CrudResponse, Page, ReadOptions } from '../modelos';
import { URL_SERVICIOS } from 'src/app/config/config';

export abstract class AbstractCrudService<T> {
  constructor(
    public http: HttpClient,
    public authService: AuthService,
    public endpoint: string
  ) {}

  protected getHeaders() {
    return new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
  }

  create(data: T | FormData) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}`;
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

  readAll(options: ReadOptions = { page: 1, search: '', perPage: 10 })  {
    const { page, search, perPage } = options;
    const headers = this.getHeaders();
    let url = `${URL_SERVICIOS}/${this.endpoint}`;
    const params = [];
    if (page && page > 0) params.push(`page=${page}`);
    if (perPage && perPage > 0) params.push(`perPage=${perPage}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get<Page<T>>(url, { headers: headers });
  }

  /*
  readAll(options: ReadOptions = { page: 1, search: '' }) {
    const { page, search } = options;
    const headers = this.getHeaders();
    let url = `${URL_SERVICIOS}/${this.endpoint}`;
    const params = [];
    if (page && page > 0) params.push(`page=${page}`);
    if (search) params.push(`search=${search}`);
    if (params.length > 0) url += `?${params.join('&')}`;
    return this.http.get<Page<T>>(url, { headers: headers });
  }*/

  read(id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/${id}`;
    return this.http.get<T>(URL, { headers: headers });
  }

  update(id: number, data: T | FormData) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/${id}`;
    return this.http.put<CrudResponse>(URL, data, { headers: headers });
  }

  delete(id: number) {
    const headers = this.getHeaders();
    const URL = `${URL_SERVICIOS}/${this.endpoint}/${id}`;
    return this.http.delete<CrudResponse>(URL, { headers: headers });
  }
}
