import { Component } from '@angular/core';
import { Existencias } from '../../modelos';
import { ExixtenciaService } from '../../services/exixtencia.service';
import { MatDialog } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { PageEvent } from '@angular/material/paginator';
import { AsignarMaterialesComponent } from '../asignar-materiales/asignar-materiales.component';

@Component({
  selector: 'app-list-materiales-brigada',
  templateUrl: './list-materiales-brigada.component.html',
  styleUrls: ['./list-materiales-brigada.component.scss']
})
export class ListMaterialesBrigadaComponent {

  existencias: Existencias[] = [];
  searchDataValue = '';
  pageSize = 10;
  totalData = 0;
  currentPage = 0;
 displayedColumns: string[] = [];
  constructor(
    private existenciaService: ExixtenciaService ,
    private dialog: MatDialog,
    private utilities: UtilitiesService
  ) {}

  ngOnInit() {
    this.displayedColumns = [
      'brigada',
      'codigo',
      'material',
      'stock',
      'Sub_Categoria',
      'Categoria'
    ];

    this.getTableData(1);
  }

    onPaginateChange(event: PageEvent): void {
      this.pageSize = event.pageSize;
      this.currentPage = event.pageIndex + 1;
      this.getTableData(this.currentPage);
    }
    
 getTableData(page: number): void {
    this.existenciaService
      .readAll({ page, perPage: this.pageSize, search: this.searchDataValue })
      .subscribe((resp) => {
        this.totalData = resp.total;
        this.existencias = resp.data;
      });
  }


openDialogMasivo(){}
openDialog(){ 
  const ref = this.dialog.open(AsignarMaterialesComponent);
    ref.afterClosed().subscribe(() => this.getTableData(1));}

  refreshTable(): void {
    this.searchDataValue = '';
    this.currentPage = 1;
    this.getTableData(this.currentPage);
  }

    searchData(): void {
    this.currentPage = 1;
    this.getTableData(this.currentPage);
  }
}
