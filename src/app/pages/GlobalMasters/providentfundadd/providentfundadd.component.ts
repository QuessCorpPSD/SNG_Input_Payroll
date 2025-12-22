import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ProvidentfundService } from '../../../Service/GlobalMasters/providentfund.service';
import { IPFService } from '../../../Repository/GlobalMasters/IPF.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<IPFService>('Pay_Token');
export interface IPF {
  slNo: number;
  fromValue: number | null;
  toValue: number | null;
  criteriatype: number | null;
  criteria: number | null;
  formula: number | null;
}


@Component({
  selector: 'app-providentfundadd',
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
    MatPaginatorModule,
    MatTableModule,
    FormsModule
  ],
  templateUrl: './providentfundadd.component.html',
  styleUrl: './providentfundadd.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ProvidentfundService,
    }
  ]
})
export class ProvidentfundaddComponent {

  addProvidentForm!: FormGroup;
  getPay: any;
  getCap: any;
  uploadData: IPF[] = [];
  uploadedDataSource = new MatTableDataSource<IPF>(this.uploadData)
  fromValue: any;
  selectedRowSlNo: any;
  userdetail: any;
  Edit = false;
  getCriteria: any;
  isLoading: boolean = false;

  constructor(private dialogRef: MatDialogRef<ProvidentfundaddComponent>, @Inject(Pay_Token) private service: IPFService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(MAT_DIALOG_DATA) public editData: any,) { }

  dataSource = new MatTableDataSource<any>([]); // Empty data (no rows)

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.bindPayCode();
    this.bindCap();
    this.bindCriteriaType();
    this.addProvidentForm = new FormGroup({
      PayCode: new FormControl('', Validators.required),
      Description: new FormControl(''),
      PrintAs: new FormControl('', Validators.required),
      CapNonCapType: new FormControl('', Validators.required),
      Date: new FormControl('')
    });
    this.addProvidentForm.get('PayCode')?.valueChanges.subscribe(paycodeId => {
      const selectedPay = this.getPay.find(
        (p: any) => p.paycode_Id == paycodeId
      );

      if (selectedPay) {
        this.addProvidentForm.patchValue({
          Description: selectedPay.description,
          PrintAs: selectedPay.print_As
        });
      } else {
        this.addProvidentForm.patchValue({
          Description: '',
          PrintAs: ''
        });
      }
    });
    this.addProvidentForm.get('Description')?.disable();
    this.addProvidentForm.get('PrintAs')?.disable();
    if (this.editData?.mode?.toLowerCase() === 'edit') {
      this.Edit = true;
      this.patchEditData();
      this.addProvidentForm.get('PayCode')?.disable();
      this.addProvidentForm.get('Description')?.disable();
      this.addProvidentForm.get('PrintAs')?.disable();
      this.addProvidentForm.get('CapNonCapType')?.disable();
    }
  }

  bindCap() {
    this.service.getCap().subscribe({
      next: res => {
        this.getCap = res.Data
      }
    });
  }

  bindPayCode() {
    this.service.getPayCode().subscribe({
      next: res => {
        this.getPay = res.Data
      }
    });
  }

  bindCriteriaType() {
    this.service.getCriteriaType().subscribe({
      next: res => {
        this.getCriteria = res.Data
      }
    });
  };

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  formatDateForInput(dateStr: string): string | null {
    if (!dateStr) return null;

    // Case 1: API returns ISO string (yyyy-MM-dd or yyyy-MM-ddTHH:mm:ss)
    if (dateStr.includes('T')) {
      return dateStr.split('T')[0]; // "2016-04-01"
    }

    // Case 2: dd/MM/yyyy
    if (dateStr.includes('/')) {
      const [day, month, year] = dateStr.split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }

    return null;
  }

  patchEditData() {
    const row = this.editData.row;
    // PATCH FORM VALUES
    this.addProvidentForm.patchValue({
      PayCode: row.PayCodeId,
      Description: row.Description,
      PrintAs: row.Print_As,
      CapNonCapType: row.IsCapType,
      Date: this.formatDateForInput(row.EffectiveDate),
    });

    // TABLE DATA (SINGLE ROW → ARRAY)
    this.uploadData = [{
      slNo: Number(row.SNo),
      fromValue: Number(row.From_Value),
      toValue: Number(row.To_Value),
      criteriatype: row.CriteriaTypeId,
      criteria: row.Criteria,
      formula: row.Formula
    }];

    this.uploadedDataSource.data = [...this.uploadData];
  }

  addNewRow() {
    const payCodeCtrl = this.addProvidentForm.get('PayCode');
    const capCtrl = this.addProvidentForm.get('CapNonCapType');
    const date = this.addProvidentForm.get('Date');

    if (payCodeCtrl?.invalid || capCtrl?.invalid || date?.invalid) {
      alert('Please select paycode and CapNonCapType and Date');
      payCodeCtrl?.markAsTouched();
      capCtrl?.markAsTouched();
      date?.markAllAsTouched()
      return;
    }

    this.uploadData.push({
      slNo: this.uploadData.length + 1,
      fromValue: null,
      toValue: null,
      criteriatype: null,
      criteria: null,
      formula: null
    });

    this.uploadedDataSource.data = [...this.uploadData];
  }

  deleteSelectedRow() {
    if (!this.selectedRowSlNo) {
      alert('Please select a row before deleting');
      return;
    }

    this.uploadData = this.uploadData.filter(row => row.slNo !== this.selectedRowSlNo);

    // Re-index slNo after deletion
    this.uploadData.forEach((row, index) => row.slNo = index + 1);

    this.uploadedDataSource.data = [...this.uploadData];

    // Reset selection
    this.selectedRowSlNo = null;
  }

  saveProvidentFund() {

    if (this.addProvidentForm.invalid) {

      // Highlight all fields (makes touched = true)
      this.addProvidentForm.markAllAsTouched();

      return;
    }

    if (this.addProvidentForm.invalid) {
      this.addProvidentForm.markAllAsTouched();
      return;
    }

    if (this.uploadData.length === 0) {
      alert('Please add at least one slab row');
      return;
    }

    this.isLoading = true;

    const form = this.addProvidentForm.value;

    const payload = {
      mode: 'Add',
      CreatedBy: this.userdetail.user_Id?.toString(),
      PF: {
        Provident_Fund_Id: 0,
        Effective_Date: this.formatDate(form.Date)?.toString(),
        PayCode_Id: form.PayCode || 0,
        IsCapType: form.CapNonCapType,
        Criteria: form.criteria || "0",
      },
      PFDetail: this.uploadData.map(row => ({
        Provident_Fund_Detail_Id: 0,
        Provident_Fund_Id: 0,
        From_Value: row.fromValue?.toString() || '0',
        To_Value: row.toValue?.toString() || '0',
        Criteria: row.criteria?.toString() || '0',
        Criteria_Type_Id: row.criteriatype?.toString() || '0',
        Formula: row.formula?.toString() || '0'
      }))
    };

    this.service.addPf(payload).subscribe({
      next: res => {
        alert(res.Data.response);
        this.dialogRef.close('updated');
      },
      error: err => {
        console.error(err);
        this.isLoading = false;
      }
    });
    this.isLoading = false;
  }

  updateProvidentFund() {

    if (this.addProvidentForm.invalid) {
      this.addProvidentForm.markAllAsTouched();
      return;
    }

    if (this.uploadData.length === 0) {
      alert('Please add at least one slab row');
      return;
    }

    this.isLoading = true;

    const form = this.addProvidentForm.getRawValue();
    const row = this.editData.row;

    const payload = {
      mode: 'Edit',
      CreatedBy: this.userdetail.user_Id?.toString(),

      PF: {
        Provident_Fund_Id: row.ProvidentFundId, //  EXISTING ID
        Effective_Date: this.formatDate(form.Date)?.toString(),
        PayCode_Id: form.PayCode,
        IsCapType: form.CapNonCapType,
        Criteria: form.criteria || "0"
      },

      PFDetail: this.uploadData.map(d => ({
        Provident_Fund_Detail_Id: row.ProvidentFundId1 || 0,
        Provident_Fund_Id: row.ProvidentFundId,
        From_Value: d.fromValue?.toString() || '0',
        To_Value: d.toValue?.toString() || '0',
        Criteria: d.criteria?.toString() || '0',
        Criteria_Type_Id: d.criteriatype?.toString() || '0',
        Formula: d.formula?.toString() || '0'
      }))
    };

    this.service.addPf(payload).subscribe({
      next: res => {
        if (res?.StatusCode === 200) {
          alert(res.Data.response);
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
