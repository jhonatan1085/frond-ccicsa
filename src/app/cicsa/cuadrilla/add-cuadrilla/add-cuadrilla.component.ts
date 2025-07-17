import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../services/config.service';
import { CuadrillaService } from '../../services/cuadrilla.service';
import { UsuariosService } from '../../services/usuarios.service';
import {
  Cuadrilla,
  CuadrillaCreate,
  CuadrillaUpdate,
  Tipo,
} from '../../modelos';
import { UtilitiesService } from '../../services/utilities.service';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  NumberValueAccessor,
  Validators,
} from '@angular/forms';
// declare const $: any;

@Component({
  selector: 'app-add-cuadrilla',
  templateUrl: './add-cuadrilla.component.html',
  styleUrls: ['./add-cuadrilla.component.scss'],
})
export class AddCuadrillaComponent {
  cuadrillaForm!: FormGroup;

  selectedTipobrigadas!: string;
  selectedContratistas!: string;
  selectedZona!: string;
  nombre!: string;
  tipobrigadas: any[] = [];
  contratistas: any[] = [];
  zonas: Tipo[] = [];
  users: any[] = [];

  text_success = '';
  text_validation = '';

  user_selecteds: any[] = [];

  cuadrilla?: Cuadrilla;
  constructor(
    public dialogRef: MatDialogRef<AddCuadrillaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { cuadrilla?: Cuadrilla },
    private cuadrillaService: CuadrillaService,
    private configService: ConfigService,
    private usuarioService: UsuariosService,
    private _snackBar: MatSnackBar,
    private utilities: UtilitiesService,
    private fb: FormBuilder
  ) {
    this.cuadrilla = data?.cuadrilla;
    this.createForm();
    this.configService.cuadrillas().subscribe((resp) => {
      this.tipobrigadas = resp.tipobrigadas;
      this.zonas = resp.zonas;
      this.contratistas = resp.contratistas;
    });
  }

  createForm(): void {
    this.cuadrillaForm = this.fb.group({
      tipo_brigada_id: [null, Validators.required],
      contratista_id: [null, Validators.required],
      nombre: [null, Validators.required],
      zona_id: [null, Validators.required],
      tecnicos: this.fb.array([]),
    });
  }

  ngOnInit() {
    // Si es edición
    if (this.cuadrilla) {
      this.cuadrillaForm.patchValue({
        tipo_brigada_id: this.cuadrilla.tipo_brigada?.id,
        contratista_id: this.cuadrilla.contratista?.id,
        nombre: this.cuadrilla.nombre,
        zona_id: this.cuadrilla.zona?.id,
      });

      const zonaId = this.cuadrilla.zona?.id;
      if (zonaId) {
        this.tecnicos(zonaId);
      }

      // Cargar técnicos existentes
      if (Array.isArray(this.cuadrilla.user_movil)) {
        this.cuadrilla.user_movil.forEach((item: any) => {
          const tecnico = this.fb.group({
            user_id: [item.user.id],
            movil_id: [item.unidad_movil ? item.unidad_movil.id : null],
            is_lider: [Number(item.is_lider)],
          });
          this.tecnicosFormArray.push(tecnico);
        });
      }
    }

    // Escuchar cambio de zona
    this.cuadrillaForm.get('zona_id')?.valueChanges.subscribe((zonaId) => {
      this.tecnicosFormArray.clear(); // Limpia los técnicos anteriores
      this.tecnicos(zonaId);
    });
  }

  tecnicos(zona_id: number) {
    this.user_selecteds = [];
    this.usuarioService.showUserZona(zona_id).subscribe((resp) => {
      console.log(resp);
      this.users = resp.data;
    });
  }

  get tecnicosFormArray(): FormArray {
    return this.cuadrillaForm.get('tecnicos') as FormArray;
  }

  addUser(user: any, islider = 0) {
    let id_movil = null;

    if (user.unidad_movil.length > 0) {
      user.unidad_movil.forEach((movil: any) => {
        id_movil = movil.id;
      });
    }

    const INDEX = this.tecnicosFormArray.controls.findIndex(
      (ctrl: AbstractControl) => ctrl.value.user_id === user.id
    );

    if (INDEX !== -1) {
      this.tecnicosFormArray.removeAt(INDEX);
    } else {
      const tecnico = this.fb.group({
        user_id: [user.id],
        movil_id: [id_movil],
        is_lider: [islider],
      });
      this.tecnicosFormArray.push(tecnico);
    }

    console.log(this.tecnicosFormArray.value);
  }

  addLider(user: any) {
    const liderIndex = this.tecnicosFormArray.controls.findIndex(
      (ctrl: AbstractControl) => ctrl.value.is_lider === 1
    );

    const userIndex = this.tecnicosFormArray.controls.findIndex(
      (ctrl: AbstractControl) => ctrl.value.user_id === user.id
    );

    if (liderIndex !== -1) {
      if (userIndex === liderIndex) {
        // Quitar el rol de líder al mismo usuario
        const data = this.tecnicosFormArray.at(userIndex).value;
        this.tecnicosFormArray.at(userIndex).patchValue({ is_lider: 0 });
      } else {
        console.log('No se puede agregar otro líder');
      }
    } else {
      if (userIndex !== -1) {
        this.tecnicosFormArray.at(userIndex).patchValue({ is_lider: 1 });
      } else {
        this.addUser(user, 1);
      }
    }

    console.log(this.tecnicosFormArray.value);
  }

  isCheck(user: any): boolean {
    return this.tecnicosFormArray.controls.some(
      (ctrl: AbstractControl) => ctrl.value.user_id === user.id
    );
  }

  isLiderCheck(user: any): boolean {
    const tecnico = this.tecnicosFormArray.value.find(
      (t: any) => t.user_id === user.id
    );
    return Number(tecnico?.is_lider) === 1;
  }

  isLiderDisable(user: any): boolean {
    const esLider = this.tecnicosFormArray.controls.find(
      (ctrl: AbstractControl) =>
        ctrl.value.user_id === user.id && Number(ctrl.value.is_lider) === 1
    );

    if (esLider) {
      return false; // Ya es líder, se puede dejar activo
    }

    const yaExisteOtroLider = this.tecnicosFormArray.controls.some(
      (ctrl: AbstractControl) => Number(ctrl.value.is_lider) === 1
    );

    return yaExisteOtroLider; // true => desactiva para los demás
  }

  saveCuadrilla() {
    const formValue = this.cuadrillaForm.value;
    const tecnicos = formValue.tecnicos;

    if (!tecnicos || tecnicos.length === 0) {
      this.utilities.snackBar('No seleccionó técnicos');
      return;
    }

    const tieneLider = tecnicos.some((t: any) => Number(t.is_lider) === 1);
    if (!tieneLider) {
      this.utilities.snackBar('No seleccionó líder');
      return;
    }

    if (this.cuadrilla?.id) {
      // ✏️ Solo actualizar técnicos
      const updateData: CuadrillaUpdate = { tecnicos };
      this.cuadrillaService
        .updateCuadrilla(this.cuadrilla.id, updateData)
        .subscribe({
          next: () => {
            this.utilities.snackBar('Técnicos actualizados');
            this.dialogRef.close();
            this.refresh();
          },
          error: (err) => {
            this.utilities.snackBar('Error al actualizar técnicos');
            console.error(err);
          },
        });
    } else {
      // 🆕 Crear nueva cuadrilla completa
      const createData: CuadrillaCreate = {
        zona_id: formValue.zona_id,
        tipo_brigada_id: formValue.tipo_brigada_id,
        contratista_id: formValue.contratista_id,
        nombre: formValue.nombre,
        tecnicos: tecnicos,
      };

      this.cuadrillaService.createCuadrilla(createData).subscribe({
        next: () => {
          this.utilities.snackBar('Cuadrilla registrada');
          this.dialogRef.close();
          this.refresh();
        },
        error: (err) => {
          this.utilities.snackBar('Error al crear cuadrilla');
          console.error(err);
        },
      });
    }
  }

  refresh() {
    this.configService.cuadrillas().subscribe((resp) => {
      this.tipobrigadas = resp.tipobrigadas;
      this.zonas = resp.zonas;
      this.contratistas = resp.contratistas;
    });
  }
}
