export interface Bitacora {
  correlativo?: number;
  anio?: number;
  mes?: number;
  semana?: number;
  hora_asignacion?: string;
  cuadrantes?: string;
  nombre_brigada?: string;
  id: number;
  nombre: string;
  enlace_plano_site?: string;
  fecha_inicial: string;
  fecha_ejecucion?: string;
  sot: string; // Puede ser de cualquier tipo, ajusta según corresponda
  fecha_sot?: string;
  estado_sot?: boolean;
  estado_sot_text?: string;
  incidencia: string; // Puede ser de cualquier tipo, ajusta según corresponda
  tipo_averia: TipoAveria;
  red: Tipo;
  serv: Tipo;
  nro_tas?: string;
  nro_crq?: string;
  resp_cicsa: Responsable;
  resp_claro: Responsable;
  estado: string;
  estadotext: string;
  latitud?: string;
  longitud?: string;
  distancia: number;
  site: Site;
  site_fin: Site;
  cliente?: string;
  brigadas: Cuadrilla[];
  atenciones: Atencion[];
  causa_averia: CausaAveria;
  consecuencia_averia: Tipo;
  tipo_reparacion: Tipo;
  herramientas: Herramienta[];
  tiempo_solucion: string;
  demoras?: DemoraBitacora[];
  afect_servicio?: Boolean;
  afect_masiva?: Boolean;
}

export interface Herramienta {
  cantidad: number;
  nombre: string;
}

export interface Config {
  tipoaveria: TipoAveria[];
  red: string[];
  serv: string[];
}

export interface CausaAveria {
  id: number;
  nombre: string;
  tipo_causa_averia: Tipo;
}

export interface Tipo {
  id: number;
  nombre: string;
  checked?: boolean;
}

export interface TipoAveria {
  id: number;
  nombre: string;
  incidencia?: string;
}

export interface Responsable {
  id: number;
  nombres: string;
  telefono?: string;
}

export interface MovimientoMaterial {
  cantidad: number;
  brigada_id: number;
  material: Material;
}

export interface Material {
  id: number;
  codigo: string;
  codigoSAP?: string;
  descripcion?: string;
  codigoAX?: string;
  nombre: string;
  unidad_medida: string;
  stock_actual: number;
}

export interface Movimiento {
  material_id: number;
  cantidad: number;
  brigada_id: number;
}

export interface AgregaMaterialesBitacora {
  bitacora_id: number;
  materiales: Movimiento[];
}

export interface Categoria {
  id: number;
  nombre: string;
}

export interface SubCategoria {
  id: number;
  nombre: string;
  categoria: Categoria;
}

export interface MaterialCreate {
  id?: number;
  codigo: string;
  codigoSAP: string;
  nombre: string;
  descripcion: string;
  codigoAX: string;
  sub_categoria_id: number;
  sub_categoria?: SubCategoria;
  categoria_id?: number;
  precio: number;
  unidad_medida: string;
  stock_minimo: number;
}

export interface CategoriaWithSubs {
  id: number;
  nombre: string;
  subcategorias: SubCategoriaSimple[];
}

export interface SubCategoriaSimple {
  id: number;
  nombre: string;
  categoria_id: number;
}

export interface Site {
  id?: number;
  nombre: string;
  region?: Tipo;
  region_id?: number | string;
  distrito_id?: number | string;
  distrito?: Distrito;
  departamento?: Tipo;
  tipo_site?: Tipo;
  tipo_site_id?: number | string;
  codigo: string;
  latitud: string;
  longitud: string;
  direccion: string;
  municipalidade_id?: number | string;
  municipalidade?: Tipo;
  zona?: Tipo;
  zona_id?: number | string;
  region_geografica?: Tipo;
  region_geografica_id?: number | string;
  provincia?: Tipo;
  observacion: string;
}

export interface Distrito {
  provincia: Provincia;
  id: number;
  nombre: string;
}
export interface Provincia {
  id: number;
  nombre: string;
  departamento: Departamento;
}

export interface Departamento {
  id: number;
  nombre: string;
}

export interface Brigada {
  id: number;
  nombre: string;
}

export interface CuadrillaCreate {
  zona_id: number;
  tipo_brigada_id: number;
  contratista_id: number;
  nombre: string;
  tecnicos: {
    user_id: number;
    movil_id: number | null;
    is_lider: number;
  }[];
}

export interface CuadrillaUpdate {
  tecnicos: {
    user_id: number;
    movil_id: number | null;
    is_lider: number;
  }[];
}

export interface Cuadrilla {
  id: number;
  estado: string;
  estadotext: string;
  contratista: Contratista;
  nombre?: string;
  tipo_brigada: Tipo;
  zona: Zona;
  user_movil: UsuarioMovil[];
}

export interface Zona {
  id: number;
  nombre: string;
}

export interface Contratista {
  id: number;
  nombre: string;
}

export interface UsuarioMovil {
  id: number;
  is_lider: '0' | '1';
  user: Usuario;
  unidad_movil?: UnidadMovil;
}

export interface UnidadMovil {
  id: number;
  placa: string;
  kilometraje: number;
  marca: Tipo;
  modelo: Tipo;
  color: Tipo;
  estado: string;
  estadotext: string;
}

export interface Usuario {
  avatar: string;
  address: string;
  designation: string;
  gender: number;
  birth_date: string | number | Date;
  email: string;
  cel_per: string;
  dni: string;
  cel_corp: string;
  surname: string;
  name: string;
  zona?: Tipo;
  educacion?: Tipo;
  role?: Tipo;
  id?: number;
  nombre: string;
  celular?: string;
  password?: string;
  role_id?: number | string;
  zona_id?: number | string;
  educacion_id?: number | string;
  zonas?: Tipo[];
}

export interface Atencion {
  atencion: AtencionDetalle;
  id: number;
  hora: string;
  orden: number;
  is_coment: string;
  atencion_id?: number;
  bitacora_id?: number;
  parent_id?: number;
  descripcion: string;
  bitacora_atencion: Atencion[]; // Recursividad para los padres de la atención
}

export interface AtencionDetalle {
  id: number;
  hora: string;
  descripcion: string;
  orden: number;
  atencion_id: number;
  bitacora_id: number;
  parent_id: number;
}

export interface CalcularTiempo {
  fecha_inicio: string | Date;
  fecha_fin: string | Date;
}

export interface DemoraBitacora {
  id?: number;
  bitacora_id: number;
  tipo_demora_id: number;
  demora_nombre?: string;
  fecha_inicio: string;
  fecha_fin: string;
  orden: number;
}

export interface DemoraBitacoraExtended extends DemoraBitacora {
  tiempoDemora: string; //tiempo de horas
}

export interface AtencionBitacora {
  id: number;
  descripcion: string;
  orden: number;
  bitacora_atencion: BitacoraAtencion[];
}

export interface BitacoraAtencion {
  id: number;
  hora: string;
  orden: number;
  is_coment: string;
  atencion_id?: number;
  bitacora_id?: number;
  parent_id?: number;
  descripcion: string;
  bitacora_atencion: BitacoraAtencion[]; // Recursividad para los padres de la atención
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface WhatsappGroup {
  nombre: string;
}
