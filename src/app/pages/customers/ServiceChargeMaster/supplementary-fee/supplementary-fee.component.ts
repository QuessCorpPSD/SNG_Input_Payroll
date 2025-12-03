import { CommonModule } from '@angular/common';
import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { AddServicefeeComponent } from '../add-servicefee/add-servicefee.component';

@Component({
  selector: 'app-supplementary-fee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './supplementary-fee.component.html',
  styleUrl: './supplementary-fee.component.css'
})
export class SupplementaryFeeComponent implements OnInit {

  @Output() fixedSelected = new EventEmitter();
  @Output() percentageSelected = new EventEmitter();

  supplementaryTypes: any[] = [];
  selectedSupplementary: any = "";

  constructor(private serviceChargeService: ServiceChargeService) {}

  ngOnInit(): void {
    this.loadSupplementaryTypes();
  }

  loadSupplementaryTypes() {

    const masterId = 2; // Supplementary Fee master ID

    this.serviceChargeService.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.supplementaryTypes = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        console.error("Failed to load supplementary fee types", err);
      }
    });
  }

  onSupplementaryChange() {

    switch (+this.selectedSupplementary) {

      case 1:  // Fixed
        this.fixedSelected.emit();
        break;

      case 2:  // Percentage
        this.percentageSelected.emit();
        break;
    }
  }
}

