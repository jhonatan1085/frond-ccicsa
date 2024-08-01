export interface CrudResponse {
  message: number;
  message_text: string;
}

export interface Page<T> {
  total: number;
  data: T[];
}

export interface ReadOptions {
  page?: number;
  search?: string;
}

export interface Respuesta<T> {
  bitacora: { data: T[] };
}
