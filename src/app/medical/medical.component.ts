import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../shared/data/data.service';
import { SideBarData, MenuItem } from '../shared/models/models';
import { SideBarService } from '../shared/side-bar/side-bar.service';
interface Route {
  url: string;
  // Add other properties if necessary
}
@Component({
  selector: 'app-medical',
  templateUrl: './medical.component.html',
  styleUrls: ['./medical.component.scss'],
})
export class MedicalComponent {
  public miniSidebar = false;
  public expandMenu = false;
  public mobileSidebar = false;
  public sideBarActivePath = false;
  public headerActivePath = false;
  base = '';
  page = '';
  currentUrl = '';

  constructor(
    private sideBar: SideBarService,
    public router: Router,
    private data: DataService
  ) {
    this.sideBar.toggleSideBar.subscribe((res) => {
      this.miniSidebar = res;
    });

    this.sideBar.toggleMobileSideBar.subscribe((res) => {
      this.mobileSidebar = res;
    });

    this.sideBar.expandSideBar.subscribe((res) => {
      this.expandMenu = res;
      if (!res && this.miniSidebar) {
        this.data.sideBar.map((mainMenus: SideBarData) => {
          mainMenus.menu.map((resMenu: MenuItem) => {
            resMenu.showSubRoute = false;
          });
        });
      }
      if (res && this.miniSidebar) {
        this.data.sideBar.map((mainMenus: SideBarData) => {
          mainMenus.menu.map((resMenu: MenuItem) => {
            const menuValue = sessionStorage.getItem('menuValue');
            if (menuValue && menuValue == resMenu.menuValue) {
              resMenu.showSubRoute = true;
            } else {
              resMenu.showSubRoute = false;
            }
          });
        });
      }
    });
    this.getRoutes(this.router);
  }
  public toggleMobileSideBar(): void {
    this.sideBar.switchMobileSideBarPosition();
  }
  private getRoutes(route: Route): void {
    if (route.url.split('/')[2] === 'confirm-mail') {
      this.sideBarActivePath = false;
      this.headerActivePath = false;
    } else {
      this.sideBarActivePath = true;
      this.headerActivePath = true;
    }
  }
}
