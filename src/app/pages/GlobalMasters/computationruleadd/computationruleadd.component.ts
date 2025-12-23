import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ComputationruleService } from '../../../Service/GlobalMasters/computationrule.service';
import { IcomputationRule } from '../../../Repository/GlobalMasters/IComputationRule.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<IcomputationRule>('Pay_Token');

@Component({
  selector: 'app-computationruleadd',
  standalone: true,
  imports: [
    CommonModule,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  templateUrl: './computationruleadd.component.html',
  styleUrl: './computationruleadd.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ComputationruleService,
    }
  ]
})
export class ComputationruleaddComponent {

  addComputationForm!: FormGroup;
  fYear: any;
  userdetail: any;
  Edit = false;
  isLoading: boolean = false;
  Copy = false;

  constructor(private dialogRef: MatDialogRef<ComputationruleaddComponent>, @Inject(Pay_Token) private service: ComputationruleService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(MAT_DIALOG_DATA) public editData: any,) { }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.bindFinancialYear();
    this.addComputationForm = new FormGroup({
      FinancialYear: new FormControl("", Validators.required),
      EffectiveDate: new FormControl("", Validators.required),
      TaxId: new FormControl("", Validators.required),
      Description: new FormControl(""),
      Category: new FormControl("", Validators.required),
      Rule: new FormControl("", Validators.required)
    })
    // EDIT MODE
    const mode = this.editData?.mode?.toLowerCase();

    if (mode === 'edit') {
      this.Edit = true;
      this.Copy = false;
      this.patchEditData();
    }
    else if (mode === 'copy') {
      this.Edit = false;
      this.Copy = true;
      this.patchCopyData();
    }
    else {
      // Add mode (default)
      this.Edit = false;
      this.Copy = false;
    }

  }

  bindFinancialYear() {
    this.service.getFinancialYear().subscribe({
      next: res => {
        this.fYear = res.Data.data.Table0
      }
    });
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDateForInput(dateStr: string): string | null {
    if (!dateStr) return null;

    // Handles: "2016-04-01T00:00:00"
    return dateStr.split('T')[0];
  }

  patchEditData() {
    const row = this.editData.row;
    // PATCH FORM VALUES
    this.addComputationForm.patchValue({
      FinancialYear: row.Financial_Year_Id,
      EffectiveDate: this.formatDateForInput(row.Effective_Date),
      TaxId: row.Tax_Id,
      Description: row.Description,
      Category: row.Category,
      Rule: row.Computation_Rule
    });
    this.addComputationForm.get('FinancialYear')?.disable();
    this.addComputationForm.get('TaxId')?.disable();

  }

  patchCopyData() {
    const row = this.editData.row;
    // PATCH FORM VALUES
    this.addComputationForm.patchValue({
      TaxId: row.Tax_Id,
      Description: row.Description,
      Category: row.Category,
      Rule: row.Computation_Rule
    });
  }

  saveComputationRule() {

    if (this.addComputationForm.invalid) {
      this.addComputationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const form = this.addComputationForm.value;

    const selectedYear = this.fYear.find(
      y => y.Financial_Year_Id === Number(form.FinancialYear)
    );

    const payload = {
      details: {
        Computation_Rule_Id: 0,
        Financial_Year_Id: form.FinancialYear,
        Tax_Id: form.TaxId,
        Description: form.Description,
        Category: form.Category,
        Error_Message: "",
        Financial_Year_Name: selectedYear?.Financial_Year_Name,
        Computation_Rule: form.Rule,
        SNo: 0,
        Effective_Date: form.EffectiveDate
      },
      mode: 'Add',
      userId: this.userdetail.user_Id,
    };

    this.service.addCR(payload).subscribe({
      next: res => {
        alert(res.Data.message);
        this.dialogRef.close('updated');
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  updateComputationRule() {

    if (this.addComputationForm.invalid) {
      this.addComputationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const form = this.addComputationForm.getRawValue();
    const row = this.editData.row;

    const payload = {
      details: {
        Computation_Rule_Id: row.Computation_Rule_Id,
        Financial_Year_Id: row.Financial_Year_Id,
        Tax_Id: row.Tax_Id,
        Description: form.Description,
        Category: form.Category,
        Error_Message: row.Error_Message,
        Financial_Year_Name: row.Financial_Year_Name,
        Computation_Rule: form.Rule,
        SNo: row.SNo,
        Effective_Date: form.EffectiveDate
      },
      mode: 'Edit',
      userId: this.userdetail.user_Id,
    };
    this.service.addCR(payload).subscribe({
      next: res => {
        if (res?.StatusCode === 200) {
          alert(res.Data.message);
          this.dialogRef.close('updated');
        } else {
          alert(res?.Message || 'Update failed');
          this.isLoading = false;
        }
      },
      error: () => alert('API Error')
    });
  }


  copyComputatioRule() {

    if (this.addComputationForm.invalid) {
      this.addComputationForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;

    const form = this.addComputationForm.getRawValue();
    const row = this.editData.row;

    const payload = {
      details: {
        Computation_Rule_Id: row.Computation_Rule_Id,
        Financial_Year_Id: form.Financial_Year_Id,
        Tax_Id: row.Tax_Id,
        Description: row.Description,
        Category: row.Category,
        Error_Message: row.Error_Message,
        Financial_Year_Name: row.Financial_Year_Name,
        Computation_Rule: row.Computation_Rule,
        SNo: row.SNo,
        Effective_Date: form.EffectiveDate
      },
      mode: 'Copy',
      userId: this.userdetail.user_Id,
    };
    this.service.addCR(payload).subscribe({
      next: res => {
        if (res?.StatusCode === 200) {
          alert(res.Data.message);
          this.dialogRef.close('updated');
        } else {
          alert(res?.Message || 'Update failed');
          this.isLoading = false;
        }
      },
      error: () => alert('API Error')
    });
  }


  onClose() {
    this.dialogRef.close();
  }

}
