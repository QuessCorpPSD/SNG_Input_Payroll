import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CPFslabDetailsService } from '../../../Service/GlobalMasters/cpfslab-details.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

@Component({
  selector: 'app-add-cpfslab-details',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatCardModule,
    ReactiveFormsModule
  ],
  templateUrl: './add-cpfslab-details.component.html',
  styleUrls: ['./add-cpfslab-details.component.css']
})
export class AddCPFslabDetailsComponent {

  Cpfform!: FormGroup;

  categories: any[] = [];
  payCodeList: any[] = [];
  criteriaList: any[] = [];
  isLoading = false;
  userdetail: any;

  constructor(
    private dialogRef: MatDialogRef<AddCPFslabDetailsComponent>,
    private fb: FormBuilder,
    private cpfService: CPFslabDetailsService,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
        
  ) { }

  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }

    this.Cpfform = this.fb.group({
      Category: ['', Validators.required],
      PayCodeId: ['', Validators.required],
      StartDate: ['', Validators.required],

      // Correct fixed validation for disabled field
      Description: [{ value: '', disabled: true }, Validators.required],

      FromAge: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      ToAge: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],

      FromValue: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      ToValue: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],

      CriteriaType: ['', Validators.required],
      Criteria: ['', Validators.required],
      Formula: ['', Validators.required]
    });

    this.loadCategories();
    this.loadPayCodes();
    this.loadCriteria();

    // Ensure disable remains
    this.Cpfform.get('Description')?.disable();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.cpfService.GetCategory().subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200 && Array.isArray(res?.Data?.data)) {
          this.categories = res.Data.data;
        }
        this.isLoading = false;
      },
      error: () => (this.isLoading = false)
    });
  }

  loadPayCodes(): void {
    this.cpfService.GetPayCodeList().subscribe({
      next: (res: any) => {
        const tableData = res?.Data?.data?.Table0 || [];
        this.payCodeList = Array.isArray(tableData) ? tableData : [];
      },
      error: () => this.payCodeList = []
    });
  }

  loadCriteria(): void {
    this.isLoading = true;
    this.cpfService.GetCriteriaType().subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200 && Array.isArray(res?.Data?.data?.Table0)) {
          this.criteriaList = res.Data.data.Table0;
        } else {
          this.criteriaList = [];
        }
        this.isLoading = false;
      },
      error: () => {
        this.criteriaList = [];
        this.isLoading = false;
      }
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  // ✔ No alert now — only red validation errors show
  onSave(): void {

    if (this.Cpfform.invalid) {
      this.Cpfform.markAllAsTouched();
      return;  // Now validation will show in red only
    }

    const formValue = this.Cpfform.getRawValue();

    const xmlDetails = `
<Root>
  <Row
    Category="${formValue.Category}"
    PayCode="${formValue.PayCodeId}"
    Description="${formValue.Description}"
    From_Age="${formValue.FromAge}"
    To_Age="${formValue.ToAge}"
    From_Value="${formValue.FromValue}"
    To_Value="${formValue.ToValue}"
    Criteria_Type_Id="${formValue.CriteriaType}"
    Criteria="${formValue.Criteria}"
    Formula="${formValue.Formula}"
    EffectiveDate="${formValue.StartDate}"
  />
</Root>
    `.trim();

    const payload = {
      strXmlDetails: xmlDetails,
      mode: 'Add',
      userId: this.userdetail.user_Id
    };

    this.cpfService.CreateCPF(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200 && res?.Data?.statusCode === "200") {
          alert('CPF record created successfully');
          this.dialogRef.close();
        } else {
          alert(res?.Data?.message || 'CPF creation failed');
        }
      },
      error: (err) => {
        alert('Error occurred while saving.');
      }
    });
  }
}
