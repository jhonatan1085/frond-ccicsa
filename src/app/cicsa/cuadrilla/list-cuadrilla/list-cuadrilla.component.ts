import { Component,ViewChild } from '@angular/core';
import { CuadrillaService } from '../service/cuadrilla.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-list-cuadrilla',
  templateUrl: './list-cuadrilla.component.html',
  styleUrls: ['./list-cuadrilla.component.scss']
})
export class ListCuadrillaComponent {
  public cuadrillasList:any = [];
  dataSource!: MatTableDataSource<any>;
  @ViewChild('closebutton') closebutton:any;

  public searchDataValue = '';
  public cuenta:number = 0;


  CUADRILLA_SELECTED:any;

  public showFilter = false;
  public lastIndex = 0;
  public pageSize = 3;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;

  public cuadrilla_generals:any = [];
  public cuadrilla_selected:any;

  constructor(
    public cuadrillaService: CuadrillaService
  ) {

  }
  ngOnInit() {
    this.getTableData();
  }



/*   ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    
  } */

    public  getTableData(page=1): void {
      this.cuadrillasList = [];
      this.serialNumberArray = [];
  
      this.cuadrillaService.listCuadrillas(page, this.searchDataValue).subscribe((resp: any) => {
       
        console.log(resp);
  
        this.totalData = resp.total;
        this.cuadrillasList = resp.brigadas.data;
  
        this.dataSource = new MatTableDataSource<any>(this.cuadrillasList);
        this.calculateTotalPages(this.totalData, this.pageSize);
  
        //this.getTableDataGeneral();
      });
    }
  
    getTableDataGeneral(){
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
        this.cuadrillasList = data.sort((a:any, b:any) => {
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

    countTecnicos(cuadrilla:any){
      return cuadrilla.user_movil.length
      }
    
      showSegment(cuadrilla:any){
        this.CUADRILLA_SELECTED = cuadrilla;
      }
    

    
        public deleteUser(){
          console.log('hola');
        }
}
