export interface Bitacora {
  id: number;
  nombre: string;
  fecha_inicial: string;
  sot: string; // Puede ser de cualquier tipo, ajusta según corresponda
  incidencia: string; // Puede ser de cualquier tipo, ajusta según corresponda
  tipo_averia: TipoAveria;
  red: Tipo;
  serv: Tipo;
  resp_cicsa: Responsable;
  resp_claro: Responsable;
  estado: string;
  estadotext: string;
  latitud?: number;
  longitud?: number;
  distancia: number;
  site: Site;
  brigada: Brigada[];
  atenciones: Atencion[];
  causa_averia: Tipo;
  consecuencia_averia: Tipo;
  tipo_reparacion:Tipo;
  herramientas: Tipo;
}

export interface TipoAveria {
  id: number;
  nombre: string;
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
  region: string;
  distrito: Distrito;
  departamento: Departamento;
  tipo_site: Tipo;
}

export interface Distrito {
  id: number;
  nombre: string;
}

export interface Departamento {
  id: number;
  nombre: string;
}

export interface Brigada {
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
  is_lider: "0" | "1";
  user: Usuario;
  unidad_movil?: UnidadMovil;
}

export interface Usuario {
  id: number;
  nombre: string;
  celular?: string;
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

  id: number,
  hora: string,
  descripcion: string,
  orden: number,
  atencion_id: number,
  bitacora_id: number,
  parent_id: number
}


export interface AtencionBitacora {
  id: number,
  descripcion: string,
  orden: number,
  bitacora_atencion: BitacoraAtencion[]
}


export interface BitacoraAtencion {
  id: number,
  hora: string,
  orden: number,
  is_coment: string,
  atencion_id?: number,
  bitacora_id?: number,
  parent_id?: number,
  descripcion: string,
  bitacora_atencion: BitacoraAtencion[], // Recursividad para los padres de la atención
}


export interface Respuesta<T> {
  bitacora: { data: T[] }
}