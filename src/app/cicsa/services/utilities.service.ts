import { Injectable } from '@angular/core';
import { DatePipe } from '@angular/common'; // Importa DatePipe
import { Atencion, Bitacora, CalcularTiempo, Cuadrilla, UsuarioMovil } from '../modelos';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
@Injectable({
  providedIn: 'root',

})
export class UtilitiesService {

  constructor(
    private datePipe: DatePipe,
    private _snackBar: MatSnackBar,
  ) {

  }
  // Rango de coordenadas para Perú (aproximado)
  private PERU_BOUNDS = {
    minLat: -18.0, // Latitud mínima de Perú
    maxLat: -0.1,  // Latitud máxima de Perú
    minLong: -81.4, // Longitud mínima de Perú
    maxLong: -68.5, // Longitud máxima de Perú
  }
  armaBitacora(bitacora: Bitacora) {

    let brigadas: string = this.brigadas(bitacora.brigadas);
    let atencion: string = this.atenciones(bitacora.atenciones);

    let detallebitacora: string;

    let causas: string = "";

    if (bitacora.estado === '0') {
      causas = `
*Causa:* ${bitacora.causa_averia.nombre}; 
*Consecuencia:* ${bitacora.consecuencia_averia.nombre}; 
*Tipo de Reparación:* ${bitacora.tipo_reparacion.nombre}; 
*Tiempo de solución:* ${bitacora.tiempo_solucion || ''}; 
*Material Utilizado:* 
${bitacora.herramientas || '- Sin materiales'}
`;
    }

    detallebitacora = `#*${bitacora.nombre} - ${bitacora.enlace_plano_site}* 
_FechaInicial:_ ${bitacora.fecha_inicial || ''} 
_NroSot:_ ${bitacora.sot || ''} 
_NroIncidencia:_ ${bitacora.incidencia || ''} 
_TipoAveria:_ ${bitacora.tipo_averia.nombre || ''} 
_TipoSitePop:_ ${bitacora.site.tipo_site?.nombre || ''} 
_NombreSite:_ *${bitacora.site.nombre || ''}* 
_NombreCliente:_ *${bitacora.cliente || ''}* 
_Lat:_ ${bitacora.latitud || ''}, _Lon:_ ${bitacora.longitud || ''} 
_Distancia:_ ${bitacora.distancia || ''} Kms 
_Region:_ ${bitacora.site.region || ''} 
_Departamento:_ ${bitacora.site.departamento?.nombre || ''} 
_Distrito:_ ${bitacora.site.distrito?.nombre || ''} 
_red1:_ ${bitacora.red.nombre || ''} , ${brigadas}
_Responsable Cicsa:_ ${bitacora.resp_cicsa.nombres || ''} -T: ${bitacora.resp_cicsa.telefono || ''} 
_Responsable Claro:_ ${bitacora.resp_claro.nombres || ''} -T: ${bitacora.resp_claro.telefono || ''} 
${causas}
${atencion} `;
    return detallebitacora
  }
  //*_serv1:_ ${bitacora.serv.nombre || ''} 

  atenciones(atencion: Atencion[]) {
    var atenciones: string = "";

    atencion.forEach((element: Atencion) => {
      element.bitacora_atencion.forEach((item: Atencion) => {

        // Formatear item.hora utilizando DatePipe
        const formattedHora = this.datePipe.transform(item.hora, 'HH:mm');

        if (item.is_coment == '0') {
          atenciones += ` *${formattedHora} * ${item.descripcion} \n`;
        } else {
          atenciones += `   *-* ${item.descripcion} \n`;
        }
      });
      const formattedElementHora = this.datePipe.transform(element.hora, 'HH:mm');
      atenciones += ` *${formattedElementHora} (${element.atencion.orden}) ${element.atencion.descripcion}*, ${element.descripcion} \n`;
    });
    return atenciones
  }


  brigadas(brigada: Cuadrilla[]) {

    let brigadas: string = "";
    let count = 1;

    brigada.forEach((element: Cuadrilla) => {
      element.user_movil.forEach((item: UsuarioMovil) => {
        if (item.is_lider === '1') {
          brigadas += `
_Bri${count}:_ ${element.zona.nombre}: ${item.user.nombre} - Placa: ${item.unidad_movil?.placa || ''} Cel: ${item.user.celular || ''}`;
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
    return horas.toString().padStart(2, "0") + ":" + minutos.toString().padStart(2, "0");
  }


  // Validar coordenada (latitud o longitud)
  isValidCoordinate(coordinate: number): boolean {
    return !isNaN(coordinate) && coordinate !== null;
  }

  // Validar si las coordenadas están dentro del territorio de Perú
  validateLatLong(lat: number, lon: number): boolean {
    const minLat = -18.0;
    const maxLat = -0.1;
    const minLon = -81.0;
    const maxLon = -68.0;

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
    if ((lat && (lon === null || lon === '')) || (lon && (lat === null || lat === ''))) {
      return { missingCoordinate: true };  // Error si solo uno tiene valor
    }

    // Validar latitud si tiene un valor
    if (lat && !this.isValidCoordinate(lat)) {
      return { invalidLatitude: true };  // Error si la latitud no es válida
    }

    // Validar longitud si tiene un valor
    if (lon && !this.isValidCoordinate(lon)) {
      return { invalidLongitude: true };  // Error si la longitud no es válida
    }

    // Validar si la latitud y longitud están dentro del territorio de Perú, si ambos tienen valores
    if (lat && lon && !this.validateLatLong(lat, lon)) {
      return { outOfPeru: true };  // Error si las coordenadas están fuera de Perú
    }

    return null;  // Si todo está bien, el formulario es válido
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
      'android', 'iphone', 'ipad', 'ipod', 'blackberry', 
      'windows phone', 'opera mini', 'mobile'
    ];
    return mobileDevices.some(device => userAgent.includes(device));
  }


}
