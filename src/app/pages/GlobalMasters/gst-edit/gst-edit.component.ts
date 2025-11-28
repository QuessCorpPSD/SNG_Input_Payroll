import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-gst-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule,FormsModule],
  templateUrl: './gst-edit.component.html',
  styleUrl: './gst-edit.component.css'
})
export class GSTEditComponent {
   constructor(private dialogRef: MatDialogRef<GSTEditComponent>) { }
  
  
    onClose(): void {
      this.dialogRef.close();
    }
  
    cgstApplicable: boolean = false;
    sgstApplicable: boolean = false;
    utgstApplicable: boolean = false;
  
    cgstPercentage: number = 0;
    sgstPercentage: number = 0;
    utgstPercentage: number = 0;
    cessPercentage: number = 0;
  
    toggleField(type: string) {
      switch (type) {
        case 'cgst':
          if (!this.cgstApplicable) this.cgstPercentage = 0;
          break;
        case 'sgst':
          if (!this.sgstApplicable) this.sgstPercentage = 0;
          break;
        case 'utgst':
          if (!this.utgstApplicable) this.utgstPercentage = 0;
          break;
      }
    }

}
