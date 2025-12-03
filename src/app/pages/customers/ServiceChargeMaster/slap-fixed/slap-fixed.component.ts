import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

import { SlabFixedCTCComponent } from '../slab-fixed-ctc/slab-fixed-ctc.component';
import { SlabFixHeadCountComponent } from '../slab-fix-head-count/slab-fix-head-count.component';

@Component({
  selector: 'app-slap-fixed',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule,
    SlabFixedCTCComponent,
    SlabFixHeadCountComponent
  ],
  templateUrl: './slap-fixed.component.html',
  styleUrl: './slap-fixed.component.css'
})
export class SlapFixedComponent {

  selectedFixed = "";

  showCTC = false;
  showHeadcount = false;

  onFixedTypeChange() {
    this.showCTC = this.selectedFixed === 'ctc';
    this.showHeadcount = this.selectedFixed === 'headcount';
  }
}
