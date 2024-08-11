import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { DataService } from 'src/app/shared/data/data.service';
import { MenuItem, SideBarData, UserAuth } from 'src/app/shared/models/models';
import { routes } from 'src/app/shared/routes/routes';
import { SideBarService } from 'src/app/shared/side-bar/side-bar.service';

const userStorageTag = 'user';
const adminRole = 'Admin';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  base = '';
  page = '';
  currentUrl = '';
  classAdd = false;

  multilevel: Array<boolean> = [false, false, false];

  routes = routes;
  sidebarData: SideBarData[] = [];
  user: UserAuth;

  constructor(
    private data: DataService,
    private router: Router,
    private sideBar: SideBarService
  ) {
    const USER = localStorage.getItem(userStorageTag);
    this.user = JSON.parse(USER ?? '');
    //inicio
    if (this.user.roles.includes(adminRole)) {
      this.sidebarData = this.data.sideBar;
    } else {
      //vamos a filtrar y validar que opciones puede ver ese rol
      const permissions = this.user.permissions;

      const SIDE_BAR_G: SideBarData[] = [];

      this.data.sideBar.forEach((side) => {
        const SIDE_B: unknown[] = [];
        side.menu.forEach((menu_s) => {
          const SUB_MENUS = menu_s.subMenus.filter(
            (submenu) =>
              permissions.includes(submenu.permision) && submenu.show_nav
          );
          if (SUB_MENUS.length > 0) {
            menu_s.subMenus = SUB_MENUS;
            SIDE_B.push(menu_s);
          }
        });

        if (SIDE_B.length > 0) {
          side.menu = SIDE_B as any[];
          SIDE_BAR_G.push(side);
        }
      });
      //this.sidebarData = this.data.sideBar;
      this.sidebarData = SIDE_BAR_G;
    }

    //fin
    router.events.subscribe((event: object) => {
      if (event instanceof NavigationEnd) {
        this.getRoutes(event);
      }
    });
    this.getRoutes(this.router);
  }

  public expandSubMenus(menu: MenuItem): void {
    sessionStorage.setItem('menuValue', menu.menuValue);
    this.sidebarData.map((mainMenus: SideBarData) => {
      mainMenus.menu.map((resMenu: MenuItem) => {
        if (resMenu.menuValue == menu.menuValue) {
          menu.showSubRoute = !menu.showSubRoute;
        } else {
          resMenu.showSubRoute = false;
        }
      });
    });
  }
  private getRoutes(route: { url: string }): void {
    this.sideBar.expandSideBar.next(false);
    const bodyTag = document.body;
    bodyTag.classList.remove('slide-nav');
    bodyTag.classList.remove('opened');
    this.currentUrl = route.url;

    const splitVal = route.url.split('/');

    this.base = splitVal[1];
    this.page = splitVal[2];
  }

  public miniSideBarMouseHover(position: string): void {
    if (position == 'over') {
      this.sideBar.expandSideBar.next(true);
    } else {
      this.sideBar.expandSideBar.next(false);
    }
  }
}
