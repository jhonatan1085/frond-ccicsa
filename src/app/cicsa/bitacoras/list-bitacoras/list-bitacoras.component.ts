import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Bitacora } from '../../modelos';
import { EndBitacorasComponent } from '../end-bitacoras/end-bitacoras.component';
import { LocationBitacorasComponent } from '../location-bitacoras/location-bitacoras.component';
import { ViewBitacorasComponent } from '../view-bitacoras/view-bitacoras.component';
import { BitacorasService } from '../../services/bitacoras.service';

@Component({
  selector: 'app-list-bitacoras',
  templateUrl: './list-bitacoras.component.html',
  styleUrls: ['./list-bitacoras.component.scss'],
})
export class ListBitacorasComponent implements OnInit{
  public bitacoras: Bitacora[] = [];
  dataSource!: MatTableDataSource<Bitacora>;

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

  bitacora_generals: Bitacora[] = [];
  bitacora_selected?: Bitacora;

  constructor(
    public bitacoraService: BitacorasService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(page = 1): void {
    //this.bitacoraList = [];
    this.serialNumberArray = [];
    this.bitacoraService
      .readAll({ page, search: this.searchDataValue })
      .subscribe((resp) => {
        console.log(resp);
        this.totalData = resp.total;
        this.bitacoras = resp.data;
        this.dataSource = new MatTableDataSource<Bitacora>(this.bitacoras);
        this.calculateTotalPages(this.totalData, this.pageSize);
      });
  }

/*   getTableDataGeneral() {
    this.bitacoras = [];
    this.serialNumberArray = [];
    this.bitacoras.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.bitacoras.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.bitacoras);
    this.calculateTotalPages(this.totalData, this.pageSize);
  } */

  public searchData(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;

    this.getTableData();
  }

  public sortData(sort: any) {
    const data = this.bitacoras.slice();

    if (!sort.active || sort.direction === '') {
      this.bitacoras = data;
    } else {
      this.bitacoras = data.sort((a: any, b: any) => {
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

  openDialog(id: number) {
    this.dialog.open(ViewBitacorasComponent, {
      data: { id },
    });
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
