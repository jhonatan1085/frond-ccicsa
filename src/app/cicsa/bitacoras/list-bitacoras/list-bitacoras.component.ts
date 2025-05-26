import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Atencion, Bitacora, CalcularTiempo, DemoraBitacoraExtended } from '../../modelos';
import { EndBitacorasComponent } from '../end-bitacoras/end-bitacoras.component';
import { LocationBitacorasComponent } from '../location-bitacoras/location-bitacoras.component';
import { ViewBitacorasComponent } from '../view-bitacoras/view-bitacoras.component';
import { BitacorasService } from '../../services/bitacoras.service';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { UserAuth } from 'src/app/shared/models/models';
import { AddDemorasComponent } from '../add-demoras/add-demoras.component';
import * as XLSX from 'xlsx';
import { FileSaverService } from 'ngx-filesaver';
import { DateTime } from 'luxon';
import { TimeUtilsService } from '../../services/time-utils.service';
import { UtilitiesService } from '../../services/utilities.service';
import { EndSotComponent } from '../end-sot/end-sot.component';
import { WhatsappService } from '../../services/whatsapp.service';


@Component({
  selector: 'app-list-bitacoras',
  templateUrl: './list-bitacoras.component.html',
  styleUrls: ['./list-bitacoras.component.scss']
})
export class ListBitacorasComponent implements OnInit {

  public fecha_llegada?: string;

  public user?: UserAuth;
  esMovil: boolean = false;

  public detalleBitacora: Bitacora[] = [];
  public bitacoras: Bitacora[] = [];
  dataSource!: MatTableDataSource<Bitacora>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;

  public serialNumberArray: number[] = [];
  public currentPage = 1;
  public pageNumberArray: number[] = [];
  public pageSelection: any[] = [];
  public totalPages = 0;

  bitacora_generals: Bitacora[] = [];
  bitacora_selected?: Bitacora;
 qrData: string | null = null;
  error: string | null = null;



  constructor(
    public bitacoraService: BitacorasService,
    public dialog: MatDialog,
    public auth: AuthService,
    private fileSaver: FileSaverService,
    private time_utils: TimeUtilsService,
    private utilities: UtilitiesService,
    private whatsapp: WhatsappService
  ) {

  }

  estado = '';
  qrImagen = '';
  cargando = true;

estado$ = this.utilities.estado$;
qrImagen$ = this.utilities.qrImagen$;

  ngOnInit() {
    this.esMovil = this.utilities.isMobile();
    this.user = this.auth.user
    this.getTableData();

    this.utilities.consultarEstado();

    this.utilities.qrImagen$.subscribe(qr => this.qrImagen = qr);

  }

  private getTableData(page = 1): void {
    //this.bitacoraList = [];
    this.serialNumberArray = [];
    this.bitacoraService
      .readAll({ page, search: this.searchDataValue })
      .subscribe((resp) => {

        this.totalData = resp.total;
        //this.bitacoras = resp.data;

        this.bitacoras = resp.data.map(item => ({
          ...item,
          estado_sot: !!item.estado_sot // Convierte 0 o 1 a true o false
        }));

        this.dataSource = new MatTableDataSource<Bitacora>(this.bitacoras);
        this.calculateTotalPages(this.totalData, this.pageSize);
      });
  }

  /*   getTableDataGeneral() {
      this.bitacoras = [];
      this.serialNumberArray = [];
      this.bitacoras.map((res: any, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.bitacoras.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<any>(this.bitacoras);
      this.calculateTotalPages(this.totalData, this.pageSize);
    } */

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

    if (!bitacora.latitud || !bitacora.longitud) {
      this.utilities.snackBar('La bitacora no puede ser cerrada, no cuenta con latitud y longitud');
      return; // Detén el flujo si no son válidos
    }

    const ref = this.dialog.open(EndBitacorasComponent, {
      data: { bitacora: bitacora },
    });

    ref.afterClosed().subscribe(() => {
      this.getTableData(this.currentPage);
    })
  }


  envioWhatsApp(id: number) {
      this.utilities.envioWhatsApp(id, 'prueba envio')
  }

  openDialogDemora(bitacora: Bitacora) {

    this.dialog.open(AddDemorasComponent, {
      data: { bitacora: bitacora },
    });
 
 }


  openDialogLocation(bitacora: Bitacora) {
    const ref = this.dialog.open(LocationBitacorasComponent, {
      data: { bitacora: bitacora },
    });

    ref.afterClosed().subscribe(() => {
      this.getTableData(this.currentPage);
    })

  }

  inactiva(bitacora: Bitacora) {

    if (bitacora.estado_sot == true) {
      const ref = this.dialog.open(EndSotComponent, {
        data: { bitacora: bitacora },
      });
      ref.afterClosed().subscribe(() => {
        this.getTableData(this.currentPage);
      })
    }
  }



  exportExcel() {
    const page = 1
    this.bitacoraService
      .exportExcel()
      .subscribe((resp) => {

        this.totalData = resp.total;

        this.detalleBitacora = resp.data;

        console.log(resp.data)
        const data = this.exportDataToExcel(resp.data);
        // Crear la hoja de trabajo desde los datos JSON
        const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

        // Cambiar los nombres de las cabeceras manualmente (primer fila)
        const headers = [
          'Año', 'Mes', 'Semana', 'Fecha y Hora Asignación Cliente', 'Fecha y Hora Ejecucion', 'Incidencia', 'SOT', 'Fecha y Hora se creacion de SOT', 'Estatus SGA',
          'Tipo de Incidencia', 'Red Afectada', 'Causa de Avería', 'Agrupamiento de Causa de Avería', 'Afectación de Servicio', 'Afectación Masiva',
          'Base', 'Zona', 'SUP. Claro', 'SUP. Cicsa', 'Brigada #1 Asignada', 'Hora Asignación', 'Horarios por cuadrantes', 'POP/Site/Nodo', 'Departamento', 'Provincia', 'Distrito del punto de avería', 'Region Geografica',
          'Fecha y Hora Llegada al Sitio', 'SLA Traslado Pop / Cliente2', 'Fecha y Hora de UBICACION punto de Avería / Trabajo2', 'SLA ubicación punto Avería2', 'Fecha y Hora UP Avería / Reparación TUPs', 'SLA Trabajos preliminares + Prepara. y Fusión',
          'SLA TOTAL Avería / Atención', 'Cumplió SLA', 'Fecha y Hora de Retiro de la brigada', 'Tiempo total de atencion de incidencias',
          'DEMORA #1 (cuando no se cumpla con el SLA)', 'F. y Hora INICIO Demora #1', 'F. y Hora FIN Demora #1', 'Tiempo de Demora #1',
          'DEMORA #2 (cuando no se cumpla con el SLA)', 'F. y Hora INICIO Demora #2', 'F. y Hora FIN Demora #2', 'Tiempo de Demora #2',
          'DEMORA #3 (cuando no se cumpla con el SLA)', 'F. y Hora INICIO Demora #3', 'F. y Hora FIN Demora #3', 'Tiempo de Demora #3', 'Total Demoras',
          ' Coordenadas - Punto Averia LATITUD2', ' Coordenadas - Punto Averia LONGITUD',
          'bitacora', 'Tipo de Trabajo', 'Prioridad', 'Observaciones', 'NOMBRE DE EVENTO O INTERCONEXION'
        ];

        // Asignamos las cabeceras a las celdas de la primera fila
        const headerRow = headers.map((header, index) => ({
          v: header,
          t: 's'
        }));

        headerRow.forEach((header, index) => {
          const col = this.getExcelColumnName(index); // Convierte el índice en nombre de columna
          worksheet[`${col}1`] = header; // Asigna los valores a la primera fila de cada columna
        });

        /*                // Opciones de formato para las celdas
                      const workbook: XLSX.WorkBook = {
                        Sheets: { 'Datos': worksheet },
                        SheetNames: ['Datos']
                      };
              
                      const excelBuffer: any = XLSX.write(workbook, {
                        bookType: 'xlsx',
                        type: 'array',
                      });
                      this.saveAsExcelFile(excelBuffer, 'datos_exportados');  */

        // Convertir la hoja de trabajo a CSV
        const csv = XLSX.utils.sheet_to_csv(worksheet);

        // Guardar el archivo CSV
        this.saveAsCSVFile(csv, 'Exportacion.csv');
      });
  }

  private getExcelColumnName(index: number): string {
    let columnName = '';
    while (index >= 0) {
      columnName = String.fromCharCode((index % 26) + 65) + columnName;
      index = Math.floor(index / 26) - 1;
    }
    return columnName;
  }

  private tiempofinsla(atencion: Atencion[], id: number): string | undefined {

    var horas = ""
    atencion.forEach((element: Atencion) => {
      if (element.atencion.id === id) {
        horas = element.hora
      }

    });
    return horas
  }



  private exportDataToExcel(bitacoras: Bitacora[]) {

    return bitacoras.map((item: Bitacora) => {

      let llegada = this.tiempofinsla(item.atenciones, 1) || '';
      let ubicacion = this.tiempofinsla(item.atenciones, 5) || '';
      let fusion = this.tiempofinsla(item.atenciones, 6) || '';
      let retiro = this.tiempofinsla(item.atenciones, 10) || '';

      let tiempototal: CalcularTiempo[] = [];
      let tiempo: CalcularTiempo;

      if (llegada) {
        tiempo = {
          fecha_inicio: item.fecha_ejecucion || '',
          fecha_fin: llegada
        }
        tiempototal.push(tiempo);
      }

      if (llegada && ubicacion) {
        tiempo = {
          fecha_inicio: llegada,
          fecha_fin: ubicacion
        }
        tiempototal.push(tiempo);
      }

      if (ubicacion && fusion) {
        tiempo = {
          fecha_inicio: ubicacion,
          fecha_fin: fusion
        }
        tiempototal.push(tiempo);
      }

      let llegada_sla = llegada ? this.time_utils.calcularDiferenciaTiempo(item.fecha_ejecucion || '', llegada) : ''
      let ubica_punto_sla = llegada && ubicacion ? this.time_utils.calcularDiferenciaTiempo(llegada || '', ubicacion) : ''
      let fusion_sla = ubicacion && fusion ? this.time_utils.calcularDiferenciaTiempo(ubicacion || '', fusion) : ''


      let texto_averia = item.tipo_averia.nombre === "Preventivo" || item.tipo_averia.nombre === "Sinergia" ? item.causa_averia?.nombre === "" ? 'FALSA AVERÍA' : 'NO ES AVERIA' : ''

      let demoras: DemoraBitacoraExtended[] = [];
      demoras = item.demoras?.map((item) => ({
        ...item,
        tiempoDemora: this.time_utils.convierteHoras(this.time_utils.calcularDiferenciaTiempo(item.fecha_inicio || '', item.fecha_fin))
      })) ?? [];

      let totalDemoras = this.time_utils.updateTotalDemoras(demoras);

      let total_sla = fusion ? this.time_utils.calcularDiferenciaTiempo(item.fecha_inicial || '', fusion) - totalDemoras : ''

      let tiempo_total = retiro ? this.time_utils.calcularDiferenciaTiempo(item.fecha_inicial || '', retiro) - totalDemoras : ''


      return {
        anio: item.anio,
        mes: item.mes,
        semana: item.semana,
        fecha_inicial: item.fecha_inicial,
        fecha_ejecucion: item.fecha_ejecucion,
        nro_incidencia: item.incidencia,
        nro_sot: item.sot,
        fecha_sot: item.fecha_sot,
        status_sot: item.estado_sot,
        incidencia: item.tipo_averia.incidencia,
        red_afectada: item.red.nombre,
        causa_averia: item.causa_averia?.nombre,
        agru_causa_averia: item.causa_averia?.tipo_causa_averia.nombre || '',
        afectacion_servicio: item.afect_servicio,//item.tipo_averia.nombre === "Preventivo" ? "No" : "Si",
        afectacion_masiva: item.afect_masiva,
        base: item.site.zona,
        zona: item.site.region,
        sup_claro: item.resp_claro.nombres,
        sup_cicsa: item.resp_cicsa.nombres,
        brigada: item.nombre_brigada,
        hora_asignacion: item.hora_asignacion,
        horarios_cuadrantes: this.utilities.obtenerCuadrante(item.hora_asignacion || ''),
        site: item.site.nombre,
        departamento: item.site.departamento?.nombre,
        provincia: item.site.provincia?.nombre,
        distrito: item.site.distrito?.nombre,
        region_geografica: item.site.region_geografica?.nombre,
        fecha_llegada: llegada,
        sla_llegada: item.tipo_averia.nombre === "Correctivo" ? this.time_utils.convierteHoras(llegada_sla) : texto_averia,//llegada  ? this.time_utils.calcularTiempoDemora(item.fecha_ejecucion || '' , llegada) :  "",
        fecha_ubica_punto: ubicacion,
        sla_ubica_punto: item.tipo_averia.nombre === "Correctivo" ? this.time_utils.convierteHoras(ubica_punto_sla) : texto_averia, //llegada && ubicacion ? this.time_utils.calcularTiempoDemora(llegada || '' , ubicacion) :  "",
        fecha_fusion: fusion,
        sla_fusion: item.tipo_averia.nombre === "Correctivo" ? this.time_utils.convierteHoras(fusion_sla) : texto_averia,// ubicacion && fusion ? this.time_utils.calcularTiempoDemora(ubicacion || '' , fusion) :  "",
        sla_total: item.tipo_averia.nombre === "Correctivo" ? this.time_utils.convierteHoras(total_sla) : texto_averia,
        sla_cumplio: "",
        retiro: retiro,
        sla_tiempo_total: item.tipo_averia.nombre === "Correctivo" ? this.time_utils.convierteHoras(tiempo_total) : texto_averia,
        demora_1: demoras[0]?.demora_nombre ? demoras[0].demora_nombre : '',
        inicio_demora_1: demoras[0]?.fecha_inicio ? demoras[0].fecha_inicio : '',
        fin_demora_1: demoras[0]?.fecha_fin ? demoras[0].fecha_fin : '',
        tiempo_demora_1: demoras[0]?.tiempoDemora ? demoras[0].tiempoDemora : '',
        demora_2: demoras[1]?.demora_nombre ? demoras[1].demora_nombre : '',
        inicio_demora_2: demoras[1]?.fecha_inicio ? demoras[1].fecha_inicio : '',
        fin_demora_2: demoras[1]?.fecha_fin ? demoras[1].fecha_fin : '',
        tiempo_demora_2: demoras[1]?.tiempoDemora ? demoras[1].tiempoDemora : '',
        demora_3: demoras[2]?.demora_nombre ? demoras[2].demora_nombre : '',
        inicio_demora_3: demoras[2]?.fecha_inicio ? demoras[2].fecha_inicio : '',
        fin_demora_3: demoras[2]?.fecha_fin ? demoras[2].fecha_fin : '',
        tiempo_demora_3: demoras[2]?.tiempoDemora ? demoras[2].tiempoDemora : '',
        total_demoras: item.demoras ? this.time_utils.convierteHoras(totalDemoras) : '',
        latitud: item.latitud,
        longitud: item.longitud,
        bitacora: this.utilities.armaBitacora(item),
        Tipo_trabajo: item.tipo_reparacion?.nombre ? item.tipo_reparacion.nombre : '',//,
        prioridad: "",
        Observacion: "",
        nombre_bitacora: item.nombre,
        enlace: item.enlace_plano_site
      }
      /* item.estado = item.estadotext
      delete item.estadotext */

      /*    item.fecha = new Date( item.fecha).getTime() // Convertir a valor numérico de fecha
         item.fecha_ejecucion =  new Date( item.fecha_ejecucion).getTime()  */
      /*  item.anio = item.anio // Año
       item.mes =  item.mes // Mes
       item.semana = item.semana // Semana
       item.fecha_inicial =  new Date(item.fecha_inicial).toLocaleString() // Convertir fecha inicial a string
       item.fecha_ejecucion =  new Date(item.fecha_ejecucion).toLocaleString() // Convertir fecha final a string
       item.sot = item.sot // SOT */

      //return item
    })
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const blobData: Blob = new Blob([buffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
    });

    this.fileSaver.save(blobData, fileName + '.xlsx');
  }

  private saveAsCSVFile(csv: string, fileName: string): void {
    const data: Blob = new Blob([csv], { type: 'text/csv;charset=UTF-8' });
    this.fileSaver.save(data, fileName);
  }
  
reconectarBot(): void {
  this.utilities.reconectar();
}

}
