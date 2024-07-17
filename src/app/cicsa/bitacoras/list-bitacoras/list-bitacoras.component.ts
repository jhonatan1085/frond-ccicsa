import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SiteService } from '../../site/service/site.service';
import { BitacorasService } from '../services/bitacoras.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { ViewBitacorasComponent } from '../view-bitacoras/view-bitacoras.component';
import { AddDetalleBitacorasComponent } from '../add-detalle-bitacoras/add-detalle-bitacoras.component';

@Component({
  selector: 'app-list-bitacoras',
  templateUrl: './list-bitacoras.component.html',
  styleUrls: ['./list-bitacoras.component.scss'],
})
export class ListBitacorasComponent {
  public bitacoraList: any = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild('closebutton') closebutton: any;

  public searchDataValue = '';

  public showFilter = false;
  public lastIndex = 0;
  public pageSize = 100;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;

  public bitacora_generals: any = [];
  public bitacora_selected: any;

  constructor(
    public bitacoraService: BitacorasService,
    public dialog: MatDialog
  ) {}

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(page = 1): void {
    this.bitacoraList = [];
    this.serialNumberArray = [];

    this.bitacoraService
      .readAll(page, this.searchDataValue)
      .subscribe((resp: any) => {
        console.log(resp);

        this.totalData = resp.total;
        this.bitacoraList = resp.bitacoras.data;

        this.dataSource = new MatTableDataSource<any>(this.bitacoraList);
        this.calculateTotalPages(this.totalData, this.pageSize);
      });
  }

  getTableDataGeneral() {
    this.bitacoraList = [];
    this.serialNumberArray = [];
    this.bitacora_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.bitacoraList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.bitacoraList);
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
    const data = this.bitacoraList.slice();

    if (!sort.active || sort.direction === '') {
      this.bitacoraList = data;
    } else {
      this.bitacoraList = data.sort((a: any, b: any) => {
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

  openDialog(id: string) {
    this.dialog.open(ViewBitacorasComponent, {
      data: { id: id },
    });

  }
}
