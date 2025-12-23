import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatIconModule } from "@angular/material/icon";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatCardModule } from "@angular/material/card";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ILwf } from '../../../Repository/GlobalMasters/Ilwf';
import { LwfService } from '../../../Service/GlobalMasters/lwf.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatOptionModule } from "@angular/material/core";
export const Pay_TOKEN = new InjectionToken<ILwf>('Pay_TOKEN');
export interface LwfSlabRow {
  SNo: number;
  FromValue: number | null;
  ToValue: number | null;
  Month: string;
  EContribution: number | null;
  ERContribution: number | null;
}
@Component({
  selector: 'app-lfwslab-add',
  standalone: true,
  imports: [MatIconModule, MatTableModule, MatPaginator, MatCardModule, MatTooltipModule, CommonModule, FormsModule, MatOptionModule, ReactiveFormsModule],
  templateUrl: './lfwslab-add.component.html',
  styleUrl: './lfwslab-add.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: LwfService,
    }
  ]
})
export class LFWSlabAddComponent {

  addlwfform!: FormGroup;
  editlwfform!: FormGroup;

  State: any[] = [];
  Month: any[] = [];

  uploadDisplayedColumns: string[] = [
    'SNo',
    'FromValue',
    'ToValue',
    'Month',
    'EContribution',
    'ERContribution',
  ];

  uploadedDataSource = new MatTableDataSource<any>();

  EDIT = false;
  selectedRowIndex: number | null = null;
  userdetail: any;
  isLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LFWSlabAddComponent>,
    @Inject(Pay_TOKEN) private service: ILwf, @Inject(MAT_DIALOG_DATA) public data: any,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,) {
    this.EDIT = data?.mode === 'EDIT';
    console.log('data', this.data)
  }
  @ViewChild('paginator') paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  ngOnInit(): void {

    // User
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    this.EDIT = this.data?.mode === 'EDIT';

    this.createForm();

    // Bind dropdowns ONCE
    this.BindState();
    this.BindMonth();

    if (this.EDIT) {
      this.bindEditHeader();
      this.uploadedDataSource.data = this.editRows.controls;
    } else {
      this.uploadedDataSource.data = this.addRows.controls;
    }

    console.log('MODE:', this.data?.mode);
    console.log('EDIT FLAG:', this.EDIT);
  }


  bindEditHeader() {
    if (!this.data?.headerData) return;

    this.editlwfform.patchValue({
      editState: this.data.headerData.State_Name,
      editEffectiveDate: this.data.headerData.Effective_Date
    });

    this.editlwfform.get('editState')?.disable();
    this.editlwfform.get('editEffectiveDate')?.disable();
  }


  createForm() {

    // ADD FORM (always safe)
    this.addlwfform = this.fb.group({
      State: ['', Validators.required],
      EffectiveDate: ['', Validators.required],
      rows: this.fb.array([])
    });

    // EDIT FORM — SAFE GUARD
    this.editlwfform = this.fb.group({
      editState: [
        this.EDIT ? this.data?.headerData?.State_Name : '',
        Validators.required
      ],
      editEffectiveDate: [
        this.EDIT ? this.data?.headerData?.Effective_Date : '',
        Validators.required
      ],
      rows: this.fb.array([])
    });
  }

  // 👉 IMPORTANT
  get addRows(): FormArray {
    return this.addlwfform.get('rows') as FormArray;
  }

  get editRows(): FormArray {
    return this.editlwfform.get('rows') as FormArray;
  }

  createRow(): FormGroup {
    return this.fb.group({

      FromValue: [null, Validators.required],
      ToValue: [null, Validators.required],
      Month: ['', Validators.required],
      EContribution: [null, Validators.required],
      ERContribution: [null, Validators.required],
    });
  }

  // createeditRow(): FormGroup {
  //   return this.fb.group({

  //     editFromValue: [null, Validators.required],
  //     editToValue: [null, Validators.required],
  //     editMonth: ['', Validators.required],
  //     editEContribution: [null, Validators.required],
  //     editERContribution: [null, Validators.required],
  //   });
  // }

  addRow() {
    const row = this.createRow();

    if (!this.EDIT) {
      this.addRows.push(row);
      this.uploadedDataSource.data = [...this.addRows.controls];
    } else {
      this.editRows.push(row);
      this.uploadedDataSource.data = [...this.editRows.controls];
    }

    this.selectedRowIndex = null;
  }


  deleteSelectedRow(index: number) {
    if (!this.EDIT) {
      this.addRows.removeAt(index);
      this.uploadedDataSource.data = [...this.addRows.controls];
    } else {
      this.editRows.removeAt(index);
      this.uploadedDataSource.data = [...this.editRows.controls];
    }
  }


  BindState() {
    this.service.GetState().subscribe(res => {
      this.State = res.Data;
    });
  }


  BindMonth() {
    this.service.GetMonth().subscribe(res => this.Month = res.Data);
  }
  selectRow(row: any) {
    this.selectedRowIndex = this.uploadedDataSource.data.indexOf(row);
  }
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Converts DD-MM-YYYY to YYYY-MM-DD
  }

  onSave() {

    if (this.addlwfform.invalid) {
      this.addlwfform.markAllAsTouched();
      return;
    }

    const payload = {
      mode: 'ADD',
      CreatedBy: this.userdetail.user_Id.toString(),

      LWFSlab: {
        LWF_Slab_Id: 0,
        Financial_Year_Id: 0,
        State_Id: this.addlwfform.value.State,
        Effective_Date:this.formatDate(this.addlwfform.value.EffectiveDate)
      },

      LWFSlabDetails: this.addlwfform.value.rows.map((r: any) => ({
        LWF_Slab_Detail_Id: 0,
        From_Value: r.FromValue.toString(),
        To_Value: r.ToValue.toString(),
        Frequency_Id: 1,
        Month_Id: r.Month.toString(),
        EmployerContribution: r.ERContribution.toString(),
        EmployeeContribution: r.EContribution.toString()
      }))
    };
    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('response', res)
        const msg = res?.Data?.response;
        if (msg.toLowerCase().includes('success')) {
          alert(res.Data.response);
          this.dialogRef.close('refresh');
        } else {
          alert(res?.Data?.response || "Unexpected response");
          this.dialogRef.close('refresh');
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error while processing");
      }
    });
  }

   onUpdate() {

    if (this.editlwfform.invalid) {
      this.editlwfform.markAllAsTouched();
      return;
    }

    const payload = {
      mode: 'Edit',
      CreatedBy: this.userdetail.user_Id.toString(),

      LWFSlab: {
        LWF_Slab_Id: 0,
        Financial_Year_Id: 0,
        State_Id: this.data?.headerData?.State_Name ,
        Effective_Date:this.formatDate(this.data.headerData.Effective_Date)
      },

      LWFSlabDetails: this.addlwfform.value.rows.map((r: any) => ({
        LWF_Slab_Detail_Id: 0,
        From_Value: r.FromValue.toString(),
        To_Value: r.ToValue.toString(),
        Frequency_Id: 1,
        Month_Id: r.Month.toString(),
        EmployerContribution: r.ERContribution.toString(),
        EmployeeContribution: r.EContribution.toString()
      }))
    };
    this.service.CreateupdateDelete(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        console.log('response', res)
        const msg = res?.Data?.response;
        if (msg.toLowerCase().includes('success')) {
          alert(res.Data.response);
          this.dialogRef.close('refresh');
        } else {
          alert(res?.Data?.response || "Unexpected response");
          this.dialogRef.close('refresh');
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Error while processing");
      }
    });
  }



  onClose() {
    this.dialogRef.close();
  }

}
