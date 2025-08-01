import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import {
  Brigada,
  Cuadrilla,
  Existencias,
  Material,
  MovimientoMaterial,
} from '../../modelos';
import { ExixtenciaService } from '../../services/exixtencia.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtilitiesService } from '../../services/utilities.service';
import { PageEvent } from '@angular/material/paginator';
import { AddMaterialesComponent } from '../add-materiales/add-materiales.component';
import { MaterialService } from '../../services/material.service';
import { CuadrillaService } from '../../services/cuadrilla.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { map, Observable, startWith } from 'rxjs';
import { ConfirmDialogComponent } from 'src/app/shared/dialog/confirm-dialog/confirm-dialog.component';
import { MovimientoService } from '../../services/movimiento.service';

@Component({
  selector: 'app-asignar-materiales',
  templateUrl: './asignar-materiales.component.html',
  styleUrls: ['./asignar-materiales.component.scss'],
})
export class AsignarMaterialesComponent {
  materialCtrl = new FormControl('');
  materiales: Material[] = [];

  materialesFiltrados$!: Observable<Material[]>;
  materialSeleccionado: Material | null = null;
  cantidad: number = 1;
  brigadaSeleccionada?: Cuadrilla;
  brigadas: Cuadrilla[] = [];
  brigadaId: number = 0;

  materialesAgregados: MovimientoMaterial[] = [];

  asignacionForm!: FormGroup;
  //materialesArray!: FormArray;
  get materialesArray(): FormArray {
    return this.asignacionForm.get('materiales') as FormArray;
  }

  cantidadCtrl = new FormControl(1, [Validators.required, Validators.min(1)]);

  modoCargaControl = new FormControl<'manual' | 'excel'>('manual');

  get modoCargaManual(): boolean {
    return this.modoCargaControl.value === 'manual';
  }

  archivoSeleccionado: File | null = null;
  isDragging = false;
  isLoading = false;
  progressValue = 0;

  constructor(
    public dialogRef: MatDialogRef<AsignarMaterialesComponent>,
    private movimientoService: MovimientoService,
    private dialog: MatDialog,
    private utilities: UtilitiesService,
    private materialService: MaterialService,
    private cuadrillaService: CuadrillaService,
    private fb: FormBuilder
  ) {
    this.createForm();
  }

  createForm(): void {
    this.asignacionForm = this.fb.group({
      brigada_id: [null, Validators.required],
      materiales: this.fb.array([], this.minFormArrayLength(1)),
    });
  }

  minFormArrayLength(min: number) {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const array = control as FormArray;
      return array && array.length >= min ? null : { minLengthArray: true };
    };
  }

  crearMaterialFormGroup(material: Material, cantidad: number): FormGroup {
    return this.fb.group({
      material: [material],
      material_id: [material.id],
      codigo: [material.codigo],
      nombre: [material.nombre],
      unidad_medida: [material.unidad_medida],
      stock_actual: [material.stock_actual],
      cantidad: [cantidad, [Validators.required, Validators.min(1)]],
      brigada_id: [this.brigadaId],
    });
  }
  
  onBrigadaChange() {
    const id = this.asignacionForm.get('brigada_id')?.value;
    this.brigadaId = id;
  }
  getCantidadControl(grupo: AbstractControl): FormControl {
    return grupo.get('cantidad') as FormControl;
  }

  formInvalido(): boolean {
    return (
      this.asignacionForm.invalid || // brigada no seleccionada, etc.
      this.tieneErroresEnMateriales() // alguna cantidad inválida
    );
  }

  tieneErroresEnMateriales(): boolean {
    return this.materialesArray.controls.some(
      (ctrl) => ctrl.get('cantidad')?.invalid
    );
  }

  ngOnInit() {
    this.cuadrillaService.activa().subscribe((resp) => {
      this.brigadas = resp.data;

      if (this.brigadas.length > 0) {
        this.brigadaSeleccionada = this.brigadas[0];
        this.brigadaId = Number(this.brigadaSeleccionada.id);
        // Asignamos el valor al form
        this.asignacionForm.patchValue({ brigada_id: this.brigadaId });
      }
    });
    this.getMateriales();
  }

  private getMateriales() {
    this.materialService.autocomplete().subscribe((resp) => {
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

  agregarMaterial() {
    if (!this.materialSeleccionado) return;

    const id = this.materialSeleccionado.id;
    const cantidad = Number(this.cantidadCtrl.value);
    if (cantidad <= 0) {
      this.utilities.snackBar('Cantidad inválida.');
      return;
    }

    // Revisar si ya existe
    const index = this.materialesArray.controls.findIndex(
      (ctrl) => ctrl.value.material_id === id
    );

    if (index !== -1) {
      const grupo = this.materialesArray.at(index);
      const cantidadActual = grupo.get('cantidad')?.value || 0;
      const cantidadTotal = cantidadActual + cantidad;

      grupo.patchValue({ cantidad: cantidadTotal });
    } else {
      const nuevoGrupo = this.crearMaterialFormGroup(
        this.materialSeleccionado,
        cantidad
      );
      this.materialesArray.push(nuevoGrupo);
    }

    this.resetCampos();
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

  eliminarMaterial(index: number) {
    this.materialesArray.removeAt(index);
  }

  saveMaterial() {
    if (this.formInvalido()) {
      this.asignacionForm.markAllAsTouched();
      this.utilities.snackBar('Completa los datos antes de guardar.');
      return;
    }

    const payload = this.materialesArray.value.map((m: any) => ({
      material_id: m.material_id,
      cantidad: m.cantidad,
      brigada_id: m.brigada_id,
    }));

    console.log(payload);
    this.movimientoService.cargaMaterialesBrigada(payload).subscribe({
      next: (resp) => {
        console.log(resp);
        this.utilities.snackBar('Material registrada');
        this.dialogRef.close();
        //this.refresh();
      },
      error: (err) => {
        if (err.error?.errors) {
          const errores = err.error.errors;
          const mensajes = Object.values(errores).flat() as string[];
          mensajes.forEach((msg: string) => this.utilities.snackBar(msg));
        } else {
          this.utilities.snackBar('Error desconocido al registrar');
        }

        console.error(err);
      },
    });
  }

  mostrarNombreMaterial(material: any): string {
    return material?.nombre ?? '';
  }

  resetCampos() {
    this.materialCtrl.setValue('');
    this.materialSeleccionado = null;
    this.cantidadCtrl.setValue(1);
  }

  seleccionarMaterial(material: Material) {
    this.materialSeleccionado = { ...material };
    this.cantidadCtrl.setValue(1); // o en blanco
  }

  //para cargar archivo excel
  onArchivoSeleccionado(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  cargarDesdeExcel() {
    if (!this.archivoSeleccionado) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const datos = XLSX.utils.sheet_to_json(hoja);

      datos.forEach((row: any) => {
        const material = this.materiales.find((m) => m.codigo === row.codigo);
        if (material) {
          this.materialSeleccionado = material;
          this.cantidad = Number(row.cantidad);
          this.agregarMaterial();
        }
      });

      this.archivoSeleccionado = null;
    };

    reader.readAsArrayBuffer(this.archivoSeleccionado);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    this.isDragging = false;
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.archivoSeleccionado = file;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.archivoSeleccionado = file;
      event.target.value = ''; // Esto permite seleccionar el mismo archivo nuevamente
    }
  }

  procesarArchivo(file: File) {
    if (!file) return;

    this.isLoading = true;
    this.progressValue = 0;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const hoja = workbook.Sheets[workbook.SheetNames[0]];
      const datos: any[] = XLSX.utils.sheet_to_json(hoja);

      const errores: string[] = [];
      const filasValidas: { material: Material; cantidad: number }[] = [];

      if (datos.length === 0) {
        this.utilities.snackBar('El archivo está vacío.');
        this.resetCarga();
        return;
      }

      datos.forEach((row: any, index: number) => {
        const fila = index + 2; // Fila 2 considerando encabezado

        // Validar estructura
        if (!('codigo' in row) || !('cantidad' in row)) {
          errores.push(`Fila ${fila}: Falta columna "codigo" o "cantidad".`);
          return;
        }

        const cantidad = Number(row.cantidad);
        if (isNaN(cantidad) || cantidad <= 0) {
          errores.push(`Fila ${fila}: Cantidad inválida (${row.cantidad}).`);
          return;
        }

        const material = this.materiales.find((m) => m.codigo === row.codigo);
        if (!material) {
          errores.push(`Fila ${fila}: Código no encontrado (${row.codigo}).`);
          return;
        }

        filasValidas.push({ material, cantidad });
      });

      // Procesar válidos
      let procesados = 0;
      filasValidas.forEach((item) => {
        this.materialSeleccionado = item.material;
        this.cantidadCtrl.setValue(item.cantidad);
        this.agregarMaterial();
        procesados++;
        this.progressValue = Math.round(
          (procesados / filasValidas.length) * 100
        );
      });

      if (errores.length > 0) {
        const mensaje = errores.join('\n');
        this.utilities.snackBar(`Errores en el archivo:\n${mensaje}`);
      } else {
        this.utilities.snackBar('Archivo procesado correctamente.');
      }

      this.resetCarga();
    };

    reader.readAsArrayBuffer(file);
  }
  resetCarga() {
    this.archivoSeleccionado = null;
    this.isLoading = false;
    this.progressValue = 0;
  }
}
