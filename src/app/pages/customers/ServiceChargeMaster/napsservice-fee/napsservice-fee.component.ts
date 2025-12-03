import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-napsservice-fee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './napsservice-fee.component.html',
  styleUrl: './napsservice-fee.component.css'
})
export class NAPSserviceFeeComponent {

  selectedNapsType: string = "";

  @Output() fixedSelected = new EventEmitter();
  @Output() percentageSelected = new EventEmitter();

  onNapsChange() {
    if (this.selectedNapsType === "fixed") this.fixedSelected.emit();
    if (this.selectedNapsType === "percentage") this.percentageSelected.emit();
  }
}
