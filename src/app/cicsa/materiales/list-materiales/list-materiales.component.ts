import { Component } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import { AddMaterialesComponent } from '../add-materiales/add-materiales.component';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialCreate } from '../../modelos';
import { PageEvent } from '@angular/material/paginator';
import * as XLSX from 'xlsx';
import { UtilitiesService } from '../../services/utilities.service';
import { CargaMasivaComponent } from '../carga-masiva/carga-masiva.component';

@Component({
  selector: 'app-list-materiales',
  templateUrl: './list-materiales.component.html',
  styleUrls: ['./list-materiales.component.scss'],
})
export class ListMaterialesComponent {
  materiales: MaterialCreate[] = [];
  searchDataValue = '';
  pageSize = 10;
  totalData = 0;
  currentPage = 0;

  displayedColumns: string[] = [];
  selectedFile?: File;
  constructor(
    private materialService: MaterialService,
    private dialog: MatDialog,
    private utilities: UtilitiesService
  ) {}

  ngOnInit() {
    this.displayedColumns = [
      'Codigo',
      'Nombre',
      'UM',
      'Precio',
      'stock_minimo',
      'Sub_Categoria',
      'Categoria',
      'acciones',
    ];

    this.getTableData(1);
  }

  openDialog() {
    const ref = this.dialog.open(AddMaterialesComponent);
    ref.afterClosed().subscribe(() => this.getTableData(1));
  }

  openDialogMasivo() {
    const ref = this.dialog.open(CargaMasivaComponent);
    ref.afterClosed().subscribe(() => this.getTableData(1));
  }

  openDialogMaterial(material: MaterialCreate) {
    const ref = this.dialog.open(AddMaterialesComponent, {
      data: { material: material },
    });

    ref.afterClosed().subscribe(() => {
      this.getTableData(1);
    });
  }

  getTableData(page: number): void {
    this.materialService
      .readAll({ page, perPage: this.pageSize, search: this.searchDataValue })
      .subscribe((resp) => {
        console.log(resp);
        this.totalData = resp.total;
        this.materiales = resp.data;
      });
  }

  onPaginateChange(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex + 1;
    this.getTableData(this.currentPage);
  }

  onFileChange(event: any) {
    const target: DataTransfer = <DataTransfer>event.target;
    if (target.files.length !== 1) {
      this.utilities.snackBar('Solo se permite un archivo');
      return;
    }

    const reader: FileReader = new FileReader();
    reader.onload = (e: any) => {
      const bstr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });
      const wsname: string = wb.SheetNames[0];
      const ws: XLSX.WorkSheet = wb.Sheets[wsname];

      const data = XLSX.utils.sheet_to_json(ws);
      this.subirMateriales(data); // Enviar al backend
    };
    reader.readAsBinaryString(target.files[0]);
  }

  subirMateriales(data: any[]) {
    this.materialService.cargaMasiva(data).subscribe({
      next: () => this.utilities.snackBar('Carga masiva completada'),
      error: () => this.utilities.snackBar('Error al cargar materiales'),
    });
  }

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
