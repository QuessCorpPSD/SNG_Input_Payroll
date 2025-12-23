import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ITds } from '../../../Repository/GlobalMasters/Itds';
import { TdsService } from '../../../Service/GlobalMasters/tds.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
export const Pay_TOKEN = new InjectionToken<ITds>('Pay_TOKEN');

@Component({
  selector: 'app-tdsslab-add',
  standalone: true,
  imports: [MatCardModule, MatIconModule, MatTableModule, MatTooltipModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './tdsslab-add.component.html',
  styleUrl: './tdsslab-add.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: TdsService,
    }
  ]
})

export class TDSslabAddComponent {
  tdsForm!: FormGroup;
  uploadedDataSource = new MatTableDataSource<any>();
  selectedRowIndex: number | null = null;
  EDIT = false;
  editData: any;
  uploadDisplayedColumns: string[] = ['SNo', 'Income From', 'Income To', 'Amount', 'Tax Percentage'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  year: any;
  categ: any;
  userdetail: any;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<TDSslabAddComponent>, @Inject(Pay_TOKEN) private service: ITds,
    private decry: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(MAT_DIALOG_DATA) public data: any,) {
    console.log('parentdata', data);
  }

  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.tdsForm = this.fb.group({
      financialYear: ['', Validators.required],
      category: ['', Validators.required],
      agefrom: ['', Validators.required],
      ageto: ['', Validators.required],
      rows: this.fb.array([]),
    });

    this.uploadedDataSource.data = this.rows.controls;
    this.BindFinancialyear();
    this.BindCategory();
    if (this.data?.editData) {
      this.EDIT = true;
      this.editData = this.data.editData;
      this.bindEditData(this.editData); // load parent → child
    } else {
      this.EDIT = false;
    }
  }


  isInvalid(controlName: string): boolean {
    const control = this.tdsForm.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  rowInvalid(i: number, controlName: string): boolean {
    const row = this.rows.at(i);
    const control = row.get(controlName);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  BindFinancialyear() {
    this.service.GetFinancialYear().subscribe({
      next: res => {
        this.year = res.Data.data.Table0;
        console.log(this.year)
      }
    });
  };
  BindCategory() {
    this.service.GetCategory().subscribe({
      next: res => {
        this.categ = res.Data.data;
        console.log(this.categ)
      }
    });
  };
  bindEditData(data: any) {

    this.tdsForm.patchValue({
      financialYear: this.data.editData.Financial_Year_Name,
      category: this.data.editData.TDS_Category,
      agefrom: this.data.editData.From_Age,
      ageto: this.data.editData.To_Age
    });

    ['financialYear', 'category', 'agefrom', 'ageto']
      .forEach(c => this.tdsForm.get(c)?.disable());

    this.rows.clear();

    const allSlabs = this.data.allSlabs || [];

    const filtered = allSlabs.filter((s: any) =>
      s.TDS_Category === this.data.editData.TDS_Category &&
      s.Financial_Year_Id === this.data.editData.Financial_Year_Id &&
      s.From_Age === this.data.editData.From_Age &&
      s.To_Age === this.data.editData.To_Age
    );

    filtered.forEach((slab: any) => {
      this.rows.push(this.fb.group({
        incomeFrom: [slab.Income_From, Validators.required],
        incomeTo: [slab.Income_To, Validators.required],
        amount: [slab.Amount, Validators.required],
        taxPercentage: [slab.Tax_Percentage, Validators.required]
      }));
    });

    this.uploadedDataSource.data = this.rows.controls;
  }


  get rows(): FormArray {
    return this.tdsForm.get('rows') as FormArray;
  }
  markFormTouched() {
    this.tdsForm.markAllAsTouched();
    this.rows.controls.forEach(row => row.markAllAsTouched());
  }

  onUpdate() {

    if (this.tdsForm.invalid) {
      this.markFormTouched();
      return;
    }


    const payload = {
      mode: 'Edit',
      createdBy: this.userdetail.user_Id.toString(),

      parentDetail: {
        TDS_Slab_Id: this.editData.TDS_Slab_Id,
        Financial_Year_Id: this.editData.Financial_Year_Id,
        TDS_Category: this.editData.TDS_Category,
        From_Age: this.editData.From_Age,
        To_Age: this.editData.To_Age
      },

      ChildDetail: this.rows.value.map((r: any, index: number) => ({

        TDS_Slab_Id: this.editData.TDS_Slab_Id,
        TDS_Slab_Detail_Id: this.editData.TDS_Slab_Detail_Id,
        Client_TDS_Slab_Id: this.editData.Client_TDS_Slab_Id,
        Income_From: Number(r.incomeFrom) || 0,
        Income_To: Number(r.incomeTo) || 0,
        Amount: Number(r.amount) || 0,
        Tax_Percentage: Number(r.taxPercentage) || 0
      }))
    };

    console.log('EDIT TDS PAYLOAD', JSON.stringify(payload));

    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        const msg = res?.Data?.data?.Table0[0]?.Error_Message || res.Data.message;
        if (msg.toLowerCase().includes('success')) {
          alert(msg);
          this.dialogRef.close('refresh');
        } else {
          alert(msg);
        }
      },
      error: () => alert('Update failed')
    });
  }

  addRow() {
    const newRow = this.fb.group({
      incomeFrom: [null, Validators.required],
      incomeTo: [null, Validators.required],
      amount: [null, Validators.required],
      taxPercentage: [null, Validators.required]
    });

    this.rows.push(newRow);
    this.uploadedDataSource.data = this.rows.controls; // Update the dataSource
  }

  deleteRow(index: number) {
    if (this.selectedRowIndex !== null) {
      this.rows.removeAt(index);

      this.uploadedDataSource.data = this.rows.controls;

      this.selectedRowIndex = null;
    }
  }


  // Select a row (for delete)
  selectRow(row: any, index: number) {
    this.selectedRowIndex = index;
  }



  onClose() {
    this.dialogRef.close();
  }

  onSave() {

    if (this.tdsForm.invalid) {
      this.markFormTouched();
      return;
    }


    const payload = {
      mode: 'Add',
      createdBy: this.userdetail.user_Id.toString(),

      parentDetail: {
        TDS_Slab_Id: 0,
        Financial_Year_Id: Number(this.tdsForm.value.financialYear),
        TDS_Category: this.tdsForm.value.category,
        From_Age: Number(this.tdsForm.value.agefrom),
        To_Age: Number(this.tdsForm.value.ageto)
      },

      ChildDetail: this.tdsForm.value.rows.map((r: any, index: number) => ({
        TDS_Slab_Id: 0,
        TDS_Slab_Detail_Id: 0,
        Income_From: Number(r.incomeFrom) || 0,
        Income_To: Number(r.incomeTo) || 0,
        Amount: Number(r.amount) || 0,
        Tax_Percentage: Number(r.taxPercentage) || 0
      }))
    };

    console.log('TDS PAYLOAD', JSON.stringify(payload));

    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        console.log('response', res);
        const msg = res?.Data?.data?.Table0[0]?.Error_Message || res.Data.message;

        if (msg?.toLowerCase().includes('success')) {
          alert(msg);
          this.dialogRef.close('refresh');
        } else {
          alert(msg);
        }
      },
      error: () => {
        alert('Error while processing');
      }
    });
  }

}