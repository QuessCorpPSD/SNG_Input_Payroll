import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, OnInit, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';

@Component({
  selector: 'app-add-servicefee',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './add-servicefee.component.html',
  styleUrl: './add-servicefee.component.css'
})
export class AddServicefeeComponent implements OnInit {

  selectedService = "";

  // ✅ Output events to notify parent
  @Output() fixedSelected = new EventEmitter();
  @Output() percentageSelected = new EventEmitter();
  @Output() billSelected = new EventEmitter();
  @Output() slabSelected = new EventEmitter();

  // ✅ Store the API-driven service fee types
  serviceFeeTypes: any[] = [];

  constructor(
    private dialogRef: MatDialogRef<AddServicefeeComponent>,
    private dialog: MatDialog,
    private serviceChargeService: ServiceChargeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.loadServiceFeeTypes();
  }

  loadServiceFeeTypes() {
    const masterId = 1;

    this.serviceChargeService.GetServicechargetype(masterId).subscribe({
      next: (res: any) => {
        this.serviceFeeTypes = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        console.error("Failed to load service fee types", err);
        this.snackBar.open("Failed to load Service Fee types", "Close", { duration: 3000 });
      }
    });
  }

  onServiceFeeChange() {

    switch (+this.selectedService) {  // convert to number

      case 1:   // Fixed
        this.fixedSelected.emit();
        break;

      case 2:   // Percentage
        this.percentageSelected.emit();
        break;

      case 3:   // Bill To Rate
        this.billSelected.emit();
        break;

      case 4:   // Slab
        this.slabSelected.emit();
        break;

      case 5:   // Billable Report
        console.log("Billable Report selected");
        break;
    }
  }

}
