import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserAuth } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  public routes = routes;
  public openBox = false;
  public miniSidebar = false;
  public addClass = false;
  public user?: UserAuth;

  constructor(
    public router: Router,
    private sideBar: SideBarService,
    public auth: AuthService
  ) {
    this.sideBar.toggleSideBar.subscribe((res) => {
      this.miniSidebar = res;
    });
    this.user = this.auth.user;
  }

  openBoxFunc() {
    this.openBox = !this.openBox;
    /* eslint no-var: off */
    var mainWrapper = document.getElementsByClassName('main-wrapper')[0];
    if (this.openBox) {
      mainWrapper.classList.add('open-msg-box');
    } else {
      mainWrapper.classList.remove('open-msg-box');
    }
  }

  logout() {
    this.auth.logout();
  }

  public toggleSideBar(): void {
    this.sideBar.switchSideMenuPosition();
  }


public toggleMobileSideBar(): void {
  this.addClass = !this.addClass;

  const html = document.documentElement;
  const sidebar = document.getElementById('sidebar');
  const wrapper = document.querySelector('.main-wrapper');
  const overlay = document.querySelector('.sidebar-overlay');

  if (this.addClass) {
    html.classList.add('menu-opened');
    wrapper?.classList.add('slide-nav');
    sidebar?.classList.add('opened');

    // solo agregar overlay si no existe
    if (!overlay) {
      const overlayDiv = document.createElement('div');
      overlayDiv.classList.add('sidebar-overlay');
      overlayDiv.addEventListener('click', () => this.toggleMobileSideBar());
      document.body.appendChild(overlayDiv);
    }

    this.sideBar.toggleMobileSideBar.next(true);
    localStorage.setItem('isMobileSidebar', 'true');
  } else {
    html.classList.remove('menu-opened');
    wrapper?.classList.remove('slide-nav');
    sidebar?.classList.remove('opened');

    // eliminar el overlay
    overlay?.remove();

    this.sideBar.toggleMobileSideBar.next(false);
    localStorage.removeItem('isMobileSidebar');
  }
}

  /*
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();

    this.addClass = !this.addClass;

    /* eslint no-var: off 
    var root = document.getElementsByTagName('html')[0];
    /* eslint no-var: off 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    var sidebar: any = document.getElementById('sidebar');

    if (this.addClass) {
      root.classList.add('menu-opened');
      sidebar.classList.add('opened');
    } else {
      root.classList.remove('menu-opened');
      sidebar.classList.remove('opened');
    }
  }*/
}
