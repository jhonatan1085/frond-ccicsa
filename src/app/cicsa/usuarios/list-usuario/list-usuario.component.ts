import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { UsuariosService } from '../../services/usuarios.service';
declare var $: any;

@Component({
  selector: 'app-list-usuario',
  templateUrl: './list-usuario.component.html',
  styleUrls: ['./list-usuario.component.scss'],
})
export class ListUsuarioComponent implements OnInit {
  public usersList: any[] = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild('closebutton') closebutton: any;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: number[] = [];
  public currentPage = 1;
  public pageNumberArray: number[] = [];
  public pageSelection: any[] = [];
  public totalPages = 0;

  public users_generals: any[] = [];
  public user_selected: any;

  constructor(public UsuarioService: UsuariosService) {}
  ngOnInit() {
    this.getTableData();
  }
  private getTableData(): void {
    this.usersList = [];
    this.serialNumberArray = [];

    this.UsuarioService.readAll().subscribe((resp) => {
      this.totalData = resp.data.length;
      this.users_generals = resp.data;
      this.getTableDataGeneral();
    });
  }

  getTableDataGeneral() {
    this.usersList = [];
    this.serialNumberArray = [];
    this.users_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.usersList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.usersList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  selectUser(user: any) {
    this.user_selected = user;
  }

  deleteUser() {
    this.UsuarioService.delete(this.user_selected.id).subscribe(
      (resp: any) => {
        console.log(resp);
        const INDEX = this.usersList.findIndex(
          (item: any) => item.id == this.user_selected.id
        );
        if (INDEX != -1) {
          this.usersList.splice(INDEX, 1);

          $('#delete_staff').hide();
          $('#delete_staff').removeClass('show');
          $('.modal-backdrop').remove();
          $('body').removeClass();
          $('body').removeAttr('style');

          this.user_selected = null;
          // this.closebutton.nativeElement.click();
        }
      }
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public searchData(value: any): void {
    console.log(this.dataSource)
    this.dataSource.filter = value.trim().toLowerCase();
    this.usersList = this.dataSource.filteredData;
  }

  public sortData(sort: any) {
    const data = this.usersList.slice();

    if (!sort.active || sort.direction === '') {
      this.usersList = data;
    } else {
      this.usersList = data.sort((a: any, b: any) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const aValue = (a as any)[sort.active];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event == 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableDataGeneral();
    }
  }

  
  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    if (pageNumber > this.currentPage) {
      this.pageIndex = pageNumber - 1;
    } else if (pageNumber < this.currentPage) {
      this.pageIndex = pageNumber + 1;
    }
    this.getTableDataGeneral();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.searchDataValue = '';
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 != 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    /* eslint no-var: off */
    for (var i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }
}
