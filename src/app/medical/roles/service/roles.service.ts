import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CrudResponse, Page, Role } from 'src/app/cicsa/modelos';
import { URL_SERVICIOS } from 'src/app/config/config';
import { AuthService } from 'src/app/shared/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(public http: HttpClient, public authService: AuthService) {}

  listRoles() {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/roles';
    return this.http.get<Page<Role>>(URL, { headers: headers });
  }

  showRoles(id_role: string) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/roles/' + id_role;
    return this.http.get(URL, { headers: headers });
  }

  storeRoles(data: { name: string; permisions: any[] }) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/roles';
    return this.http.post<CrudResponse>(URL, data, { headers: headers });
  }

  editRoles(data: { name: string; permisions: any[] }, id_role: number) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/roles/' + id_role;
    return this.http.put<CrudResponse>(URL, data, { headers: headers });
  }

  deleteRoles(id_role: number) {
    const headers = new HttpHeaders({
      Authorization: 'Bearer ' + this.authService.token,
    });
    const URL = URL_SERVICIOS + '/roles/' + id_role;
    return this.http.delete(URL, { headers: headers });
  }
}
