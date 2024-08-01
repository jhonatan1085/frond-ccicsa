import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Bitacora } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { EndBitacorasComponent } from '../end-bitacoras/end-bitacoras.component';
import { ViewBitacorasComponent } from '../view-bitacoras/view-bitacoras.component';

@Component({
  selector: 'app-list-bitacoras',
  templateUrl: './list-bitacoras.component.html',
  styleUrls: ['./list-bitacoras.component.scss'],
})
export class ListBitacorasComponent implements OnInit {
  bitacoras: Bitacora[] = [];
  dataSource!: MatTableDataSource<Bitacora>;

  searchDataValue = '';

  showFilter = false;
  lastIndex = 0;
  pageSize = 100;
  totalData = 0;
  skip = 0;
  limit: number = this.pageSize;
  pageIndex = 0;
  serialNumberArray: number[] = [];
  currentPage = 1;
  pageNumberArray: number[] = [];
  pageSelection: any[] = [];
  totalPages = 0;

  bitacora_generals: Bitacora[] = [];
  bitacora_selected?: Bitacora;

  constructor(
    public bitacoraService: BitacorasService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(page = 1): void {
    this.bitacoras = [];
    this.serialNumberArray = [];
    this.bitacoraService
      .readAll({ page, search: this.searchDataValue })
      .subscribe((resp) => {
        this.totalData = resp.total;
        this.bitacoras = resp.data;
        this.dataSource = new MatTableDataSource<Bitacora>(this.bitacoras);
        this.calculateTotalPages(this.totalData, this.pageSize);
      });
  }

  getTableDataGeneral() {
    this.bitacoras = [];
    this.serialNumberArray = [];
    this.bitacora_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.bitacoras.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.bitacoras);
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
}
