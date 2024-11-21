import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SiteService } from '../../services/site.service';
import { ConfigService } from '../../services/config.service';
import { Distrito, Provincia, Site } from '../../modelos';

@Component({
  selector: 'app-edit-site',
  templateUrl: './edit-site.component.html',
  styleUrls: ['./edit-site.component.scss'],
})
export class EditSiteComponent implements OnInit {
  public selectedDepartamento!: string;
  public selectedProvincia!: string;
  public selectedDistrito!: string;
  public selectedMunicipalidad!: string;
  public selectedTipoSite!: string;
  public selectedZona!: string;
  public selectedRegion!: string;
  public selectedRegionGeo!: string;
 



  public codigo = '';
  public nombre = '';
  public latitud = '';
  public longitud = '';
  public direccion = '';
  public observacion = '';

  public departamentos: any[] = [];
  public provincias: Provincia[] = [];
  public municipalidades: any[] = [];
  public distritos: Distrito[] = [];
  public tiposites: any[] = [];
  public zonas: any[] = [];
  public regions: any[] = [];
  public regionGeograficas: any[] = [];



  public text_success = '';
  public text_validation = '';

  public site_id: any;
  public site_selected: any;

  constructor(
    public siteService: SiteService,
    public configService: ConfigService,
    public activeRoute: ActivatedRoute // para las variables enviadas al formulario
  ) { }

  ngOnInit(): void {
    this.configService.sites().subscribe((resp) => {
      console.log(resp);
      this.municipalidades = resp.municipalidades;
      this.tiposites = resp.tiposites;
      this.zonas = resp.zonas;
      this.regions = resp.regions;
      this.regionGeograficas = resp.regionGeograficas;
      this.departamentos = resp.departamentos;
      this.provincias = resp.provincias;
      this.distritos = resp.distritos;
    });

    this.activeRoute.params.subscribe((resp) => {
      console.log(resp);
      this.site_id = resp['id'];
    });

    this.siteService.read(this.site_id).subscribe((resp) => {
      console.log(resp);
      this.site_selected = resp;

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
      this.observacion = this.site_selected.observacion;
    });
  }

  provincia() {
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
  municipalidad() {
    //console.log(this.selectedDepartamento);
    this.siteService
      .showMunicipalidadDistrito(this.selectedDistrito)
      .subscribe((resp) => {
        console.log(resp);
        this.municipalidades = resp.data;
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
    formData.append('tipo_site_id', this.selectedTipoSite);
    formData.append('zona_id', this.selectedZona);
    formData.append('region_id', this.selectedRegion);
    formData.append('region_geografica_id', this.selectedRegionGeo);
    formData.append('observacion', this.observacion);

    const data: Site = {
      codigo: this.codigo,
      nombre: this.nombre,
      latitud: this.latitud,
      longitud: this.longitud,
      direccion: this.direccion,
      municipalidade_id: this.selectedMunicipalidad,
      tipo_site_id: this.selectedTipoSite,
      zona_id: this.selectedZona,
      region_id: this.selectedRegion,
      region_geografica_id: this.selectedRegionGeo,
      observacion: this.observacion
    };


    console.log(data);

    console.log(this.site_id);
    this.siteService.update(this.site_id, data).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
      } else {
        this.text_success = 'El Site ha sido actualizado correctamente';
      }
    });
  }
}
