export interface CrudResponse<T = any> {
  message: number;
  message_text: string;
  data?: T;                             // datos que retorna el backend
  errors?: { [key: string]: string[] }; 
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
