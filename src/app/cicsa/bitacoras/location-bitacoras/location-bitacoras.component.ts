import { Clipboard } from '@angular/cdk/clipboard';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Bitacora, Tipo } from '../../modelos';
import { BitacorasService } from '../../services/bitacoras.service';
import { ConfigService } from '../../services/config.service';
import { LocationService } from '../../services/location.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UtilitiesService } from '../../services/utilities.service';

@Component({
  selector: 'app-location-bitacoras',
  templateUrl: './location-bitacoras.component.html',
  styleUrls: ['./location-bitacoras.component.scss'],
})
export class LocationBitacorasComponent {

  bitacora: Bitacora;
  datosForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<LocationBitacorasComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { bitacora: Bitacora },
    private clipboard: Clipboard,
    private _snackBar: MatSnackBar,
    private bitacoraService: BitacorasService,
    private configService: ConfigService,
    private locationService: LocationService,
    private router: Router,
    private fb: FormBuilder,
    private utilities: UtilitiesService
  ) {
    this.bitacora = data.bitacora;

    this.datosForm = this.fb.group({
      latitud: [this.bitacora.latitud],
      longitud: [this.bitacora.longitud],
      distancia: [this.bitacora.distancia]
    },
    {
      validators: [
        this.utilities.validateCoordinates.bind(this.utilities)
      ]
    })
  }

  guardar() {

    const result = {
      ...this.bitacora,
      ...this.datosForm.value,
    };
    console.log(result);
    this.locationService.createLocationBitacora(result).subscribe((resp) => {
     
      if (resp.message == 403) {
        this.snackBar('Falta ingresar datos');
      } else {
        this.snackBar('Registro Exitoso');
        this.dialogRef.close();
        this.router.navigate(['/bitacoras/list-bitacora']);
      }
    });
  }

  snackBar(comentario: string) {
    this._snackBar.open(comentario, 'Cerrar', {
      horizontalPosition: 'right',
      verticalPosition: 'top',
      duration: 3000,
    });
  }

  getLocation() {
    this.bitacoraService.getPosition().then((pos) => {
      this.bitacora.latitud = pos.lat;
      this.bitacora.longitud = pos.lng;

       // Actualiza los valores del formulario con los nuevos datos de latitud y longitud
    this.datosForm.patchValue({
      latitud: this.bitacora.latitud,
      longitud: this.bitacora.longitud
    });
    });
  }
}
