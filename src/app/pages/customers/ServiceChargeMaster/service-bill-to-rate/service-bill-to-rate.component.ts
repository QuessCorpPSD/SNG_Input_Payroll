import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';

@Component({
  selector: 'app-service-bill-to-rate',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, ReactiveFormsModule, FormsModule],
  templateUrl: './service-bill-to-rate.component.html',
  styleUrl: './service-bill-to-rate.component.css'
})
export class ServiceBillToRateComponent {
  billRateForm!: FormGroup;
  showErrors = false;

  mapNameList: any[] = []; // For Map Name dropdown
  billingCategoryList: any[] = []; // For Billing Category dropdown

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ServiceBillToRateComponent>,
    private dialog: MatDialog,
    private serviceChargeService: ServiceChargeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,

  ) { }
  ngOnInit(): void {
    this.billRateForm = this.fb.group({
      billingCategory: ['', Validators.required],
      unitPrice: ['', Validators.required],
      unitType: ['', Validators.required],

      invoiceCategory: ['', Validators.required],
      mapName: ['', Validators.required],
      startDate: ['', Validators.required],

      discountType: ['', Validators.required],
      discountAmount: ['', Validators.required],
      prorate: ['', Validators.required]
    });

    this.loadMapNames();
    this.getBillingCategories();
  }

  loadMapNames() {
    this.serviceChargeService.GetCostCenterMapping().subscribe({
      next: (res: any) => {
        this.mapNameList = res?.Data || [];
      },
      error: () => {
        alert("Failed to load Map Names");
      }
    });
  }




  getBillingCategories() {
    this.serviceChargeService.GetCostCenterMapping().subscribe({
      next: (res: any) => {
        this.mapNameList = res?.Data || [];
      },
      error: () => {
        alert("Failed to load Map Names");
      }
    });
  }

  onSubmit() {
    this.showErrors = true;

    if (this.billRateForm.invalid) return;
  }

  onReset() {
    this.billRateForm.reset();
    this.showErrors = false;
  }

  allowNumbersOnly(event: any) {
    const input = event.target as HTMLInputElement;
    const controlName = input.getAttribute('formControlName');

    // Keep only digits and the first dot
    input.value = input.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');

    if (controlName) {
      this.billRateForm.get(controlName)?.setValue(input.value);
    }
  }


}