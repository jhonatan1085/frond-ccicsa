import { Component, ViewChild } from '@angular/core';
import { BitacorasService } from '../services/bitacoras.service';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SiteService } from '../../site/service/site.service';
import { MatTableDataSource } from '@angular/material/table';
import { CuadrillaService } from '../../cuadrilla/service/cuadrilla.service';



@Component({
  selector: 'app-add-bitacoras',
  templateUrl: './add-bitacoras.component.html',
  styleUrls: ['./add-bitacoras.component.scss'],

})
export class AddBitacorasComponent {
  //paginacion cuadrillas
  public cuadrillasList: any = [];
  dataSource!: MatTableDataSource<any>;

  @ViewChild('closebutton') closebutton: any;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 5;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<any> = [];
  public totalPages = 0;
  public cuadrillas_generals: any = []
  public CUADRILLA_SELECTED: any;


  public cuadrilla_add: any = [];
  //fin paginacion cuadrillas

  panelOpenState = false;
  public selectedTipoAveria !: string;
  public selectedRed !: string;
  public selectedServ !: string;
  public selectedSite !: string;

  public nombre: string = '';
  public fecha_inicial: string = '';
  public nro_sot: string = '';
  public nro_incidencia: string = '';
  public codigo: string = '';
  public site: string = '';
  public cliente: string = '';
  public region: string = '';
  public departamento: string = '';
  public provincia: string = '';
  public distrito: string = '';
  public latitud: string = '';
  public longitud: string = '';
  public distancia: string = '';
  public zona: string = '';


  public tipo_Averia: any = [];
  public red: any = [];
  public serv: any = [];

  myControl = new FormControl();
  options!: any;
  filteredOptions!: Observable<any>;

  constructor(
    public bitacoraService: BitacorasService,
    public siteService: SiteService,
    public cuadrillaService: CuadrillaService
  ) {

  }

  ngOnInit(): void {
    this.bitacoraService.listConfig().subscribe((resp: any) => {
      console.log(resp);
      this.tipo_Averia = resp.tipoaveria;
      this.red = resp.red;
      this.serv = resp.serv;
    })

    this.siteService.showSiteAutocomplete().subscribe((resp: any) => {
      this.onGetTaxList(resp.sites)
    })

    this.getTableData();

  }

  private getTableData(): void {
    this.cuadrillasList = [];
    this.serialNumberArray = [];

    this.cuadrillaService.brigadaactiva().subscribe((resp: any) => {
      console.log('aca llegabrigadas')
      console.log(resp)
      this.totalData = resp.brigadas.data.length;
      this.cuadrillas_generals = resp.brigadas.data;

      this.getTableDataGeneral();
    });
  }

  getTableDataGeneral() {
    this.cuadrillasList = [];
    this.serialNumberArray = [];
    this.cuadrillas_generals.map((res: any, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {

        this.cuadrillasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<any>(this.cuadrillasList);
    this.calculateTotalPages(this.totalData, this.pageSize);
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


  countTecnicos(cuadrilla: any) {
    return cuadrilla.user_movil.length
  }

  showSegment(cuadrilla: any) {
    this.CUADRILLA_SELECTED = cuadrilla;
  }

  addCuadrilla(cuadrilla: any) {
    console.log(cuadrilla)
    let INDEX = this.cuadrilla_add.findIndex((us: any) =>
      us.id == cuadrilla.id);
    if (INDEX != -1) {
      this.cuadrilla_add.splice(INDEX, 1);
    } else {
      this.cuadrilla_add.push({
        "cuadrilla_id": cuadrilla.id,
        "tipocuadrilla": cuadrilla.tipo_brigada.nombre,
        "zona": cuadrilla.zona.nombre
      });
    }
  }

  searchadd(cuadrilla:any) {

    let INDEX = this.cuadrilla_add.findIndex((cuadri: any) => cuadri.cuadrilla_id == cuadrilla.id);

    if (INDEX != -1) {
      return false;
    } else {
      return true;
    }
  }
  // Auth Complete
  onGetTaxList(val: any) {
    this.options = val;

    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => value.length >= 1 ? this._filter(value) : [])
      );
  }

  private _filter(value: any) {
    const filterValue = value.toLowerCase();
    console.log(filterValue)
    return this.options.filter((option: any) => option.nombre.toLowerCase().includes(filterValue));
  }

  displayFn(value: any) {

    return value ? value.nombre : undefined;
  }

  detallesite(value: any) {
    this.selectedSite = value.id
    this.latitud = value.latitud
    this.longitud = value.longitud
    this.region = value.region.nombre
    this.distrito = value.distrito.nombre
    this.departamento = value.distrito.provincia.departamento.nombre
    this.provincia = value.distrito.provincia.nombre
    this.zona = value.zona.nombre
    console.log(value.region)
    this.codigo = value.codigo
  }
  step = 0;

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }



}
