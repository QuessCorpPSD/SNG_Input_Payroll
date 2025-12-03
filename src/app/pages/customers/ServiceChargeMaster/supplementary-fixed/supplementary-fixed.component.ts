import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';

@Component({
  selector: 'app-supplementary-fixed',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatCardModule,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './supplementary-fixed.component.html',
  styleUrls: ['./supplementary-fixed.component.css']
})
export class SupplementaryFixedComponent {
  suppFixForm!: FormGroup;
  showErrors = false;
  mapNameList: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<SupplementaryFixedComponent>,
    private dialog: MatDialog,
    private serviceChargeService: ServiceChargeService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.suppFixForm = this.fb.group({
      mapName: ['', Validators.required],
      paycode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],  
      slab: ['', Validators.required],
      value: ['', [Validators.required, Validators.pattern('^[0-9]*$')]], 
      startDate: ['', Validators.required]
    });

   
    this.loadMapNames();
  }

  onSubmit() {
    this.showErrors = true;

    if (this.suppFixForm.invalid) {
      return;
    }

    console.log("Supplementary Fixed Form Submitted:", this.suppFixForm.value);
   
  }

  onReset() {
    this.suppFixForm.reset();
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

  
  allowNumbersOnly(event: any) {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9.]/g, ''); 
    input.value = input.value.replace(/(\..*)\./g, '$1'); 
    this.suppFixForm.get(input.getAttribute('formControlName')!)?.setValue(input.value);
  }
}
