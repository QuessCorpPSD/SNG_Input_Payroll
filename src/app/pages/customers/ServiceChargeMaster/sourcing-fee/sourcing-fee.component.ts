import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';
import { AddServicefeeComponent } from '../add-servicefee/add-servicefee.component';

@Component({
  selector: 'app-sourcing-fee',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './sourcing-fee.component.html',
  styleUrl: './sourcing-fee.component.css'
})
export class SourcingFeeComponent {

  sourcingForm!: FormGroup;
  showErrors = false;

  mapNameList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddServicefeeComponent>,
    private dialog: MatDialog,
    private serviceChargeService: ServiceChargeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar
  ) { }



  ngOnInit(): void {
    this.sourcingForm = this.fb.group({
      type: ['', Validators.required],
      paycode: ['', Validators.required],
      value: ['', Validators.required],

      mapName: ['', Validators.required],
      replacementClause: ['', Validators.required],
      replacement: ['', Validators.required],

      sourcingWaiting: ['', Validators.required],
      sourcingValue: ['', Validators.required],
      criteriaValue: ['', Validators.required],

      tatDays: ['', Validators.required],
      startDate: ['', Validators.required],
      category: ['', Validators.required],
    });
    this.loadMapNames();
  }

  onSubmit() {
    this.showErrors = true;

    if (this.sourcingForm.invalid) {
      return; // show errors
    }

    console.log("Sourcing Fee Submitted:", this.sourcingForm.value);
  }
  allowNumbersOnly(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9]/g, '');
    this.sourcingForm.get(input.getAttribute('formControlName')!)?.setValue(input.value);
  }
  onReset() {
    this.sourcingForm.reset();
    this.showErrors = false;
  }
  loadMapNames() {
    this.serviceChargeService.GetCostCenterMapping().subscribe({
      next: (res: any) => {
        this.mapNameList = res?.Data || [];
      },
      error: () => {
        this.snackBar.open("Failed to load Map Names", "Close", { duration: 3000 });
      }
    });
  }

}
