import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../../services/site.service';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
})
export class EditSiteComponent {
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

  public codigo: string = '';
  public nombre: string = '';
  public latitud: string = '';
  public longitud: string = '';
  public direccion: string = '';
  public tiempoSla: string = '';
  public autonomiaBts: string = '';
  public autonomiaTx: string = '';
  public tiempoAuto: string = '';
  public tiempoCaminando: string = '';
  public tiempoAcceso: string = '';
  public suministro: string = '';
  public observacion: string = '';

  public roles: any = [];
  public educacions: any = [];

  public departamentos: any = [];
  public provincias: any = [];
  public municipalidades: any = [];
  public distritos: any = [];
  public tiposites: any = [];
  public zonas: any = [];
  public regions: any = [];
  public regionGeograficas: any = [];
  public consesionarias: any = [];
  public roomtypes: any = [];
  public contratistas: any = [];
  public tipoAcceso: any = [];
  public prioridad: any = [];
  public tipoEnergia: any = [];

  public text_success: string = '';
  public text_validation: string = '';

  public site_id: any;
  public site_selected: any;

  constructor(
    public siteService: SiteService,
    public activeRoute: ActivatedRoute // para las variables enviadas al formulario
  ) {}

  ngOnInit(): void {
    this.siteService.listConfig().subscribe((resp: any) => {
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
      this.provincias = resp.provincias;
      this.distritos = resp.distritos;
    });

    this.activeRoute.params.subscribe((resp: any) => {
      console.log(resp);
      this.site_id = resp.id;
    });

    this.siteService.read(this.site_id).subscribe((resp: any) => {
      console.log(resp);
      this.site_selected = resp.site;

      this.codigo = this.site_selected.codigo;
      this.nombre = this.site_selected.nombre;
      this.latitud = this.site_selected.latitud;
      this.longitud = this.site_selected.longitud;
      this.direccion = this.site_selected.direccion;
      this.selectedMunicipalidad = this.site_selected.municipalidade.id;
      this.selectedDistrito = this.site_selected.distrito.id;
      this.selectedProvincia = this.site_selected.provincia.id;
      this.selectedDepartamento = this.site_selected.departamento.id;

      this.selectedTipoSite = this.site_selected.tipo_site.id;
      this.selectedZona = this.site_selected.zona.id;
      this.selectedRegion = this.site_selected.region.id;
      this.selectedRegionGeo = this.site_selected.region_geografica.id;
      this.tiempoSla = this.site_selected.tiempo_sla;
      this.autonomiaBts = this.site_selected.autonomia_bts;
      this.autonomiaTx = this.site_selected.autonomia_tx;
      this.tiempoAuto = this.site_selected.tiempo_auto;
      this.tiempoCaminando = this.site_selected.tiempo_caminata;
      this.tiempoAcceso = this.site_selected.tiempo_acceso;
      this.suministro = this.site_selected.suministro;

      this.selectedConsesionaria = this.site_selected.consesionaria.id;
      this.selectedRoomType = this.site_selected.room_type.id;
      this.selectedContratista = this.site_selected.contratista.id;
      this.selectedTipoAcceso = this.site_selected.tipo_acceso.id;
      this.selectedPrioridad = this.site_selected.prioridad_site.id;
      this.selectedTipoEnergia = this.site_selected.tipo_energia.id;
      this.observacion = this.site_selected.observacion.id;
      /**/

      /* this.selectedValue = this.usuario_selected.role.id ;
      this.selectedEducacion = this.usuario_selected.educacion.id ;
      this.selectedZona = this.usuario_selected.zona.id ;


      this.name = this.usuario_selected.name ;
      this.surname = this.usuario_selected.surname ;
      this.cel_corp = this.usuario_selected.cel_corp ;
      this.dni = this.usuario_selected.dni ;
      this.cel_per = this.usuario_selected.cel_per ;

      this.email = this.usuario_selected.email ;
      this.birth_date = new Date( this.usuario_selected.birth_date ).toISOString();
      this.gender = this.usuario_selected.gender ;
      this.education = this.usuario_selected.education ;
      this.designation = this.usuario_selected.designation ;
      this.address = this.usuario_selected.address ;
      this.IMAGEN_PREVIZUALIZA = this.usuario_selected.avatar; */
    });
  }

  provincia() {
    //console.log(this.selectedDepartamento);

    this.siteService
      .showProvinciasDep(this.selectedDepartamento)
      .subscribe((resp: any) => {
        console.log(resp);
        this.provincias = resp.provincias;
      });
  }

  distrito() {
    //console.log(this.selectedDepartamento);
    this.siteService
      .showDistritoProv(this.selectedProvincia)
      .subscribe((resp: any) => {
        console.log(resp);
        this.distritos = resp.distritos;
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

    let formData = new FormData();
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

    this.siteService.update(this.site_id, formData).subscribe((resp: any) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
      } else {
        this.text_success = 'El usuario ha sido registrado correctamente';
      }
    });
  }
}
