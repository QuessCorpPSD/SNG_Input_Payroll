import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { IProfessionatax } from '../../../Repository/GlobalMasters/IProfessionatax.service';
import { ProfessionaltaxService } from '../../../Service/GlobalMasters/professionaltax.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_Token = new InjectionToken<IProfessionatax>('Pay_Token');

export interface IPT {
  slNo: number;
  fromValue: number | null;
  toValue: number | null;
  amount: number | null;
}

@Component({
  selector: 'app-professionaltaxadd',
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
  templateUrl: './professionaltaxadd.component.html',
  styleUrl: './professionaltaxadd.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: ProfessionaltaxService,
    }
  ]
})

export class ProfessionaltaxaddComponent {
  addProfessionalTax!: FormGroup;
  editProfessionalTax!: FormGroup;
  ptType: any;
  state: any;
  category: any;
  circle: any;
  month: any;
  userdetail: any;
  Edit = false;
  isLoading: boolean = false;
  selectedRowSlNo: number | null | undefined;
  dataSource = new MatTableDataSource<any>([]); // Empty data (no rows)
  uploadData: IPT[] = [];
  uploadedDataSource = new MatTableDataSource<IPT>(this.uploadData)

  constructor(private dialogRef: MatDialogRef<ProfessionaltaxaddComponent>, @Inject(Pay_Token) private service: ProfessionaltaxService, private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(MAT_DIALOG_DATA) public editData: any,) { }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.addProfessionalTax = new FormGroup({
      StateName: new FormControl({ value: '', disabled: this.Edit }, Validators.required),
      EffectiveDate: new FormControl('', Validators.required),
      PTType: new FormControl({ value: '', disabled: this.Edit }, Validators.required),
      Category: new FormControl('', Validators.required),
      Circle: new FormControl(''),
      Month: new FormControl('', Validators.required)
    });

    // Load master data first
    this.bindPtType();
    this.bindState();
    this.bindCategory();
    this.bindMonth();

    // Auto-bind circle
    this.addProfessionalTax.get('StateName')?.valueChanges.subscribe(stateId => {
      if (stateId) {
        this.bindCircle(stateId);
      }
    });

    // EDIT MODE
    if (this.editData?.mode?.toLowerCase() === 'edit') {
      this.Edit = true;
      this.patchEditData();
    }
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

    const [day, month, year] = dateStr.split('/');
    return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
  }

  patchEditData() {
    const row = this.editData.row;
    // PATCH FORM VALUES
    this.addProfessionalTax.patchValue({
      StateName: row.State_Id,
      EffectiveDate: this.formatDateForInput(row.Effective_Date),
      PTType: row.PT_Type,
      Category: row.Category,
      Month: row.Month_Id,
      Circle: row.PTCircle_Id
    });
    this.addProfessionalTax.get('StateName')?.disable();
    // LOAD CIRCLE LIST
    this.bindCircle(row.State_Id);

    // TABLE DATA (SINGLE ROW → ARRAY)
    this.uploadData = [{
      slNo: Number(row.Serial_No),
      fromValue: Number(row.From_Value),
      toValue: Number(row.To_Value),
      amount: Number(row.Amount)
    }];

    this.uploadedDataSource.data = [...this.uploadData];
  }

  bindPtType() {
    this.service.GetPTType().subscribe({
      next: res => {
        this.ptType = res.Data;

      }
    });
  }

  bindState() {
    this.service.GetState().subscribe({
      next: res => {
        this.state = res.Data
      }
    })
  }

  bindCategory() {
    this.service.getCategory().subscribe({
      next: res => {
        this.category = res.Data
      }
    })
  }

  bindCircle(stateId: number) {
    if (!stateId) {
      this.circle = [];
      return;
    }

    this.service.getCircle(stateId).subscribe({
      next: res => {
        this.circle = res.Data;
      }
    });
  }

  bindMonth() {
    this.service.getMonth().subscribe({
      next: res => {
        this.month = res.Data
      }
    })
  }

  addNewRow() {

    const stateCtrl = this.addProfessionalTax.get('StateName');
    const ptTypeCtrl = this.addProfessionalTax.get('PTType');

    if (stateCtrl?.invalid || ptTypeCtrl?.invalid) {
      alert('Please select State and PT Type');
      stateCtrl?.markAsTouched();
      ptTypeCtrl?.markAsTouched();
      return;
    }

    this.uploadData.push({
      slNo: this.uploadData.length + 1,
      fromValue: null,
      toValue: null,
      amount: null
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


  saveProfessionalTax() {

    if (this.addProfessionalTax.invalid) {
      this.addProfessionalTax.markAllAsTouched();
      return;
    }

    if (this.uploadData.length === 0) {
      alert('Please add at least one slab row');
      return;
    }

    this.isLoading = true;

    const form = this.addProfessionalTax.value;

    const payload = {
      mode: 'Add',
      createdBy: this.userdetail.user_Id?.toString(),
      PTSlab: {
        Professional_Tax_Slab_Id: 0,
        State_Id: form.StateName,
        PTCircle_Id: form.Circle || 0,
        PT_Type: form.PTType,
        Category: form.Category,
        Effective_Date: this.formatDate(form.EffectiveDate)?.toString(),
        Month_Id: form.Month
      },
      PTSlabDetail: this.uploadData.map(row => ({
        Professional_Tax_Slab_Detail_Id: 0,
        Professional_Tax_Slab_Id: 0,
        From_Value: row.fromValue?.toString() || '0',
        To_Value: row.toValue?.toString() || '0',
        Amount: row.amount?.toString() || '0'
      }))
    };

    this.service.addPt(payload).subscribe({
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

  updateProfessionalTax() {

    if (this.addProfessionalTax.invalid) {
      this.addProfessionalTax.markAllAsTouched();
      return;
    }

    if (this.uploadData.length === 0) {
      alert('Please add at least one slab row');
      return;
    }

    this.isLoading = true;

    const form = this.addProfessionalTax.getRawValue();
    const row = this.editData.row;

    const payload = {
      mode: 'Edit',
      createdBy: this.userdetail.user_Id?.toString(),

      PTSlab: {
        Professional_Tax_Slab_Id: row.Professional_Tax_Slab_Id, // IMPORTANT
        State_Id: form.StateName,
        PTCircle_Id: form.Circle || 0,
        PT_Type: form.PTType,
        Category: form.Category,
        Effective_Date: this.formatDate(form.EffectiveDate),
        Month_Id: form.Month
      },

      PTSlabDetail: this.uploadData.map(d => ({
        Professional_Tax_Slab_Detail_Id: row.Professional_Tax_Slab_Detail_Id ?? 0,
        Professional_Tax_Slab_Id: row.Professional_Tax_Slab_Id,
        From_Value: d.fromValue?.toString() || '0',
        To_Value: d.toValue?.toString() || '0',
        Amount: d.amount?.toString() || '0'
      }))
    };

    this.service.addPt(payload).subscribe({
      next: (res: any) => {
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
    this.isLoading = false;
  }


  onClose() {
    this.dialogRef.close();
  }
}
