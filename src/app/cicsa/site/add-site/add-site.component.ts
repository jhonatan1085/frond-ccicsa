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


  public codigo = '';
  public nombre = '';
  public latitud = '';
  public longitud = '';
  public direccion = '';

  public observacion = '';

  public departamentos: any[] = [];
  public provincias: any[] = [];
  public municipalidades: any[] = [];
  public distritos: any[] = [];
  public tiposites: any[] = [];
  public zonas: any[] = [];
  public regions: any[] = [];
  public regionGeograficas: any[] = [];

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
        'LOS CAMPOS SON NECESARIOS (nombre, codigo)';
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
    formData.append('observacion', this.observacion);

    this.siteService.create(formData).subscribe((resp) => {
      console.log(resp);
      if (resp.message == 403) {
        this.text_validation = resp.message_text;
      } else {
        this.text_success = 'El Site ha sido registrado correctamente';
        this.selectedDepartamento = '';
        this.selectedProvincia = '';
        this.selectedDistrito = '';
        this.selectedMunicipalidad = '';
        this.selectedTipoSite = '';
        this.selectedZona = '';
        this.selectedRegion = '';
        this.selectedRegionGeo = '';

        this.provincias = [];
        this.distritos = [];
        this.codigo = '';
        this.nombre = '';
        this.latitud = '';
        this.longitud = '';
        this.direccion = '';
        this.observacion = '';
      }
    });
  }
}
