import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { routes } from 'src/app/shared/routes/routes';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  public routes = routes;
  public passwordClass = false;
  public ERROR = false;

  form = new FormGroup({
    email: new FormControl('jhonatan1085@gmail.com', [
      Validators.required,
      Validators.email,
    ]),
    password: new FormControl('12345678', [Validators.required]),
  });

  get f() {
    return this.form.controls;
  }

  constructor(public auth: AuthService, public router: Router) {}

  loginFormSubmit() {
    if (this.form.valid) {
      this.ERROR = false;
      this.auth
        .login(this.form.value.email ?? '', this.form.value.password ?? '')
        .subscribe({
          next: (resp: any) => {
            if (resp) {
              this.router.navigate([routes.adminDashboard]);
            } else {
              // alert("EL USUARIO O CONTRASEÑA SON INCORRECTOS, NO EXITEN");
              this.ERROR = true;
            }
          },
          error: (error) => {
            console.log(error);
          },
        });
    }
  }
  togglePassword() {
    this.passwordClass = !this.passwordClass;
  }
}
