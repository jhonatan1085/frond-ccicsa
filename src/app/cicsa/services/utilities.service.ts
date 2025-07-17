import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common'; // Importa DatePipe
import {
  Atencion,
  Bitacora,
  CalcularTiempo,
  Cuadrilla,
  Herramienta,
  UsuarioMovil,
  WhatsappGroup,
} from '../modelos';
import {
  AbstractControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BitacorasService } from './bitacoras.service';
import { WhatsappService } from './whatsapp.service';

import { BehaviorSubject, interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {
  private sessionId = '';
  private pollingSub: Subscription | null = null;

  private qrSubject = new BehaviorSubject<string>('');
  qrImagen$ = this.qrSubject.asObservable();

  private estadoSubject = new BehaviorSubject<
    'esperando_qr' | 'conectado' | 'error'
  >('esperando_qr');
  estado$ = this.estadoSubject.asObservable();

  constructor(
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private whatsapp: WhatsappService
  ) {
    this.iniciarSesion();
  }
  // Rango de coordenadas para Perú (aproximado)
  private PERU_BOUNDS = {
    minLat: -18.0, // Latitud mínima de Perú
    maxLat: -0.1, // Latitud máxima de Perú
    minLong: -81.4, // Longitud mínima de Perú
    maxLong: -68.5, // Longitud máxima de Perú
  };

  armaBitacora(bitacora: Bitacora) {
    let brigadas: string = this.brigadas(bitacora.brigadas);
    let atencion: string = this.atenciones(bitacora.atenciones);
    let herramientas: string = this.herramientas(bitacora.herramientas);

    let detallebitacora: string;

    let causas: string = '';

    if (bitacora.estado === '0') {
      causas = `
*Causa:* ${bitacora.causa_averia.nombre}; 
*Consecuencia:* ${bitacora.consecuencia_averia.nombre}; 
*Tipo de Reparación:* ${bitacora.tipo_reparacion.nombre}; 
*Tiempo de solución:* ${bitacora.tiempo_solucion || ''};
 
*Material Utilizado:* 
${herramientas}
`;
    }
    const fechaFormateada = bitacora.fecha_inicial
      ? new Date(bitacora.fecha_inicial).toISOString().split('T')[0]
      : '';

    detallebitacora = `#${
      bitacora.correlativo ? bitacora.correlativo + '_' : ''
    }*${
      bitacora.nombre +
      (bitacora.enlace_plano_site ? '-' + bitacora.enlace_plano_site : '')
    }* 
_FechaInicial:_ ${fechaFormateada}
_NroSot:_ ${bitacora.sot || ''} 
_NroIncidencia:_ ${bitacora.incidencia || ''} 
_NroTAS:_ ${bitacora.nro_tas || ''} 
_NroCRQ:_ ${bitacora.nro_crq || ''} 
_TipoAveria:_ ${bitacora.tipo_averia.nombre || ''} 
_TipoSitePop:_ ${bitacora.site.tipo_site?.nombre || ''} 
_NombreSite:_ *${bitacora.site.nombre || ''}* 
_NombreCliente:_ *${bitacora.cliente || ''}* 
_Lat:_ ${bitacora.latitud || ''}, _Lon:_ ${bitacora.longitud || ''} 
_Distancia:_ ${bitacora.distancia || ''} Kms 
_Region:_ ${bitacora.site.region || ''} 
_Departamento:_ ${bitacora.site.departamento?.nombre || ''} 
_Distrito:_ ${bitacora.site.distrito?.nombre || ''} 
_red1:_ ${bitacora.red.nombre || ''}, ${brigadas}
_Responsable Cicsa:_ ${bitacora.resp_cicsa.nombres || ''} -T: ${
      bitacora.resp_cicsa.telefono || ''
    } 
_Responsable Claro:_ ${bitacora.resp_claro.nombres || ''} -T: ${
      bitacora.resp_claro.telefono || ''
    } 
${causas}
${atencion} `;
    return detallebitacora;
  }
  //*_serv1:_ ${bitacora.serv.nombre || ''}

  herramientas(herramientas: Herramienta[]) {
    var herramienta: string = '';
    if (herramientas.length > 0) {
      herramientas.forEach((elem: Herramienta) => {
        herramienta += ` - ${Number(elem.cantidad)} ${elem.nombre}\n`;
      });
    } else {
      herramienta = ` - Sin Materiales \n`;
    }

    return herramienta;
  }

  atenciones(atencion: Atencion[]) {
    var atenciones: string = '';

    atencion.forEach((element: Atencion) => {
      element.bitacora_atencion.forEach((item: Atencion) => {
        // Formatear item.hora utilizando DatePipe
        const formattedHora = this.datePipe.transform(item.hora, 'HH:mm');

        if (item.is_coment == '0') {
          atenciones += ` *${formattedHora}* ${item.descripcion} \n`;
        } else {
          atenciones += `   *-* ${item.descripcion} \n`;
        }
      });
      const formattedElementHora = this.datePipe.transform(
        element.hora,
        'HH:mm'
      );
      atenciones += ` *${formattedElementHora} (${element.atencion.orden
        .toString()
        .padStart(2, '0')}) ${element.atencion.descripcion}*, ${
        element.descripcion
      } \n`;
    });
    return atenciones;
  }

  brigadas(brigada: Cuadrilla[]) {
    let brigadas: string = '';
    let count = 1;

    brigada.forEach((element: Cuadrilla) => {
      element.user_movil.forEach((item: UsuarioMovil) => {
        if (Number(item.is_lider) === 1) {
          brigadas += `
_Bri${count}:_ ${element.zona.nombre}: ${item.user.nombre} - Placa: ${
            item.unidad_movil?.placa || ''
          } Cel: ${item.user.celular || ''}`;
          count++;
        }
      });
    });

    return brigadas;
  }

  obtenerCuadrante(hora: string): string {
    const [h, m] = hora.split(':').map(Number);
    const minutos = h * 60 + m;

    if (minutos >= 7 * 60 && minutos <= 12 * 60 + 59) {
      return 'Mañana';
    } else if (minutos >= 13 * 60 && minutos <= 18 * 60 + 59) {
      return 'Tarde';
    } else if (minutos >= 19 * 60 && minutos <= 23 * 60 + 59) {
      return 'Noche';
    } else {
      return 'Madrugada';
    }
  }

  TotalDemoras(sla: CalcularTiempo[]) {
    let totalDemoras = 0;
    for (let index = 0; index < sla.length; index++) {
      const item = sla[index];
      const fechaFin = new Date(item.fecha_fin).valueOf();
      const fechaInicio = new Date(item.fecha_inicio).valueOf();
      const diferencia = fechaFin - fechaInicio;
      totalDemoras += diferencia;
    }
    const horas = Math.floor(totalDemoras / 1000 / 60 / 60); //saca las horas sin decimales
    const minutos = totalDemoras / 1000 / 60 - horas * 60;
    return (
      horas.toString().padStart(2, '0') +
      ':' +
      minutos.toString().padStart(2, '0')
    );
  }

  // Validar coordenada (latitud o longitud)
  isValidCoordinate(coordinate: number): boolean {
    return !isNaN(coordinate) && coordinate !== null;
  }

  // Validar si las coordenadas están dentro del territorio de Perú
  validateLatLong(lat: number, lon: number): boolean {
    const minLat = -18.35;
    const maxLat = 0.0;
    const minLon = -81.35;
    const maxLon = -68.65;

    return lat >= minLat && lat <= maxLat && lon >= minLon && lon <= maxLon;
  }

  // Función para validar latitud y longitud
  validateCoordinates(formGroup: FormGroup): { [key: string]: boolean } | null {
    const lat = formGroup.get('latitud')?.value;
    const lon = formGroup.get('longitud')?.value;

    // Si ambos campos latitud y longitud están vacíos (null o vacío), no validamos
    if ((lat === null || lat === '') && (lon === null || lon === '')) {
      return null; // No validamos si ambos son nulos o vacíos
    }

    // Si uno de los campos tiene valor y el otro no, es inválido
    if (
      (lat && (lon === null || lon === '')) ||
      (lon && (lat === null || lat === ''))
    ) {
      return { missingCoordinate: true }; // Error si solo uno tiene valor
    }

    // Validar latitud si tiene un valor
    if (lat && !this.isValidCoordinate(lat)) {
      return { invalidLatitude: true }; // Error si la latitud no es válida
    }

    // Validar longitud si tiene un valor
    if (lon && !this.isValidCoordinate(lon)) {
      return { invalidLongitude: true }; // Error si la longitud no es válida
    }

    // Validar si la latitud y longitud están dentro del territorio de Perú, si ambos tienen valores
    if (lat && lon && !this.validateLatLong(lat, lon)) {
      return { outOfPeru: true }; // Error si las coordenadas están fuera de Perú
    }

    return null; // Si todo está bien, el formulario es válido
  }

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  isMobile(): boolean {
    const userAgent = navigator.userAgent.toLowerCase();
    // Lista básica de dispositivos móviles
    const mobileDevices = [
      'android',
      'iphone',
      'ipad',
      'ipod',
      'blackberry',
      'windows phone',
      'opera mini',
      'mobile',
    ];
    return mobileDevices.some((device) => userAgent.includes(device));
  }

  private iniciarSesion(): void {
    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : null;
    if (user && user.name) {
      this.sessionId = user.whatsapp;
    }

    this.whatsapp.iniciarSesion(this.sessionId).subscribe({
      next: (data) => {
        console.log('QR recibido:', data.qr);
        this.qrSubject.next(data.qr);
        this.verificarEstado();
      },
      error: () => {
        this.estadoSubject.next('error');
        this.qrSubject.next('');
      },
    });
  }

  private verificarEstado(): void {
    if (this.pollingSub) this.pollingSub.unsubscribe();

    this.pollingSub = interval(3000).subscribe(() => {
      this.whatsapp.obtenerEstado(this.sessionId).subscribe({
        next: (res) => {
          if (res.ready) {
            this.estadoSubject.next('conectado');
            this.qrSubject.next('');
            this.pollingSub?.unsubscribe();
          } else {
            this.estadoSubject.next('esperando_qr');
          }
        },
        error: () => {
          this.estadoSubject.next('error');
          this.qrSubject.next('');
        },
      });
    });
  }

  enviarMensajeAGrupos(session: string, grupos: string[], id: number): void {
    var msgBitacora: string = '';
    this.bitacoraService.read(id).subscribe((resp: Bitacora) => {
      //this.bitacora_selected = resp.bitacora.data;
      msgBitacora = this.armaBitacora(resp);

      this.whatsapp
        .enviarMensajeAGrupos(session, grupos, msgBitacora)
        .subscribe({
          next: (res) => this.snackBar('Mensaje enviado al grupo'),
          error: (err) => this.snackBar('Error al enviar'),
        });
    });
  }

  /*222222
  envioWhatsApp(id: number, grupo: string) {
    var msgBitacora: string = '';
    this.bitacoraService.read(id).subscribe((resp: Bitacora) => {
      //this.bitacora_selected = resp.bitacora.data;
      msgBitacora = this.armaBitacora(resp);

      this.whatsapp.enviarMensaje(grupo, msgBitacora).subscribe({
        next: () =>  this.snackBar('✅ Mensaje enviado al grupo'),
        error: (err) => {
          console.error('❌ Error al enviar:', err);
          //this.snackBar(err);
        },
      });
    });
  }

  private estadoSubject = new BehaviorSubject<string>('cargando');
  private qrSubject = new BehaviorSubject<string>('');

  estado$ = this.estadoSubject.asObservable();
  qrImagen$ = this.qrSubject.asObservable();

  private ultimoEstado = '';


  consultarEstado(): void {
    this.whatsapp.getEstado().subscribe({
      next: (data) => {
        const nuevoEstado = data.estado;

        // Mostrar alerta si cambia el estado
        if (nuevoEstado !== this.ultimoEstado) {
          this.mostrarAlerta(nuevoEstado);
          this.ultimoEstado = nuevoEstado;
        }

        this.estadoSubject.next(nuevoEstado);

        if (nuevoEstado === 'esperando_qr') {
          this.obtenerQR();
        } else {
          this.qrSubject.next('');
        }
      },
      error: () => {
        this.estadoSubject.next('error');
        this.qrSubject.next('');
        this.mostrarAlerta('error');
      }
    });
  }

  private obtenerQR(): void {
    this.whatsapp.getQrCode().subscribe({
      next: (data) => this.qrSubject.next(data.qr),
      error: () => this.qrSubject.next('')
    });
  }

reconectar(): void {
  this.whatsapp.reconectar().subscribe({
    next: () => {
      this.mostrarAlerta('reconectando');
      this.consultarEstado(); // Re-consulta estado tras reconexión
    },
    error: () => {
      this.mostrarAlerta('error_reconectar');
    }
  });
}

private mostrarAlerta(estado: string): void {
  const mensajes: Record<string, string> = {
    conectado: '✅ Bot conectado a WhatsApp',
    esperando_qr: '📱 Escanea el nuevo código QR',
    desconectado: '🔌 Bot desconectado de WhatsApp',
    error_autenticacion: '❌ Error de autenticación con WhatsApp',
    error: '❗ Error al consultar estado',
    reconectando: '🔁 Intentando reconectar al bot de WhatsApp...',
    error_reconectar: '🚫 No se pudo reconectar al bot'
  };

  const mensaje = mensajes[estado] || `Estado desconocido: ${estado}`;
  this.snackBar(mensaje); // Usa tu método preferido aquí
}
*/

  /*111111
  estado: string = '';
  qrImagen: string = '';
  cargando: boolean = true;

  consultarEstado() {
    this.whatsapp.getEstado().subscribe({
      next: (data) => {
        this.estado = data.estado;
        if (data.estado === 'esperando_qr') {
          this.obtenerQR();
        }
        this.cargando = false;
      },
      error: () => {
        this.estado = 'error';
        this.cargando = false;
      }
    });
  }

  obtenerQR() {
    this.whatsapp.getQrCode().subscribe({
      next: (data) => this.qrImagen = data.qr,
      error: () => this.qrImagen = ''
    });
  }*/
}
