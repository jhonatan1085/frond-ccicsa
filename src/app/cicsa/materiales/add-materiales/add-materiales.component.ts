import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfigService } from '../../services/config.service';
import { CuadrillaService } from '../../services/cuadrilla.service';
import { UsuariosService } from '../../services/usuarios.service';
import {
  CategoriaWithSubs,
  Cuadrilla,
  CuadrillaCreate,
  CuadrillaUpdate,
  Material,
  MaterialCreate,
  SubCategoriaSimple,
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
import { MaterialService } from '../../services/material.service';
@Component({
  selector: 'app-add-materiales',
  templateUrl: './add-materiales.component.html',
  styleUrls: ['./add-materiales.component.scss'],
})
export class AddMaterialesComponent {
  MaterialForm!: FormGroup;
  material?: MaterialCreate;

  categorias: CategoriaWithSubs[] = [];
  subcategoriasFiltradas: SubCategoriaSimple[] = [];

  constructor(
    public dialogRef: MatDialogRef<AddMaterialesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { material?: MaterialCreate },
    private configService: ConfigService,
    private materialService: MaterialService,
    private usuarioService: UsuariosService,
    private _snackBar: MatSnackBar,
    private utilities: UtilitiesService,
    private fb: FormBuilder
  ) {
    this.material = data?.material;

    this.createForm();
    this.configService.materiales().subscribe((resp) => {
      this.categorias = resp.categorias;

      if (this.material) {
        // Si no viene directamente en la data, extrae la categoría desde la subcategoría
        if (
          !this.material.categoria_id &&
          this.material.sub_categoria?.categoria?.id
        ) {
          this.material.sub_categoria_id = this.material.sub_categoria.id;
          this.material.categoria_id = this.material.sub_categoria.categoria.id;
        }
        if (this.material.categoria_id !== undefined) {
          // Filtra subcategorías si viene ya seleccionado
          this.actualizarSubcategorias(this.material.categoria_id);
        }


          this.MaterialForm.patchValue({
            id: this.material.id,
            codigo: this.material.codigo,
            codigoSAP: this.material.codigoSAP,
            nombre: this.material.nombre,
            descripcion: this.material.descripcion,
            codigoAX: this.material.codigoAX,
            categoria_id: this.material.categoria_id,
            sub_categoria_id: this.material.sub_categoria_id,
            precio: this.material.precio,
            unidad_medida: this.material.unidad_medida,
            stock_minimo: this.material.stock_minimo,
          });
        this.MaterialForm.get('codigo')?.disable(); // Bloquea el campo código si estás editando
      }
    });
  }

  ngOnInit(): void {
    this.MaterialForm.get('categoria_id')?.valueChanges.subscribe(
      (categoriaId) => {
        this.actualizarSubcategorias(categoriaId);
        this.MaterialForm.get('sub_categoria_id')?.reset(); // limpia la subcategoría
      }
    );
  }

  createForm(): void {
    this.MaterialForm = this.fb.group({
      id: [null], // opcional para editar
      codigo: ['', Validators.required],
      codigoSAP: [''],
      nombre: ['', Validators.required],
      descripcion: [''],
      codigoAX: [''],
      categoria_id: [null, Validators.required],
      sub_categoria_id: [null, Validators.required],
      precio: [0, [Validators.required, Validators.min(0.1)]],
      unidad_medida: ['', Validators.required],
      stock_minimo: [0, [Validators.required, Validators.min(0.1)]],
    });
  }
  saveMaterial() {
    if (this.material?.id) {
console.log(this.material?.id,this.MaterialForm.getRawValue())

      this.materialService
        .update(this.material?.id, this.MaterialForm.getRawValue()) //getRawValue() para casos que estan bloqueados
        .subscribe({
          next: () => {
            this.utilities.snackBar('Material Actualizado');
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
      return;
    }
    this.materialService.create(this.MaterialForm.value).subscribe({
      next: () => {
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

  actualizarSubcategorias(categoriaId: number): void {
    const categoria = this.categorias.find((cat) => cat.id === categoriaId);
    this.subcategoriasFiltradas = categoria ? categoria.subcategorias : [];
  }
}
