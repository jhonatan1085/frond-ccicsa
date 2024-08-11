import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { DataService } from '../data/data.service';
interface MainMenu {
  menu: MenuItem[];
}

interface MenuItem {
  menuValue: string;
  showSubRoute: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class SideBarService {
  public toggleSideBar: BehaviorSubject<boolean>;
  public toggleMobileSideBar: BehaviorSubject<boolean>;
  public expandSideBar: BehaviorSubject<boolean>;
  constructor(private data: DataService) {
    const toggleSideBar = this.getBooleanValue(
      localStorage.getItem('isMiniSidebar') || 'false'
    );
    const toggleMobileSideBar = this.getBooleanValue(
      localStorage.getItem('isMobileSidebar') || 'false'
    );
    const expandSideBar = false;
    this.toggleSideBar = new BehaviorSubject(toggleSideBar);
    this.toggleMobileSideBar = new BehaviorSubject(toggleMobileSideBar);
    this.expandSideBar = new BehaviorSubject(expandSideBar);
  }

  public switchSideMenuPosition(): void {
    if (this.toggleSideBar.value) {
      this.toggleSideBar.next(false);
      localStorage.removeItem('isMiniSidebar');
      this.data.sideBar.map((mainMenus: MainMenu) => {
        mainMenus.menu.map((resMenu: MenuItem) => {
          const menuValue = sessionStorage.getItem('menuValue');
          if (menuValue && menuValue == resMenu.menuValue) {
            resMenu.showSubRoute = true;
          }
        });
      });
    } else {
      this.toggleSideBar.next(true);
      localStorage.setItem('isMiniSidebar', 'true');
      this.data.sideBar.map((mainMenus: MainMenu) => {
        mainMenus.menu.map((resMenu: MenuItem) => {
          resMenu.showSubRoute = false;
        });
      });
    }
  }

  public switchMobileSideBarPosition(): void {
    console.log(localStorage.getItem('isMobileSidebar'));
    if (localStorage.getItem('isMobileSidebar')) {
      this.toggleMobileSideBar.next(false);
      localStorage.removeItem('isMobileSidebar');
    } else {
      this.toggleMobileSideBar.next(true);
      localStorage.setItem('isMobileSidebar', 'true');
    }
  }

  private getBooleanValue(value: string): boolean {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return Boolean(value);
  }
}
