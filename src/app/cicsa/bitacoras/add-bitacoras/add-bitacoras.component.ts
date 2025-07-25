import { Component, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { Bitacora, Cuadrilla, Site, Tipo } from 'src/app/cicsa/modelos/modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { ConfigService } from '../../services/config.service';
import { CuadrillaService } from '../../services/cuadrilla.service';
import { SiteService } from '../../services/site.service';
import { UsuariosService } from '../../services/usuarios.service';
import { AddCuadrillaComponent } from '../../cuadrilla/add-cuadrilla/add-cuadrilla.component';
import { MatDialog } from '@angular/material/dialog';
import { AlertComponent } from 'src/app/shared/alert/alert.component';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { TimeUtilsService } from '../../services/time-utils.service';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-add-bitacoras',
  templateUrl: './add-bitacoras.component.html',
  styleUrls: ['./add-bitacoras.component.scss'],
})
export class AddBitacorasComponent implements OnInit {
  //paginacion cuadrillas
  brigadas: Cuadrilla[] = [];
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
  brigadasGeneral: Cuadrilla[] = [];
  brigadaSelected?: Cuadrilla;

  // cuadrilla_add: any[] = [];

  responsables_cicsa: any[] = [];

  responsables_claro: any[] = [];
  //fin paginacion cuadrillas

  panelOpenState = false;

  bitacora: Bitacora = {
    tipo_averia: {} as any,
    red: {} as any,
    serv: {} as any,
    resp_cicsa: {} as any,
    resp_claro: {} as any,
  } as any;

  site?: Site;
  siteFin?: Site;

  tipo_Averia: Tipo[] = [];
  red: Tipo[] = [];
  serv: Tipo[] = [];

  siteControl = new FormControl();

  sites!: Site[];
  filteredSites!: Observable<Site[]>;

  siteFinControl = new FormControl();
  sitesFin!: Site[];
  filteredSitesFin!: Observable<Site[]>;
  // formularios
  datosForm: FormGroup;
  siteForm: FormGroup;
  brigadasForm: FormGroup;
  responsablesForm: FormGroup;

  constructor(
    private configService: ConfigService,
    private bitacoraService: BitacorasService,
    private siteService: SiteService,
    private brigadasService: CuadrillaService,
    private usuarioService: UsuariosService,
    private _snackBar: MatSnackBar,
    private router: Router,
    private activateRoute: ActivatedRoute,
    private fb: FormBuilder,
    private dialog: MatDialog,
    private alertService: AlertService,
    private time_utils: TimeUtilsService,
    private utilities: UtilitiesService
  ) {
    const now = this.time_utils.getLocalDateTime();

    this.datosForm = this.fb.group(
      {
        nombre: [null, Validators.required],
        enlace_plano_site: [null],
        fecha_inicial: [now, Validators.required],
        fecha_ejecucion: [now],
        sot: [],
        fecha_sot: [now],
        incidencia: [],
        latitud: [null],
        longitud: [null],
        distancia: [],
        tipo_averia_id: [null, Validators.required],
        red_id: [null, Validators.required],
        serv_id: [null, Validators.required],
        nro_tas: [],
        nro_crq: [],
        afect_servicio: [false],
        afect_masiva: [false],
      },
      {
        validators: [
          this.time_utils.fechaEjecucionMayorValidator(
            'fecha_inicial',
            'fecha_ejecucion'
          ),
          this.utilities.validateCoordinates.bind(this.utilities),
        ],
      }
    );

    this.siteForm = this.fb.group({
      site_id: [null, Validators.required],
      site_fin_id: [null, Validators.required],
      cliente: [],
    });
    this.brigadasForm = this.fb.group({
      brigadas: this.fb.array([], Validators.required),
    });
    this.responsablesForm = this.fb.group({
      resp_cicsa_id: [null, Validators.required],
      resp_claro_id: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.getBitacoraFromParams();
    this.getConfigBitacora();
    this.getSites();
    this.getTableData();
    this.dataResponsables();
  }

  private getBitacoraFromParams() {
    this.activateRoute.params
      .pipe(
        filter((params) => params['id']),
        switchMap((params) => this.bitacoraService.read(params['id']))
      )
      .subscribe((resp) => {
        this.bitacora = resp;
        console.log(this.bitacora);
        this.datosForm.patchValue({
          ...this.bitacora, //los campos que tiene bitacora
          tipo_averia_id: resp.tipo_averia.id, //campos especiales
          red_id: resp.red.id,
          serv_id: resp.serv.id,
        });
        this.siteForm.patchValue({
          site_id: resp.site.id,
          site_fin_id: resp.site_fin.id,
          cliente: resp.cliente, // de donde obtengo el cliente
        });
        // this.brigadasForm.patchValue(this.bitacora);
        // brigadas form
        this.brigadasForm.reset();
        this.bitacora.brigadas.forEach((brigada) => {
          this.addBrigada(brigada);
        });

        ////////////////////////////////
        this.responsablesForm.patchValue({
          resp_cicsa_id: this.bitacora.resp_cicsa.id,
          resp_claro_id: this.bitacora.resp_claro.id,
        });
        //
      });
  }

  private getConfigBitacora() {
    this.configService.bitacoras().subscribe((resp) => {
      this.tipo_Averia = resp.tipoaveria;
      this.red = resp.red;
      this.serv = resp.serv;
    });
  }

  private getSites() {
    this.siteService.autocomplete().subscribe((resp) => {
      this.setSites(resp.data);
      this.setSitesFin(resp.data);
    });
  }

  private getTableData(): void {
    this.brigadas = [];
    this.serialNumberArray = [];

    this.brigadasService.activa().subscribe((resp) => {
      this.totalData = resp.data.length;
      this.brigadasGeneral = resp.data;
      this.getTableDataGeneral();
    });
  }

  getTableDataGeneral() {
    this.brigadas = [];
    this.serialNumberArray = [];
    this.brigadasGeneral.map((res: Cuadrilla, index: number) => {
      const serialNumber = index + 1;
      if (index >= this.skip && serialNumber <= this.limit) {
        this.brigadas.push(res);
        this.serialNumberArray.push(serialNumber);
      }
    });
    this.dataSource = new MatTableDataSource<Cuadrilla>(this.brigadas);
    this.calculateTotalPages(this.totalData, this.pageSize);
  }

  sortData(sort: any) {
    const data = this.brigadas.slice();

    if (!sort.active || sort.direction === '') {
      this.brigadas = data;
    } else {
      this.brigadas = data.sort((a: Cuadrilla, b: Cuadrilla) => {
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

  countTecnicos(brigada: Cuadrilla) {
    return brigada.user_movil.length;
  }

  showSegment(brigada: Cuadrilla) {
    this.brigadaSelected = brigada;
  }

  addBrigada(brigada: Cuadrilla) {
    const brigadas = this.brigadasForm.get('brigadas') as FormArray;
    const brigadasValue = brigadas.value;
    const INDEX = brigadasValue.findIndex(
      (item: Cuadrilla) => item.id == brigada.id
    );
    if (INDEX != -1) {
      brigadas.removeAt(INDEX);
    } else {
      brigadas.push(
        this.fb.group({
          id: [brigada.id],
          nombre: [brigada.nombre],
          zona: [brigada.zona.nombre],
        })
      );
    }
  }

  searchadd(brigada: Cuadrilla) {
    const brigadas = this.brigadasForm.value.brigadas;
    const INDEX = brigadas.findIndex(
      (item: Cuadrilla) => item.id == brigada.id
    );
    return INDEX == -1;
  }

  // Auth Complete Site
  setSites(sites: Site[]) {
    this.sites = sites;
    this.filteredSites = this.siteControl.valueChanges.pipe(
      startWith(''),
      map((value) => (value.length >= 1 ? this._filter(value) : []))
    );

    //console.log('este es id 1' + this.bitacora.site.id);

    if (this.bitacora?.site?.id) {
      this.site = this.sites.find((s) => s.id === this.bitacora.site.id);
      if (this.site) {
        this.siteControl.setValue(this.site); // <- ESTA LÍNEA FALTABA
        this.onSetSite(this.site);
      }
    }
  }

  private _filter(value: any) {
    const filterValue = value.toLowerCase();
    return this.sites.filter((option: any) =>
      option.nombre.toLowerCase().includes(filterValue)
    );
  }

  displayFn(value: Site): string {
    return value ? `${value.nombre}` : '';
  }

  onSetSite(value: Site) {
    if (!this.bitacora) return;
    this.siteForm.patchValue({ site_id: value.id });
    this.bitacora.site = value;
    this.site = value;
    // this.dataResponsables();
  }
  //fin Autocomplete Site

  // Auth Complete Site fin
  setSitesFin(sites: Site[]) {
    this.sitesFin = sites;

    this.filteredSitesFin = this.siteFinControl.valueChanges.pipe(
      startWith(''),
      map((value) => (value.length >= 1 ? this._filterFin(value) : []))
    );

    if (this.bitacora?.site_fin?.id) {
      this.siteFin = this.sitesFin.find(
        (s) => s.id === this.bitacora.site_fin.id
      );

      if (this.siteFin) {
        this.siteFinControl.setValue(this.siteFin); // <- ESTA LÍNEA FALTABA
        this.onSetSiteFin(this.siteFin);
      }
    }
  }

  private _filterFin(value: any) {
    const filterValue = value.toLowerCase();
    return this.sitesFin.filter((option: any) =>
      option.nombre.toLowerCase().includes(filterValue)
    );
  }

  displayFnFin(value: any) {
    return value ? value.nombre : undefined;
  }

  onSetSiteFin(value: Site) {
    if (!this.bitacora) return;
    this.siteForm.patchValue({ site_fin_id: value.id });
    this.bitacora.site_fin = value;
    this.siteFin = value;
    // this.dataResponsables();
  }
  //fin Autocomplete Site fin

  dataResponsables() {
    this.usuarioService.showResponsables().subscribe((resp) => {
      console.log(resp);
      this.responsables_cicsa = resp.cicsa;
      this.responsables_claro = resp.claro;
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

    const result = {
      ...this.bitacora,
      ...this.datosForm.value,
      ...this.siteForm.value,
      ...this.brigadasForm.value,
      ...this.responsablesForm.value,
    };
 
    if (this.bitacora.id) {
      this.bitacoraService
        .update(this.bitacora.id, result)
        .subscribe((resp) => {
          console.log(resp);
          if (resp.message == 403) {
            this.utilities.snackBar('Falta ingresar datos');
          } else {
            this.utilities.snackBar('Registro Exitoso');
            this.router.navigate(['/bitacoras/list-bitacora']);
          }
        });
      return;
    }
    this.bitacoraService.create(result).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.utilities.snackBar('Falta ingresar datos');
      } else {
        this.utilities.snackBar('Registro Exitoso');
        this.router.navigate(['/bitacoras/list-bitacora']);
      }
    });
  }

  onAddBrigada() {
    const ref = this.dialog.open(AddCuadrillaComponent);
    ref.afterClosed().subscribe(() => {
      this.getTableData();
    });
  }

  onDelete() {
    this.alertService.alert({
      title: 'Borrar Bitacora',
      message: '¿Estás seguro de borrar la bitacora?',
      buttons: [
        { text: 'Cancelar' },
        {
          text: 'Borrar',
          color: 'warn',
          action: () => {
            this.bitacoraService.delete(this.bitacora.id).subscribe(() => {
              this.utilities.snackBar('Bitacora Borrada');
              this.router.navigate(['bitacoras/list-bitacora']);
            });
          },
        },
      ],
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
