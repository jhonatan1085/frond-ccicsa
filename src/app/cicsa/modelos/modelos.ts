export interface Bitacora {
  id: number;
  nombre: string;
  fecha_inicial: string;
  sot: string; // Puede ser de cualquier tipo, ajusta según corresponda
  incidencia: string; // Puede ser de cualquier tipo, ajusta según corresponda
  tipo_averia: Tipo;
  red: Tipo;
  serv: Tipo;
  resp_cicsa: Responsable;
  resp_claro: Responsable;
  estado: string;
  estadotext: string;
  latitud?: string;
  longitud?: string;
  distancia: number;
  site: Site;
  cliente?: string;
  brigadas: Cuadrilla[];
  atenciones: Atencion[];
  causa_averia: Tipo;
  consecuencia_averia: Tipo;
  tipo_reparacion: Tipo;
  herramientas: string;
  tiempo_solucion: string;
}
export interface Config {
  tipoaveria: Tipo[];
  red: string[];
  serv: string[];
}

export interface Tipo {
  id: number;
  nombre: string;
}

export interface Responsable {
  id: number;
  nombres: string;
  telefono?: string;
}

export interface Site {
  id: number;
  nombre: string;
  region: Tipo;
  distrito: Distrito;
  departamento: Tipo;
  tipo_site: Tipo;
  codigo: string;
  latitud: number;
  longitud: number;
  direccion: string;
  municipalidade: Tipo;
  zona: Tipo;
  region_geografica: Tipo;
  tiempo_sla: number;
  autonomia_bts: number;
  autonomia_tx: number;
  tiempo_auto: number;
  tiempo_caminata: number;
  tiempo_acceso: number;
  suministro: string;
  consesionaria: Tipo;
  room_type: Tipo;
  contratista: Tipo;
  tipo_acceso: Tipo;
  prioridad_site: Tipo;
  tipo_energia: Tipo;
  provincia: Tipo;
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

export interface Cuadrilla {
  id: number;
  estado: string;
  estadotext: string;
  contratista: Contratista;
  tipo_brigada: Tipo;
  zona: Zona;
  user_movil: UsuarioMovil[];
}

export interface Contratista {
  id: number;
  nombre: string;
}

export interface Zona {
  id: number;
  nombre: string;
}

export interface UsuarioMovil {
  id: number;
  is_lider: '0' | '1';
  user: Usuario;
  unidad_movil?: UnidadMovil;
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
}

export interface UnidadMovil {
  id: number;
  placa: string;
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
