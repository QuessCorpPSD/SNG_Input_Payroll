import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-branchmaster-add',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './branchmaster-add.component.html',
  styleUrl: './branchmaster-add.component.css'
})
export class BranchmasterAddComponent {
  constructor(private dialogRef: MatDialogRef<BranchmasterAddComponent>) { }


  onClose(): void {
    this.dialogRef.close();
  }

}
