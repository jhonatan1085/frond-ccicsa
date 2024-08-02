import { Component } from '@angular/core';
import { DataService } from 'src/app/shared/data/data.service';
import { RolesService } from '../service/roles.service';

@Component({
  selector: 'app-add-role-user',
  templateUrl: './add-role-user.component.html',
  styleUrls: ['./add-role-user.component.scss'],
})
export class AddRoleUserComponent {
  sideBar: any[] = [];
  name = '';
  permissions: any[] = [];
  valid_form = false;
  valid_form_success = false;

  text_validation: any = null;
  constructor(
    public DataService: DataService,
    public RoleService: RolesService
  ) {}

  ngOnInit(): void {
    this.sideBar = this.DataService.sideBar[0].menu;
  }

  addPermission(subMenu: any) {
    if (subMenu.permision) {
      const INDEX = this.permissions.findIndex(
        (item: any) => item == subMenu.permision
      );
      if (INDEX != -1) {
        this.permissions.splice(INDEX, 1);
      } else {
        this.permissions.push(subMenu.permision);
      }
      console.log(this.permissions);
    }
  }

  save() {
    this.valid_form = false;
    console.log(this.name, this.permissions);

    if (!this.name || this.permissions.length == 0) {
      this.valid_form = true;
      return;
    }

    const data = {
      name: this.name,
      permisions: this.permissions,
    };

    this.valid_form_success = false;
    this.RoleService.storeRoles(data).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
        return;
      } else {
        this.name = '';
        this.permissions = [];
        this.valid_form_success = true;

        const SIDE_BAR = this.sideBar;
        this.sideBar = [];
        setTimeout(() => {
          this.sideBar = SIDE_BAR;
        }, 50);
      }
    });
  }
}
