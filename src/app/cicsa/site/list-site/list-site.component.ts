import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SiteService } from '../../services/site.service';
import { Site } from '../../modelos';

@Component({
  selector: 'app-list-site',
  templateUrl: './list-site.component.html',
  styleUrls: ['./list-site.component.scss'],
})
export class ListSiteComponent implements OnInit {
  public sitesList: Site[] = [];
  dataSource!: MatTableDataSource<Site>;

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

  public site_generals: Site[] = [];
  public site_selected?: Site;
  constructor(public SiteService: SiteService) {}

  ngOnInit() {
    this.getTableData();
  }

  private getTableData(page = 1): void {
    this.sitesList = [];
    this.serialNumberArray = [];

    this.SiteService.readAll({ page, search: this.searchDataValue }).subscribe(
      (resp) => {
        console.log(resp);

        this.totalData = resp.total;
        this.sitesList = resp.data;

        this.dataSource = new MatTableDataSource<Site>(this.sitesList);
        this.calculateTotalPages(this.totalData, this.pageSize);

        //this.getTableDataGeneral();
      }
    );
  }

  getTableDataGeneral() {
    this.sitesList = [];
    this.serialNumberArray = [];
    this.site_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.sitesList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.sitesList);
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
    const data = this.sitesList.slice();

    if (!sort.active || sort.direction === '') {
      this.sitesList = data;
    } else {
      this.sitesList = data.sort((a: any, b: any) => {
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
}
