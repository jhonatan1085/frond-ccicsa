import { Injectable } from '@angular/core';
import { Atencion, Bitacora, CalcularTiempo, Cuadrilla, DemoraBitacora, DemoraBitacoraExtended, UsuarioMovil } from '../modelos';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'

})

export class TimeUtilsService {

  constructor() { }

  calcularDiferenciaTiempo(hora_inicio: string, hora_fin: string) {
    const fechaFin = new Date(hora_fin).valueOf();
    const fechaInicio = new Date(hora_inicio).valueOf();
    const diferencia = fechaFin - fechaInicio;
   
    return diferencia //this.convierteHoras(diferencia)
  }


  convierteHoras(diferencia: any) {
    const horas = Math.floor(diferencia / 1000 / 60 / 60); //saca las horas sin decimales
    const minutos = diferencia / 1000 / 60 - horas * 60;
    return horas.toString().padStart(2, "0") + ":" + minutos.toString().padStart(2, "0");
  }


  updateTotalDemoras(demorasBitacora: DemoraBitacoraExtended[]) {
    let totalDemoras = 0;
    for (let index = 0; index < demorasBitacora.length; index++) {
      const item = demorasBitacora[index];
      const fechaFin = new Date(item.fecha_fin).valueOf();
      const fechaInicio = new Date(item.fecha_inicio).valueOf();
      const diferencia = fechaFin - fechaInicio;
      totalDemoras += diferencia;
    }

    return totalDemoras;
  }

  TotalSla(sla: CalcularTiempo[]) {
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

  getLocalDateTime(): string {
    const now = new Date();

    // Obtén los componentes locales de la fecha
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0');
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    // Devuelve en formato compatible con datetime-local
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  fechaEjecucionMayorValidator(fechaInicialKey: string, fechaEjecucionKey: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const fechaInicial = formGroup.get(fechaInicialKey)?.value;
      const fechaEjecucion = formGroup.get(fechaEjecucionKey)?.value;

      if (fechaInicial && fechaEjecucion && fechaEjecucion < fechaInicial) {
        return { fechaEjecucionMenor: true }; // Error si fecha_ejecucion es menor
      }
      return null; // Sin errores
    };
  }

}
