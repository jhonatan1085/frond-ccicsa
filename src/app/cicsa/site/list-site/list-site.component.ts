import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { SiteService } from '../service/site.service';

@Component({
  selector: 'app-list-site',
  templateUrl: './list-site.component.html',
  styleUrls: ['./list-site.component.scss']
})
export class ListSiteComponent {
  public sitesList:any = [];
  dataSource!: MatTableDataSource<any>;

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

  public site_generals:any = [];
  public site_selected:any;
  constructor(
    public SiteService: SiteService
  ) {

  }
  public searchData(value: any): void {

    
    this.dataSource.filter = value.trim().toLowerCase();
    this.sitesList = this.dataSource.filteredData;
  }


  ngOnInit() {
    this.getTableData();
  }



  private getTableData(): void {
    this.sitesList = [];
    this.serialNumberArray = [];

    this.SiteService.listSites().subscribe((resp: any) => {
     
      console.log(resp);

      this.totalData = resp.sites.data.length;
      this.site_generals = resp.sites.data;

      this.getTableDataGeneral();
    });
  }

  getTableDataGeneral(){
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

  public sortData(sort: any) {
    const data = this.sitesList.slice();

    if (!sort.active || sort.direction === '') {
      this.sitesList = data;
    } else {
      this.sitesList = data.sort((a:any, b:any) => {
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
}
