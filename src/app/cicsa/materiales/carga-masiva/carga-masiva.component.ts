import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
import { UtilitiesService } from '../../services/utilities.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialService } from '../../services/material.service';
import { MaterialCreate } from '../../modelos';
@Component({
  selector: 'app-carga-masiva',
  templateUrl: './carga-masiva.component.html',
  styleUrls: ['./carga-masiva.component.scss'],
})
export class CargaMasivaComponent {
  isDragging = false;
  selectedFile?: File | null = null;

  isLoading = false;
  progressValue = 0;

  constructor(
    public dialogRef: MatDialogRef<CargaMasivaComponent>,
    private materialService: MaterialService,
    private _snackBar: MatSnackBar,
    private utilities: UtilitiesService
  ) {}

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.selectedFile = event.dataTransfer.files[0];
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  procesarArchivoExcel() {
    if (!this.selectedFile) {
      alert('Primero debes seleccionar un archivo Excel');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet);

      this.subirMateriales(jsonData);
    };
    reader.readAsArrayBuffer(this.selectedFile);
  }

  subirMateriales(data: MaterialCreate[]) {
    this.isLoading = true;
    this.progressValue = 0;
    const interval = setInterval(() => {
      if (this.progressValue < 90) {
        this.progressValue += 10;
      }
    }, 200);

    this.materialService.cargaMasiva(data).subscribe({
      next: () => {
        clearInterval(interval);
        this.progressValue = 100;

        setTimeout(() => {
          this.utilities.snackBar('Carga Masiva Completada');
          this.dialogRef.close();
          this.isLoading = false;
          this.progressValue = 0;
        }, 300);
      },
      error: () => {
        clearInterval(interval);
        this.utilities.snackBar('Error al cargar materiales');
        this.isLoading = false;
        this.progressValue = 0;
      },
    });
  }
}
