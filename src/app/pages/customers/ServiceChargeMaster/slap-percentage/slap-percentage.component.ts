import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { SlabPerCTCComponent } from '../slab-per-ctc/slab-per-ctc.component';
import { SlabPerHeadCountComponent } from '../slab-per-head-count/slab-per-head-count.component';

@Component({
  selector: 'app-slap-percentage',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    SlabPerCTCComponent,
    SlabPerHeadCountComponent
  ],
  templateUrl: './slap-percentage.component.html',
  styleUrl: './slap-percentage.component.css'
})
export class SlapPercentageComponent {

  selectedPercentage: string = "";

  showCtc = false;
  showHeadcount = false;

  onPercentageTypeChange() {
    this.showCtc = this.selectedPercentage === 'ctc';
    this.showHeadcount = this.selectedPercentage === 'headcount';
  }
}
