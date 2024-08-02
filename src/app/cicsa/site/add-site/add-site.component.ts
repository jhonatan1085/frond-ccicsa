import { Component, OnInit } from '@angular/core';
import { SiteService } from '../../services/site.service';
import { ConfigService } from '../../services/config.service';

@Component({
  selector: 'app-add-site',
  templateUrl: './add-site.component.html',
  styleUrls: ['./add-site.component.scss'],
})
export class AddSiteComponent implements OnInit {
  public selectedDepartamento!: string;
  public selectedProvincia!: string;
  public selectedDistrito!: string;
  public selectedMunicipalidad!: string;
  public selectedTipoSite!: string;
  public selectedZona!: string;
  public selectedRegion!: string;
  public selectedRegionGeo!: string;
  public selectedConsesionaria!: string;
  public selectedRoomType!: string;
  public selectedContratista!: string;
  public selectedTipoAcceso!: string;
  public selectedPrioridad!: string;
  public selectedTipoEnergia!: string;

  public codigo = '';
  public nombre = '';
  public latitud = '';
  public longitud = '';
  public direccion = '';
  public tiempoSla = '';
  public autonomiaBts = '';
  public autonomiaTx = '';
  public tiempoAuto = '';
  public tiempoCaminando = '';
  public tiempoAcceso = '';
  public suministro = '';
  public observacion = '';

  public roles: any[] = [];
  public educacions: any[] = [];

  public departamentos: any[] = [];
  public provincias: any[] = [];
  public municipalidades: any[] = [];
  public distritos: any[] = [];
  public tiposites: any[] = [];
  public zonas: any[] = [];
  public regions: any[] = [];
  public regionGeograficas: any[] = [];
  public consesionarias: any[] = [];
  public roomtypes: any[] = [];
  public contratistas: any[] = [];
  public tipoAcceso: any[] = [];
  public prioridad: any[] = [];
  public tipoEnergia: any[] = [];

  public text_success = '';
  public text_validation = '';

  constructor(
    public siteService: SiteService,
    public configService: ConfigService
  ) {}

  ngOnInit(): void {
    this.configService.sites().subscribe((resp) => {
      console.log(resp);
      this.municipalidades = resp.municipalidades;
      this.tiposites = resp.tiposites;
      this.zonas = resp.zonas;
      this.regions = resp.regions;
      this.regionGeograficas = resp.regionGeograficas;
      this.consesionarias = resp.consesionarias;
      this.roomtypes = resp.roomtypes;
      this.contratistas = resp.contratistas;
      this.tipoAcceso = resp.tipoAcceso;
      this.prioridad = resp.prioridad;
      this.tipoEnergia = resp.tipoEnergia;
      this.departamentos = resp.departamentos;
    });
  }

  provincia() {
    //console.log(this.selectedDepartamento);

    this.siteService
      .showProvinciasDep(this.selectedDepartamento)
      .subscribe((resp) => {
        console.log(resp);
        this.provincias = resp.data;
      });
  }

  distrito() {
    //console.log(this.selectedDepartamento);
    this.siteService
      .showDistritoProv(this.selectedProvincia)
      .subscribe((resp) => {
        console.log(resp);
        this.distritos = resp.data;
      });
  }
  save() {
    this.text_validation = '';
    if (!this.codigo || !this.nombre) {
      this.text_validation =
        'LOS CAMPOS SON NECESARIOS (nombre, apellidos, email, avatar)';
      return;
    }

    //console.log(this.selectedValue);

    const formData = new FormData();
    formData.append('codigo', this.codigo);
    formData.append('nombre', this.nombre);
    formData.append('latitud', this.latitud);
    formData.append('longitud', this.longitud);
    formData.append('direccion', this.direccion);
    formData.append('municipalidade_id', this.selectedMunicipalidad);
    formData.append('distrito_id', this.selectedDistrito);
    formData.append('tipo_site_id', this.selectedTipoSite);
    formData.append('zona_id', this.selectedZona);
    formData.append('region_id', this.selectedRegion);
    formData.append('region_geografica_id', this.selectedRegionGeo);
    formData.append('tiempo_sla', this.tiempoSla);
    formData.append('autonomia_bts', this.autonomiaBts);
    formData.append('autonomia_tx', this.autonomiaTx);
    formData.append('tiempo_auto', this.tiempoAuto);
    formData.append('tiempo_caminata', this.tiempoCaminando);
    formData.append('tiempo_acceso', this.tiempoAcceso);
    formData.append('suministro', this.suministro);

    formData.append('consesionaria_id', this.selectedConsesionaria);
    formData.append('room_type_id', this.selectedRoomType);
    formData.append('contratista_id', this.selectedContratista);
    formData.append('tipo_acceso_id', this.selectedTipoAcceso);
    formData.append('prioridad_site_id', this.selectedPrioridad);
    formData.append('tipo_energia_id', this.selectedTipoEnergia);
    formData.append('observacion', this.observacion);

    this.siteService.create(formData).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
      } else {
        this.text_success = 'El usuario ha sido registrado correctamente';
        this.selectedDepartamento = '';
        this.selectedProvincia = '';
        this.selectedDistrito = '';
        this.selectedMunicipalidad = '';
        this.selectedTipoSite = '';
        this.selectedZona = '';
        this.selectedRegion = '';
        this.selectedRegionGeo = '';
        this.selectedConsesionaria = '';
        this.selectedRoomType = '';
        this.selectedContratista = '';
        this.selectedTipoAcceso = '';
        this.selectedPrioridad = '';
        this.selectedTipoEnergia = '';
        this.provincias = [];
        this.distritos = [];
        this.codigo = '';
        this.nombre = '';
        this.latitud = '';
        this.longitud = '';
        this.direccion = '';
        this.tiempoSla = '';
        this.autonomiaBts = '';
        this.autonomiaTx = '';
        this.tiempoAuto = '';
        this.tiempoCaminando = '';
        this.tiempoAcceso = '';
        this.suministro = '';
        this.observacion = '';
      }
    });
  }
}
