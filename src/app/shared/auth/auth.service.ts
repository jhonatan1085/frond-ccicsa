import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
// import { BehaviorSubject } from 'rxjs';
import { routes } from '../routes/routes';
import { URL_SERVICIOS } from 'src/app/config/config';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';
import { Auth, UserAuth } from '../models/models';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user?: UserAuth;
  token?: string;

  constructor(private router: Router, public http: HttpClient) {
    this.getLocalStorage();
  }

  getLocalStorage() {
    if (localStorage.getItem('token') && localStorage.getItem('user')) {
      const USER = localStorage.getItem('user');
      this.user = JSON.parse(USER ? USER : '');
      this.token = localStorage.getItem('token') ?? undefined;
    } else {
      this.user = undefined;
      this.token = undefined;
    }
    console.log(this.user, this.token);
  }

  login(email: string, password: string) {
    //localStorage.setItem('authenticated', 'true');
    //this.router.navigate([routes.adminDashboard]);
    const URL = URL_SERVICIOS + '/auth/login';

    return this.http.post<Auth>(URL, { email: email, password: password }).pipe(
      map((auth: Auth) => {
        console.log(auth);
        const result = this.saveLocalStorage(auth);
        return result;
      }),
      catchError((error: unknown) => {
        console.log(error);
        return of(undefined);
      })
    );
  }

  saveLocalStorage(auth: Auth) {
    if (auth && auth.access_token) {
      localStorage.setItem('token', auth.access_token);
      localStorage.setItem('user', JSON.stringify(auth.user));
      localStorage.setItem('authenticated', 'true');
      return true;
    } else {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('authenticated');
    this.router.navigate([routes.login]);
  }
}
