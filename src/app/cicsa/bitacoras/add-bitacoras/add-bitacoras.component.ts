import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { Bitacora, Cuadrilla, Site, Tipo } from 'src/app/cicsa/modelos/modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { CuadrillaService } from '../../services/cuadrilla.service';
import { SiteService } from '../../services/site.service';
import { UsuariosService } from '../../services/usuarios.service';
import { ConfigService } from '../../services/config.service';
@Component({
  selector: 'app-add-bitacoras',
  templateUrl: './add-bitacoras.component.html',
  styleUrls: ['./add-bitacoras.component.scss'],
})
export class AddBitacorasComponent implements OnInit {
  //paginacion cuadrillas
  cuadrillasList: Cuadrilla[] = [];
  dataSource!: MatTableDataSource<Cuadrilla>;

  showFilter = false;
  searchDataValue = '';
  lastIndex = 0;
  pageSize = 5;
  totalData = 0;
  skip = 0;
  limit: number = this.pageSize;
  pageIndex = 0;
  serialNumberArray: number[] = [];
  currentPage = 1;
  pageNumberArray: number[] = [];
  pageSelection: any[] = [];
  totalPages = 0;
  cuadrillas_generals: Cuadrilla[] = [];
  CUADRILLA_SELECTED: any;

  cuadrilla_add: any[] = [];

  responsables_cicsa: any[] = [];

  responsables_claro: any[] = [];
  //fin paginacion cuadrillas

  panelOpenState = false;
  // selectedTipoAveria!: string;
  // selectedRed!: string;
  // selectedServ!: string;
  // selectedSite!: string;
  // selectedliderclaro!: string;
  // selectedlidercicsa!: string;

  bitacora: Bitacora={tipo_averia:{} as any,red:{} as any,serv:{} as any, resp_cicsa:{} as any , resp_claro:{} as any } as any;
  // fecha_inicial = '';
  // nro_sot = '';
  // nro_incidencia = '';
  codigo = '';
  site = '';
  cliente = '';
  region = '';
  departamento = '';
  provincia = '';
  distrito = '';
  // latitud = '';
  // longitud = '';
  // distancia = '';
  zona = '';

  latitudsite = '';
  longitudsite = '';

  tipo_Averia: Tipo[] = [];
  red: Tipo[] = [];
  serv: Tipo[] = [];

  myControl = new FormControl();
  options!: any;
  filteredOptions!: Observable<any>;

  constructor(
    private configService: ConfigService,
    private bitacoraService: BitacorasService,
    private siteService: SiteService,
    private cuadrillaService: CuadrillaService,
    private usuarioService: UsuariosService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private activateRoute: ActivatedRoute
  ) {
    
  }

  ngOnInit(): void {
    
  this.activateRoute.params.pipe(switchMap( params => this.bitacoraService.read(params['id']))).subscribe(resp => this.bitacora = resp )

    this.configService.bitacoras().subscribe((resp) => {
      console.log(resp);
      this.tipo_Averia = resp.tipoaveria;
      this.red = resp.red;
      this.serv = resp.serv;
    });

    this.siteService.showSiteAutocomplete().subscribe((resp) => {
      console.log(resp);
      this.onGetTaxList(resp.data);
    });

    this.getTableData();
  }

  private getTableData(): void {
    this.cuadrillasList = [];
    this.serialNumberArray = [];

    this.cuadrillaService.activa().subscribe((resp) => {
      this.totalData = resp.data.length;
      this.cuadrillas_generals = resp.data;
      this.getTableDataGeneral();
    });
  }

  getTableDataGeneral() {
    this.cuadrillasList = [];
    this.serialNumberArray = [];
    this.cuadrillas_generals.map((res: Cuadrilla, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.cuadrillasList.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<Cuadrilla>(this.cuadrillasList);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  sortData(sort: any) {
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

  getMoreData(event: string): void {
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

  moveToPage(pageNumber: number): void {
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

  PageSize(): void {
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

  countTecnicos(cuadrilla: Cuadrilla) {
    return cuadrilla.user_movil.length;
  }

  showSegment(cuadrilla: Cuadrilla) {
    this.CUADRILLA_SELECTED = cuadrilla;
  }

  addCuadrilla(cuadrilla: Cuadrilla) {
    console.log(cuadrilla);
    const INDEX = this.cuadrilla_add.findIndex(
      (us: any) => us.id == cuadrilla.id
    );
    if (INDEX != -1) {
      this.cuadrilla_add.splice(INDEX, 1);
    } else {
      this.cuadrilla_add.push({
        cuadrilla_id: cuadrilla.id,
        tipocuadrilla: cuadrilla.tipo_brigada.nombre,
        zona: cuadrilla.zona.nombre,
      });
    }
  }

  searchadd(cuadrilla: Cuadrilla) {
    const INDEX = this.cuadrilla_add.findIndex(
      (cuadri: any) => cuadri.cuadrilla_id == cuadrilla.id
    );

    if (INDEX != -1) {
      return false;
    } else {
      return true;
    }
  }
  // Auth Complete
  onGetTaxList(val: any) {
    this.options = val;

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map((value) => (value.length >= 1 ? this._filter(value) : []))
    );
  }

  private _filter(value: any) {
    const filterValue = value.toLowerCase();
    console.log(filterValue);
    return this.options.filter((option: any) =>
      option.nombre.toLowerCase().includes(filterValue)
    );
  }

  displayFn(value: any) {
    return value ? value.nombre : undefined;
  }

  detallesite(value: Site) {
    if (!this.bitacora) return;
    this.bitacora.site = value;
    this.bitacora.site.id = value.id;
    this.bitacora.site.latitud = value.latitud;
    this.bitacora.site.longitud = value.longitud;
    this.region = value.region.nombre;
    this.distrito = value.distrito.nombre;
    this.departamento = value.distrito.provincia.departamento.nombre;
    this.provincia = value.distrito.provincia.nombre;
    this.zona = value.zona.nombre;

    this.dataResponsables(value.zona.id);
    this.codigo = value.codigo;
  }

  dataResponsables(idzona: number) {
    this.usuarioService.showResponsables(idzona).subscribe((resp) => {
      console.log('responsables');
      console.log(resp);
      this.responsables_cicsa = resp.cicsa ;
      this.responsables_claro = resp.claro ;
    });
  }

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  saveBitacora() {
    if (!this.bitacora) {
      console.error('No Bitacora was created');
      return;
    }

    console.log(this.bitacora);
    const formData = new FormData();
    formData.append('nombre', this.bitacora.nombre?? '');
    formData.append('fecha_inicial', this.bitacora.fecha_inicial?? '');
    formData.append('sot', this.bitacora.sot?? '');
    formData.append('insidencia', this.bitacora.incidencia?? '');
    formData.append('tipo_averia_id', this.bitacora.tipo_averia?.id.toString() ?? '');
    formData.append('latitud', this.bitacora.latitud?.toString() ?? '');
    formData.append('longitud', this.bitacora.longitud?.toString() ?? '');
    formData.append('distancia', this.bitacora.distancia?.toString()?? '');
    formData.append('red_id', this.bitacora.red?.id.toString()?? '');
    formData.append('serv_id', this.bitacora.serv?.id.toString()?? '');
    formData.append('site_id', this.bitacora.site?.id.toString()?? '');
    formData.append('resp_cicsa_id', this.bitacora.resp_cicsa?.id.toString()?? '');
    formData.append('resp_claro_id', this.bitacora.resp_claro?.id.toString()?? '');
    formData.append('cuadrilla', JSON.stringify(this.cuadrilla_add));

    this.bitacoraService.create(formData).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.snackBar('Falta ingresar datos');
      } else {
        this.snackBar('Registro Exitoso');
        this.router.navigate(['/bitacoras/list-bitacora']);
      }
    });
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
