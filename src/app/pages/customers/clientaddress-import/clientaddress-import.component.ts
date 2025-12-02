import { Component } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-clientaddress-import',
  standalone: true,
  imports: [MatIconModule, MatCardModule, CommonModule, FormsModule, ReactiveFormsModule,MatTooltipModule],
  templateUrl: './clientaddress-import.component.html',
  styleUrl: './clientaddress-import.component.css'
})
export class ClientaddressImportComponent {
  clientaddress!: FormGroup;

  constructor(private dialogRef: MatDialogRef<ClientaddressImportComponent>, private fb: FormBuilder) { }


  onClose() {
    this.dialogRef.close();
  }

}
