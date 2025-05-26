import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WhatsappService {

    private apiUrl = 'http://localhost:3000/api'; // Cambia si lo subes al servidor

  constructor(private http: HttpClient) {}

  getQrCode(): Observable<{ qr: string }> {
    return this.http.get<{ qr: string }>(`${this.apiUrl}/qr`);
  }

  getEstado(): Observable<{ estado: string }> {
    return this.http.get<{ estado: string }>(`${this.apiUrl}/estado-whatsapp`);
  }

  enviarMensaje(grupoNombre: string, mensaje: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/enviar-whatsapp`, { grupoNombre, mensaje });
  }

  // ✅ Método para reiniciar el bot
  reconectar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/reconectar-whatsapp`, {});
  }

}
