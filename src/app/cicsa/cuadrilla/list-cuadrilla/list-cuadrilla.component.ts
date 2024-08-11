import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CuadrillaService } from '../../services/cuadrilla.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Cuadrilla } from '../../modelos';
import { AddCuadrillaComponent } from '../add-cuadrilla/add-cuadrilla.component';

@Component({
  selector: 'app-list-cuadrilla',
  templateUrl: './list-cuadrilla.component.html',
  styleUrls: ['./list-cuadrilla.component.scss'],
})
export class ListCuadrillaComponent implements OnInit {
  cuadrillasList: Cuadrilla[] = [];
  dataSource!: MatTableDataSource<Cuadrilla>;

  searchDataValue = '';
  cuenta = 0;

  CUADRILLA_SELECTED?: Cuadrilla;

  showFilter = false;
  lastIndex = 0;
  pageSize = 10;
  totalData = 0;
  skip = 0;
  limit: number = this.pageSize;
  pageIndex = 0;
  serialNumberArray: number[] = [];
  currentPage = 1;
  pageNumberArray: number[] = [];
  pageSelection: any[] = [];
  totalPages = 0;
  cuadrilla_generals: Cuadrilla[] = [];
  cuadrilla_selected?: Cuadrilla;

  constructor(
    private cuadrillaService: CuadrillaService,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  ngOnInit() {
    this.getTableData();
  }

  openDialog() {
    const ref = this.dialog.open(AddCuadrillaComponent);
    ref.afterClosed().subscribe(() => this.getTableData());
  }

  public getTableData(page = 1): void {
    this.cuadrillasList = [];
    this.serialNumberArray = [];

    this.cuadrillaService
      .readAll({ page, search: this.searchDataValue })
      .subscribe((resp) => {
        console.log(resp);
        this.totalData = resp.total;
        this.cuadrillasList = resp.data;
        this.dataSource = new MatTableDataSource<any>(this.cuadrillasList);
        this.calculateTotalPages(this.totalData, this.pageSize);
        //this.getTableDataGeneral();
      });
  }

  getTableDataGeneral() {
    this.cuadrillasList = [];
    this.serialNumberArray = [];
    this.cuadrilla_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.cuadrillasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.cuadrillasList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  public searchData(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  public sortData(sort: any) {
    const data = this.cuadrillasList.slice();

    if (!sort.active || sort.direction === '') {
      this.cuadrillasList = data;
    } else {
      this.cuadrillasList = data.sort((a: any, b: any) => {
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
      this.getTableData(this.currentPage);
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData(this.currentPage);
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
    this.getTableData(this.currentPage);
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

  countTecnicos(cuadrilla: Cuadrilla) {
    return cuadrilla.user_movil.length;
  }

  showSegment(cuadrilla: Cuadrilla) {
    this.CUADRILLA_SELECTED = cuadrilla;
  }

  inactiva(cuadrilla: Cuadrilla) {
    console.log(cuadrilla);
    if (cuadrilla.estado == '1') {
      this.cuadrillaService.delete(cuadrilla.id).subscribe((resp) => {
        if (resp.message == 403) {
          this._snackBar.open('Error ', 'Cerrar', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
          });
        } else {
          this._snackBar.open('Se dio de baja a brigada', 'Cerrar', {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 2000,
          });
          this.getTableData();
        }
      });
    }
  }

  public deleteUser() {
    console.log('hola');
  }
}
