import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Bitacora, UnidadMovil } from '../../modelos';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserAuth } from 'src/app/shared/models/models';
import { EndBitacorasComponent } from '../../bitacoras/end-bitacoras/end-bitacoras.component';
import { LocationBitacorasComponent } from '../../bitacoras/location-bitacoras/location-bitacoras.component';
import { AddUnidadesMovilesComponent } from '../add-unidades-moviles/add-unidades-moviles.component';
import { UnidadesMovilesService } from '../../services/unidades-moviles.service';

@Component({
  selector: 'app-list-unidades-moviles',
  templateUrl: './list-unidades-moviles.component.html',
  styleUrls: ['./list-unidades-moviles.component.scss']
})
export class ListUnidadesMovilesComponent implements OnInit{
  public user?: UserAuth;
  
  public unidadesMovilesList: UnidadMovil[] = [];
  dataSource!: MatTableDataSource<UnidadMovil>;

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

  unidadeMovil_generals: UnidadMovil[] = [];
  unidadeMovil_selected?: UnidadMovil;

  constructor(
    public unidadesMovilesService: UnidadesMovilesService,
    public dialog: MatDialog,
    public auth: AuthService
  ) { 
  }

  ngOnInit() {
    this.user = this.auth.user
    console.log(this.user)
    this.getTableData();
  }

  private getTableData(page = 1): void {
    this.unidadesMovilesList = [];
    this.serialNumberArray = [];

    this.unidadesMovilesService
      .readAll()
      .subscribe((resp) => {
        this.totalData = resp.total;
        this.unidadeMovil_generals = resp.data;

        this.getTableDataGeneral();
      });
  }

   getTableDataGeneral() {
    this.unidadesMovilesList = [];
    this.serialNumberArray = [];
    this.unidadeMovil_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.unidadesMovilesList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<UnidadMovil>(this.unidadesMovilesList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  } 

  public searchData(value: any): void {
    console.log(this.dataSource)
    this.dataSource.filter = value.trim().toLowerCase();
    this.unidadesMovilesList = this.dataSource.filteredData;
  }

  public sortData(sort: any) {
    const data = this.unidadesMovilesList.slice();

    if (!sort.active || sort.direction === '') {
      this.unidadesMovilesList = data;
    } else {
      this.unidadesMovilesList = data.sort((a: any, b: any) => {
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
      this.getTableData();
    } else if (event == 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
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
    this.getTableData();
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
  openDialog() {
    const ref = this.dialog.open(AddUnidadesMovilesComponent, { disableClose: true });
    // ref.afterClosed().subscribe(() => this.getTableData()); 
  }


  openDialogEnd(bitacora: Bitacora) {
    this.dialog.open(EndBitacorasComponent, {
      data: { bitacora: bitacora },
    });
  }

  openDialogLocation(bitacora: Bitacora) {
    this.dialog.open(LocationBitacorasComponent, {
      data: { bitacora: bitacora },
    });

  }
}
