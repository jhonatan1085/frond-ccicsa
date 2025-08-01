import { Component, Inject } from '@angular/core';
import { MaterialService } from '../../services/material.service';
import {
  Brigada,
  Cuadrilla,
  Material,
  MovimientoMaterial,
} from '../../modelos';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { filter, map, startWith, switchMap } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../../shared/dialog/confirm-dialog/confirm-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UtilitiesService } from '../../services/utilities.service';
import { ActivatedRoute } from '@angular/router';
import { MovimientoService } from '../../services/movimiento.service';
import { UserAuth } from 'src/app/shared/models/models';
import { AuthService } from 'src/app/shared/auth/auth.service';
import { BitacorasService } from '../../services/bitacoras.service';

@Component({
  selector: 'app-add-materiales',
  templateUrl: './add-materiales.component.html',
  styleUrls: ['./add-materiales.component.scss'],
})
export class AddMaterialesComponent {
  materialCtrl = new FormControl('');
  materiales: Material[] = [];

  materialesFiltrados$!: Observable<Material[]>;
  materialSeleccionado: Material | null = null;
  cantidad: number = 1;
  brigadaId: number = 0; // cambiar según tu lógica
  unidadMedida = '';
  stock = 0;

  public bitacora_id = 0;

  materialesAgregados: MovimientoMaterial[] = [];
  materialesRegistradosBD: MovimientoMaterial[] = [];

  public user?: UserAuth;

  brigadas: Brigada[] = [];
  brigadaSeleccionadaId: number | null = null;
  isTecnico: boolean = false;
  brigadaSeleccionada?: Brigada;

  constructor(
    public auth: AuthService,
    private materialService: MaterialService,
    private dialog: MatDialog,
    private utilities: UtilitiesService,
    public activeRoute: ActivatedRoute,
    public movimientoService: MovimientoService,
    public bitacoraService: BitacorasService
  ) {}

  ngOnInit(): void {
    this.user = this.auth.user;

    this.isTecnico = this.user?.roles.includes('Tecnico') ?? false;

    this.activeRoute.params.subscribe((resp) => {
      this.bitacora_id = resp['bitacora'];
    });

    if (this.isTecnico && this.user?.brigada) {
      this.brigadaId = this.user?.brigada?.brigada_id;

      this.listaMateriales(this.bitacora_id, this.brigadaId);

      this.getMateriales();
    } else {
      this.bitacoraService
        .getBrigadasBitacora(this.bitacora_id)
        .subscribe((resp) => {
          this.brigadas = resp.data;

          if (this.brigadas.length > 0) {
            this.brigadaSeleccionada = this.brigadas[0];

            this.brigadaId = Number(this.brigadaSeleccionada.id);

            this.listaMateriales(this.bitacora_id, Number(this.brigadaId));
            this.getMateriales();
          }
        });
    }

    this.materialCtrl.valueChanges.subscribe((valor) => {
      if (typeof valor === 'string') {
        // usuario escribió texto libre
        this.materialSeleccionado = null;
      }
    });
  }

  listaMateriales(bitacora_id: number, brigadaId: number) {
    this.materialService
      .listMaterialesBitacora(bitacora_id, brigadaId)
      .subscribe((resp) => {
        this.materialesAgregados = JSON.parse(JSON.stringify(resp.data));
        this.materialesRegistradosBD = JSON.parse(JSON.stringify(resp.data));
      });
  }

  onBrigadaChange() {
    if (this.brigadaSeleccionada) {
      this.brigadaId = Number(this.brigadaSeleccionada.id);

      this.listaMateriales(this.bitacora_id, this.brigadaId);
      this.getMateriales();
    }
  }

  private getMateriales() {
    this.materialService
      .autocomplete(this.brigadaId.toString())
      .subscribe((resp) => {
        this.setMateriales(resp.data);
      });
  }

  // Auth Complete
  setMateriales(materiales: Material[]) {
    this.materiales = materiales;

    this.materialesFiltrados$ = this.materialCtrl.valueChanges.pipe(
      startWith(''),
      map((valor) => this.filtrarMateriales(valor || ''))
    );
  }

  filtrarMateriales(valor: string | Material): Material[] {
    let texto = '';

    if (typeof valor === 'string') {
      texto = valor.toLowerCase();
    } else if (valor && typeof valor === 'object') {
      texto = valor.nombre.toLowerCase();
    }

    return this.materiales.filter((m) =>
      m.nombre.toLowerCase().includes(texto)
    );
  }

  /* seleccionarMaterial(material: Material) {
    this.materialSeleccionado = material;
  }


*/

  seleccionarMaterial(material: Material) {
    this.materialSeleccionado = { ...material };

    // Buscar si ya está en la tabla de materiales agregados
    const yaAgregado = this.materialesRegistradosBD.find(
      (m) => m.material.id === material.id
    );

    const cantidadAgregada = yaAgregado ? yaAgregado.cantidad : 0;

    // Mostrar el stock disponible como: stock_actual + ya agregado
    //this.materialSeleccionado.stock_actual += cantidadAgregada;
    this.materialSeleccionado.stock_actual =
      Number(this.materialSeleccionado.stock_actual) + Number(cantidadAgregada);
    this.cantidad = 1; // o en blanco
  }

  getStockDisponible(material: Material): number {
    const agregado = this.materialesAgregados.find(
      (m) => m.material.id === material.id
    );
    return material.stock_actual - (agregado?.cantidad || 0);
  }

  agregarMaterial() {
    if (!this.materialSeleccionado) return;
    const id = this.materialSeleccionado.id;
    const disponible = Number(this.materialSeleccionado.stock_actual);
    const cantidad = Number(this.cantidad);

    if (cantidad <= 0) {
      this.utilities.snackBar('La cantidad debe ser mayor que cero.');
      return;
    }

    if (disponible <= 0) {
      this.utilities.snackBar('Este material no tiene stock disponible.');
      return;
    }

    const index = this.materialesAgregados.findIndex(
      (item) => item.material.id === id
    );

    if (index !== -1) {
      const cantidadTotal =
        Number(this.materialesAgregados[index].cantidad) + cantidad;

      if (cantidadTotal > disponible) {
        this.utilities.snackBar(
          `La cantidad total supera el stock disponible (${disponible}).`
        );
        return;
      }

      // Acumula la cantidad
      this.materialesAgregados[index].cantidad = cantidadTotal;
    } else {
      if (cantidad > disponible) {
        this.utilities.snackBar(
          `No hay stock suficiente. Stock disponible: ${disponible}`
        );
        return;
      }

      this.materialesAgregados.push({
        material: this.materialSeleccionado,
        cantidad: cantidad,
        brigada_id: this.brigadaId,
      });
    }
    console.log(this.materialesAgregados);

    this.resetCampos();
  }

  mostrarNombreMaterial(material: any): string {
    return material?.nombre ?? '';
  }
  resetCampos() {
    this.materialCtrl.setValue('');
    this.materialSeleccionado = null;
    this.cantidad = 1;
  }

  eliminarMaterial(index: number) {
    this.materialesAgregados.splice(index, 1);
  }

  confirmarEliminacion(index: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { mensaje: '¿Estás seguro de eliminar este material?' },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.eliminarMaterial(index);
      }
    });
  }

  getTooltipMensaje(): string {
    if (!this.materialSeleccionado) {
      return 'Seleccione un material';
    }

    if (this.materialSeleccionado.stock_actual <= 0) {
      return 'Sin stock disponible';
    }

    if (!this.cantidad || this.cantidad <= 0) {
      return 'Ingrese una cantidad válida';
    }

    return 'Agregar material';
  }

  guardarMateriales() {
    if (!this.materialesAgregados.length || !this.bitacora_id) {
      this.utilities.snackBar('Faltan datos para guardar los materiales');
      return;
    }

    const payload = {
      bitacora_id: this.bitacora_id,
      materiales: this.materialesAgregados.map((m) => ({
        material_id: m.material.id,
        cantidad: m.cantidad,
        brigada_id: m.brigada_id, // asegúrate de tenerlo
      })),
    };

    console.log(payload);

    this.movimientoService.guardarMaterialesEnBitacora(payload).subscribe({
      next: (resp) => {
        this.utilities.snackBar(resp.message_text);
        this.getMateriales();
        // this.router.navigate(['/bitacoras/list-bitacora']);
      },
      error: (err) => {
        // Aquí capturas el mensaje 403 que viene del backend
        const mensaje =
          err.error?.message_text || 'Error al guardar los materiales';
        this.utilities.snackBar(mensaje);
      },
    });

    console.log(payload);
  }
}
