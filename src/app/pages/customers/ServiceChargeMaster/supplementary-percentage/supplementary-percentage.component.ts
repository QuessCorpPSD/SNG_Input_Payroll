import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ServiceChargeService } from '../../../../Service/CUSTOMER/service-charge.service';
import { EncryptionService } from '../../../../Shared/encryption.service';
import { SessionStorageService } from '../../../../Shared/SessionStorageService';

@Component({
    selector: 'app-supplementary-percentage',
    standalone: true,
    imports: [
        CommonModule,
        MatIconModule,
        MatCardModule,
        FormsModule,
        ReactiveFormsModule
    ],
    templateUrl: './supplementary-percentage.component.html',
    styleUrl: './supplementary-percentage.component.css'
})
export class SupplementaryPercentageComponent {

    suppPerForm!: FormGroup;
    showErrors = false;
    mapNameList: any[] = [];

    constructor(
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SupplementaryPercentageComponent>,
        private dialog: MatDialog,
        private serviceChargeService: ServiceChargeService,
        private decry: EncryptionService,
        private _sessionStoreage: SessionStorageService,
        private snackBar: MatSnackBar
    ) { }

    ngOnInit(): void {
        this.suppPerForm = this.fb.group({
            mapName: ['', Validators.required],
            paycode: ['', Validators.required],
            value: ['', Validators.required],

            maxAmount: ['', Validators.required],
            startDate: ['', Validators.required],
            marginalPaycode: ['', Validators.required]
        });
        this.loadMapNames();
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


    onSubmit() {
        this.showErrors = true;

        if (this.suppPerForm.invalid) {
            return; // show errors and stop
        }

        console.log("Supplementary Percentage Submitted:", this.suppPerForm.value);
        this.dialogRef.close(this.suppPerForm.value);
    }

    onReset() {
        this.suppPerForm.reset();
        this.showErrors = false;
    }

    onClose(): void {
        this.dialogRef.close();
    }
    allowNumbersOnly(event: any) {
        const input = event.target as HTMLInputElement;

        input.value = input.value.replace(/[^0-9.]/g, '');
        input.value = input.value.replace(/(\..*)\./g, '$1');

        this.suppPerForm.get(input.getAttribute('formControlName')!)?.setValue(input.value);
    }


}
