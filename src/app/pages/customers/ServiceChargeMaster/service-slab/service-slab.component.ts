import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { SlabPerCTCComponent } from '../slab-per-ctc/slab-per-ctc.component';
import { SlabFixHeadCountComponent } from '../slab-fix-head-count/slab-fix-head-count.component';
import { SlabFixedCTCComponent } from '../slab-fixed-ctc/slab-fixed-ctc.component';
import { SlabPerHeadCountComponent } from '../slab-per-head-count/slab-per-head-count.component';

@Component({
  selector: 'app-service-slab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,

    SlabPerCTCComponent,
    SlabFixHeadCountComponent,
    SlabFixedCTCComponent,
    SlabPerHeadCountComponent
  ],
  templateUrl: './service-slab.component.html',
  styleUrl: './service-slab.component.css'
})
export class ServiceSlabComponent {

  selectedSlab = "";                // fixed | percentage
  selectedFixedType = "";           // ctc | headcount
  selectedPercentageType = "";      // ctc | headcount

  // Called when "Slab" dropdown changes
  openSlabSection() {
    // Reset inner dropdowns
    this.selectedFixedType = "";
    this.selectedPercentageType = "";
  }
}
