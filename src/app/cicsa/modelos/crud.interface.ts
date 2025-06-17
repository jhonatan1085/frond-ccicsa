export interface CrudResponse {
  message: number;
  message_text: string;
}

export interface Page<T> {
  total: number;
  data: T[];
  current_page?: number;
  last_page?: number;
}

export interface ReadOptions {
  page?: number;
  search?: string;
  perPage?: number;
}

export interface Respuesta<T> {
  bitacora: { data: T[] };
}
