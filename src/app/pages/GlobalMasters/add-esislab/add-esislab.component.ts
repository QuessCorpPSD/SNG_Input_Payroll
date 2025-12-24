import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

import { ESIslabService } from '../../../Service/GlobalMasters/esislab.service';
import { IESIslab } from '../../../Repository/GlobalMasters/IESIslab';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Esi_TOKEN = new InjectionToken<IESIslab>('Paycode_TOKEN');
export interface IESISlab {
  slNo: number;
  fromValue: number | null;
  toValue: number | null;
  criteria: number | null;
  criteriaType: number | null;
}
export interface IESILocationDetail {
  slNo: number;
  fromValue: number | null;
  toValue: number | null;
  criteria: number | null;
  criteriaType: number | null;
}
export interface IESIBlockDetail {
  slNo: number;
  block: number | null;
  month: number | null;
}





@Component({
  selector: 'app-add-esislab',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatPaginator,
    MatDialogModule,
    MatCardModule
  ],
  templateUrl: './add-esislab.component.html',
  styleUrl: './add-esislab.component.css',
  providers: [
    {
      provide: Esi_TOKEN,
      useClass: ESIslabService
    }
  ]
})
export class AddESIslabComponent {

  /* ================= MODE ================= */
  mode: 'ESI_SLAB' | 'ESI_BLOCK' | 'ESI_LOCATION' = 'ESI_SLAB';

  /* ================= COMMON ================= */
  userdetail: any;
  uploadedData: IESILocationDetail[] = [];
  uploadedDataSource = new MatTableDataSource<IESILocationDetail>([]);
  selectedRowIndex: number | null = null;
  blockTypeList: any[] = [];
  monthList: any[] = [];
  Edit = false;
  editSlabRow: any = null;
  stateList: any[] = [];
  cityList: any[] = [];
  editEsiBlockRow: any = null;
  selectedStateId: number | null = null;
  selectedCityId: number | null = null;
  /** THIS WAS MISSING – HTML NEEDS THIS */
  uploadDisplayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('esiSlabPaginator') esiSlabPaginator!: MatPaginator;
  @ViewChild('esiLocationPaginator') esiLocationPaginator!: MatPaginator;



  /* ================= ESI SLAB ================= */
  disability: number | null = null;
  payCodeList: any[] = [];
  selectedPayCode: any = null;
  description = '';
  printAs = '';
  effectiveDate: string | null = null;
  criteriaTypeList: any[] = [];
  locFromDate: string | null = null;
  locToDate: string | null = null;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;
  val_paycode: boolean = false;
  val_disability: boolean = false;
  val_effectiveDate: boolean = false;
  val_blockEffectiveDate: boolean = false;



  esiSlabColumns: string[] = [
    'slNo',
    'fromValue',
    'toValue',
    'criteria',
    'criteriaType'
  ];

  /* ================= ESI BLOCK ================= */
  blockEffectiveDate: string | null = null;

  /* ================= ESI BLOCK ================= */
  esiBlockData: any[] = [];
  esiBlockDataSource = new MatTableDataSource<any>([]);
  selectedBlockRowIndex: number | null = null;

  esiBlockColumns: string[] = [
    'slNo',
    'block',
    'month'
  ];


  /* ================= ESI LOCATION ================= */

  state = '';
  city = '';

  esiLocationColumns: string[] = [
    'slNo',
    'fromValue',
    'toValue',
    'criteria',
    'criteriaType'
  ];


  /* ================= CONSTRUCTOR ================= */
  constructor(
    @Inject(Esi_TOKEN) private esiService: ESIslabService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<AddESIslabComponent>,
    private sessionStorage: SessionStorageService,
    private decry: EncryptionService
  ) {
    if (data?.mode) {
      this.mode = data.mode;
    }

    if (data?.action === 'edit') {
      this.Edit = true;


      if (data.mode === 'ESI_SLAB' || data.mode === 'ESI_LOCATION') {
        this.editSlabRow = data.row;
      }


      if (data.mode === 'ESI_BLOCK') {
        this.editEsiBlockRow = data.row;
      }
    }
  }

  /* ================= INIT ================= */
  ngOnInit(): void {

    const json = this.sessionStorage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    /* ================= ESI SLAB ================= */
    if (this.mode === 'ESI_SLAB') {
      this.uploadDisplayedColumns = this.esiSlabColumns;
      this.BindPayCodes();
      this.BindCriteriaTypes();

      if (this.Edit && this.data?.row) {
        this.patchEditSlab(this.data.row);
      }
    }

    /* ================= ESI BLOCK ================= */
    if (this.mode === 'ESI_BLOCK') {
      this.uploadDisplayedColumns = this.esiBlockColumns;
      this.esiBlockDataSource.paginator = this.paginator;
      this.BindBlockTypes();
      this.BindMonths();

      if (this.Edit && this.data?.row) {
        this.patchEditESIBlock(this.data.row);
      }
    }

    /* ================= ESI LOCATION ================= */
    if (this.mode === 'ESI_LOCATION') {
      this.uploadDisplayedColumns = this.esiLocationColumns;
      this.BindStates();
      this.BindPayCodes();
      this.BindCriteriaTypes();

      if (this.Edit && this.data?.row) {
        this.patchEditESILocation(this.data.row);
      }
    }
  }
  formatDate(dateStr: string): string {
    const date = new Date(dateStr.replace(/-/g, '/').replace('T', ' '));
    return date.toISOString().split('T')[0];
  }


  ngAfterViewInit(): void {
    if (this.mode === 'ESI_SLAB') {
      this.uploadedDataSource.paginator = this.esiSlabPaginator;
      this.uploadedDataSource.paginator = this.esiLocationPaginator;
    }
  }



  BindPayCodes(): void {
    this.esiService.GetPayCodes().subscribe({
      next: (res: any) => {
        this.payCodeList = res?.Data ?? [];

        // ✅ PERFECT
        if (this.Edit && this.editSlabRow) {
          this.patchEditSlab(this.editSlabRow);
        }
      }
    });
  }


  BindCriteriaTypes(): void {
    this.esiService.GetCriteriaType().subscribe({
      next: (res: any) => {
        this.criteriaTypeList = res?.Data ?? [];
      }
    });
  }

  /* ================= PAY CODE CHANGE ================= */
  onPayCodeChange(): void {
    const pay = this.payCodeList.find(p => p.paycode_Id == this.selectedPayCode);
    if (!pay) {
      this.description = '';
      this.printAs = '';
      return;
    }
    this.description = pay.description;
    this.printAs = pay.print_As;
  }

  /* ================= ROW SELECT ================= */
  selectRow(index: number): void {
    if (this.esiSlabPaginator) {
      // Calculate absolute index based on the current page
      this.selectedRowIndex =
        index + (this.esiSlabPaginator.pageIndex * this.esiSlabPaginator.pageSize);
    } else {
      this.selectedRowIndex = index;
    }
  }
  addRow(): void {
    this.uploadedData.push({
      slNo: this.uploadedData.length + 1,
      fromValue: null,
      toValue: null,
      criteria: null,
      criteriaType: null,
    });

    this.uploadedDataSource.data = [...this.uploadedData];
  }
  /* ================= DELETE ROW ================= */
  deleteRow(): void {

    if (this.selectedRowIndex === null) {
      alert('Please select a row to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this row?')) {
      return;
    }

    this.uploadedData.splice(this.selectedRowIndex, 1);

    // Recalculate Sl No
    this.uploadedData.forEach((row, i) => row.slNo = i + 1);

    this.uploadedDataSource.data = [...this.uploadedData];
    this.selectedRowIndex = null;
  }



  addBlockRow(): void {
    this.esiBlockData.push({
      slNo: this.esiBlockData.length + 1,
      block: '',
      month: ''
    });

    this.esiBlockDataSource.data = [...this.esiBlockData];
  }

  deleteBlockRow(): void {

    if (this.selectedBlockRowIndex === null) {
      alert('Please select a row to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this row?')) {
      return;
    }

    this.esiBlockData.splice(this.selectedBlockRowIndex, 1);

    // Recalculate Sl No
    this.esiBlockData.forEach((row, i) => row.slNo = i + 1);

    this.esiBlockDataSource.data = [...this.esiBlockData];
    this.selectedBlockRowIndex = null;
  }


  selectBlockRow(index: number): void {
    if (this.paginator) {
      this.selectedBlockRowIndex =
        index + (this.paginator.pageIndex * this.paginator.pageSize);
    } else {
      this.selectedBlockRowIndex = index;
    }
  }


  // SaveClick(): void {

  //   this.isLoading = true;

  //   if (!this.selectedPayCode) {
  //     alert('Please select the Paycode');
  //     this.isLoading = false;
  //     return;
  //   }

  //   if (!this.effectiveDate) {
  //     alert('Please select the Effective Date');
  //     this.isLoading = false;
  //     return;
  //   }

  //   if (!this.uploadedData || this.uploadedData.length === 0) {
  //     alert('Please add at least one slab row');
  //     this.isLoading = false;
  //     return;
  //   }

  //   const payload = {
  //     mode: 'Add',
  //     CreatedBy: this.userdetail?.user_Id?.toString(),
  //     ESISlab: {
  //       ESI_Slab_Id: 0,
  //       Paycode_Id: Number(this.selectedPayCode),
  //       Effective_Date: this.effectiveDate
  //     },
  //     ESISlabDetail: this.uploadedData.map((r: any) => ({
  //       From_Value: String(r.fromValue ?? 0),
  //       To_Value: String(r.toValue ?? 0),
  //       Criteria: String(r.criteria ?? ''),
  //       Criteria_Type_Id: Number(r.criteriaType),
  //       ESI_Slab_Detail_Id: 0
  //     }))
  //   };

  //   console.log('CORRECT PAYLOAD:', JSON.stringify(payload));

  //   this.esiService.CreateUpdateDeleteEsiSlab(payload).subscribe({
  //     next: (res: any) => {

  //       this.isLoading = false;

  //       if (res?.StatusCode === 200) {

  //         const msg = res?.Data?.response;

  //         if (msg?.toLowerCase().startsWith('failed')) {
  //           alert(msg);
  //           return;
  //         }

  //         alert(msg || 'ESI Slab saved successfully');
  //         this.dialogRef.close(true);

  //       } else {
  //         alert(res?.Message || 'Save failed');
  //       }
  //     },
  //     error: () => {
  //       this.isLoading = false;
  //       alert('API Error');
  //     }
  //   });
  // }
  SaveClick(): void {

    // RESET VALIDATIONS
    this.val_paycode = false;
    this.val_disability = false;
    this.val_effectiveDate = false;

    this.isLoading = true;

    let hasError = false;

    // PAY CODE VALIDATION (NO ALERT)
    if (!this.selectedPayCode) {
      this.val_paycode = true;
      hasError = true;
    }

    // DISABILITY VALIDATION (NO ALERT)
    if (this.disability === null || this.disability === undefined) {
      this.val_disability = true;
      hasError = true;
    }

    // EFFECTIVE DATE VALIDATION (NO ALERT)
    if (!this.effectiveDate) {
      this.val_effectiveDate = true;
      hasError = true;
    }

    // STOP IF ANY OF ABOVE FAILED
    if (hasError) {
      this.isLoading = false;
      return;
    }


    if (!this.uploadedData || this.uploadedData.length === 0) {
      alert('Please add at least one slab row');
      this.isLoading = false;
      return;
    }

    const payload = {
      mode: 'Add',
      CreatedBy: this.userdetail?.user_Id?.toString(),
      ESISlab: {
        ESI_Slab_Id: 0,
        Paycode_Id: Number(this.selectedPayCode),
        Effective_Date: this.effectiveDate
      },
      ESISlabDetail: this.uploadedData.map((r: any) => ({
        From_Value: String(r.fromValue ?? 0),
        To_Value: String(r.toValue ?? 0),
        Criteria: String(r.criteria ?? ''),
        Criteria_Type_Id: Number(r.criteriaType),
        ESI_Slab_Detail_Id: 0
      }))
    };

    console.log('CORRECT PAYLOAD:', JSON.stringify(payload));

    this.esiService.CreateUpdateDeleteEsiSlab(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        if (res?.StatusCode === 200) {
          const msg = res?.Data?.response;
          alert(msg || 'ESI Slab saved successfully'); // ✅ API ALERT
          this.dialogRef.close(true);
        } else {
          alert(res?.Message || 'Save failed'); // ✅ API FAIL ALERT
        }
      },
      error: () => {
        this.isLoading = false;
        alert('API Error');
      }
    });
  }



  UpdateClick(): void {

    this.isLoading = true;

    if (!this.selectedPayCode) {
      alert('Please select the Paycode');
      this.isLoading = false;
      return;
    }

    if (!this.effectiveDate) {
      alert('Please select the Effective Date');
      this.isLoading = false;
      return;
    }

    if (!this.uploadedData || this.uploadedData.length === 0) {
      alert('Please add at least one slab row');
      this.isLoading = false;
      return;
    }

    const payload = {
      mode: 'Edit',
      CreatedBy: this.userdetail?.user_Id?.toString(),

      ESISlab: {
        ESI_Slab_Id: this.editSlabRow.ESI_Slab_Id,
        Paycode_Id: Number(this.selectedPayCode),
        Effective_Date: this.effectiveDate
      },

      ESISlabDetail: this.uploadedData.map((r: any) => ({
        From_Value: String(r.fromValue ?? 0),
        To_Value: String(r.toValue ?? 0),
        Criteria: String(r.criteria ?? ''),
        Criteria_Type_Id: Number(r.criteriaType),


        ESI_Slab_Detail_Id: r.ESI_Slab_Detail_Id || 0
      }))
    };

    console.log('EDIT PAYLOAD:', JSON.stringify(payload, null, 2));

    this.esiService.CreateUpdateDeleteEsiSlab(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        if (res?.StatusCode === 200) {

          const msg = res?.Data?.response;

          if (msg?.toLowerCase().startsWith('failed')) {
            alert(msg);
            return;
          }

          alert(msg || 'ESI Slab updated successfully');
          this.dialogRef.close('updated');

        } else {
          alert(res?.Message || 'Update failed');
        }
      },
      error: () => {
        this.isLoading = false;
        alert('API Error');
      }
    });
  }

  patchEditSlab(row: any): void {
    console.log("row", row);

    // ===== HEADER =====
    this.selectedPayCode = row.Paycode_Id;
    this.disability = row.Disability ?? 0;
    this.effectiveDate = row.Effective_Date?.substring(0, 10);

    const pay = this.payCodeList.find(p => p.paycode_Id == row.Paycode_Id);
    if (pay) {
      this.description = pay.description;
      this.printAs = pay.print_As;
    }

    // ===== TABLE DATA =====
    this.uploadedData = [{
      slNo: Number(row.SNo),
      fromValue: Number(row.From_Value),
      toValue: Number(row.To_Value),
      criteria: Number(row.Criteria),
      criteriaType: Number(row.Criteria_Type_Id),
    }];

    this.uploadedDataSource.data = [...this.uploadedData];



    this.uploadedDataSource.data = this.uploadedData;


  }

  onClose(): void {
    this.dialogRef.close();
  }
  BindBlockTypes(): void {
    this.esiService.GetBlocks().subscribe({
      next: (res: any) => {
        this.blockTypeList = res?.Data ?? [];
      },
      error: err => {
        console.error('Error loading block types', err);
      }
    });
  }
  BindMonths(): void {
    this.esiService.GetMonths().subscribe({
      next: (res: any) => {
        this.monthList = res?.Data ?? [];
      },
      error: err => {
        console.error('Error loading months', err);
      }
    });
  }
  SaveESIBlockClick(): void {

    // RESET VALIDATION
    this.val_blockEffectiveDate = false;

    this.isLoading = true;

    let hasError = false;

    // EFFECTIVE DATE VALIDATION (NO ALERT)
    if (!this.blockEffectiveDate) {
      this.val_blockEffectiveDate = true;
      hasError = true;
    }

    // STOP ONLY FOR DATE VALIDATION
    if (hasError) {
      this.isLoading = false;
      return;
    }

    // TABLE ROW VALIDATION (ALERT REQUIRED)
    if (!this.esiBlockData || this.esiBlockData.length === 0) {
      alert('Please add at least one block row');
      this.isLoading = false;
      return;
    }

    const invalidRow = this.esiBlockData.find(r => !r.block || !r.month);
    if (invalidRow) {
      alert('Please select Block and Month in all rows');
      this.isLoading = false;
      return;
    }

    // yyyy-MM-dd → dd/MM/yyyy
    const [year, month, day] = this.blockEffectiveDate!.split('-');

    const effectiveDate = `${day}/${month}/${year}`;

    const payload = {
      mode: 'Add',
      CreatedBy: this.userdetail?.user_Id?.toString(),
      main: {
        Effectivedate: effectiveDate,
        ESIBlockId: '0',
        ESIBlockDetailsResponse: {
          ESIBlockDetails: this.esiBlockData.map((r: any) => ({
            ESIBlockDetailsId: '0',
            BlockTypeId: r.block,
            FrequencyId: r.month
          }))
        }
      }
    };

    console.log('ESI BLOCK SAVE PAYLOAD:', JSON.stringify(payload, null, 2));

    this.esiService.CreateUpdateDeleteEsiblock(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        if (res?.StatusCode === 200) {
          alert(res?.Data?.response || 'ESI Block saved successfully');
          this.dialogRef.close(true);
        } else {
          alert(res?.Message || 'Save failed');
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Save API Error:', err);
        alert('Save API Error');
      }
    });
  }



  patchEditESIBlock(row: any): void {
    console.log('EDIT ESI BLOCK ROW:', row);
    this.editEsiBlockRow = row;

    this.blockEffectiveDate = this.apiToInputDate(row.Financial_Year_name);

    this.esiBlockData = [{
      slNo: row.Serial_No ?? 1,
      block: Number(row.Block_Type_Id),
      month: Number(row.Frequency_Id),
      // Bind the correct ESI_Block_Details_Id here
      ESIBlockDetailsId: row.ESI_Block_Details_Id
    }];

    this.esiBlockDataSource.data = [...this.esiBlockData];

    // paginator assignment (safe, no timeout)
    this.esiBlockDataSource.paginator = this.paginator;

    console.log('PATCHED BLOCK:', this.esiBlockData[0].block);
  }

  UpdateESIBlockClick(): void {

    this.isLoading = true;

    if (!this.blockEffectiveDate) {
      alert('Please select Effective Date');
      this.isLoading = false;
      return;
    }

    if (!this.esiBlockData || this.esiBlockData.length === 0) {
      alert('Please add at least one block row');
      this.isLoading = false;
      return;
    }

    // yyyy-MM-dd → dd/MM/yyyy
    const [year, month, day] = this.blockEffectiveDate.split('-');
    const effectiveDate = `${day}/${month}/${year}`;

    const payload = {
      mode: 'Update',
      CreatedBy: this.userdetail?.user_Id?.toString(),

      main: {
        Effectivedate: effectiveDate,
        ESIBlockId: String(this.editEsiBlockRow.ESI_Block_Id),
        ESIBlockDetailsResponse: {
          ESIBlockDetails: this.esiBlockData.map((r: any) => ({
            ESIBlockDetailsId: String(r.ESIBlockDetailsId || '0'),
            BlockTypeId: String(r.block),
            FrequencyId: String(r.month)
          }))
        }
      }
    };

    console.log('EDIT ESI BLOCK PAYLOAD:',
      JSON.stringify(payload, null, 2));

    this.esiService.CreateUpdateDeleteEsiblock(payload).subscribe({
      next: (res: any) => {

        this.isLoading = false;

        if (res?.StatusCode === 200) {
          alert(res?.Data?.response);
          this.dialogRef.close('updated');
        } else {
          alert(res?.Message);
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('UPDATE API ERROR:', err);
        alert('Update API Error');
      }
    });
  }


  BindStates(): void {
    this.esiService.GetStates().subscribe({
      next: (res: any) => {
        this.stateList = res?.Data ?? [];
      },
      error: err => {
        console.error('Error loading states', err);
        this.stateList = [];
      }
    });
  }
  // BindCity(stateId: number): void {
  //   this.esiService.GetCity(stateId).subscribe({
  //     next: (res: any) => {
  //       console.log('City API response:', res);
  //       this.cityList = res?.Data ?? [];
  //       this.selectedCityId = null;
  //     },
  //     error: err => {
  //       console.error('Error loading city', err);
  //       this.cityList = [];
  //     }

  //   });
  // }
  BindCity(stateId: number, cityId?: number): void {
    this.esiService.GetCity(stateId).subscribe({
      next: (res: any) => {
        console.log('City API response:', res);

        this.cityList = res?.Data ?? [];
        if (cityId) {
          this.selectedCityId = cityId;
        }
      },
      error: err => {
        console.error('Error loading city', err);
        this.cityList = [];
      }
    });
  }

  onStateChange(): void {
    if (!this.selectedStateId) {
      this.cityList = [];
      this.selectedCityId = null;
      return;
    }

    this.BindCity(this.selectedStateId);
  }
  addLocation(): void {
    if (this.Edit) {
      alert('Cannot add new row in Edit mode');
      return;
    }

    this.uploadedData.push({
      slNo: this.uploadedData.length + 1,
      fromValue: null,
      toValue: null,
      criteria: null,
      criteriaType: null,
    });

    this.uploadedDataSource.data = [...this.uploadedData];
  }

  deleteLocationRow(): void {

    if (this.selectedRowIndex === null) {
      alert('Please select a row to delete');
      return;
    }

    if (!confirm('Are you sure you want to delete this row?')) {
      return;
    }

    this.uploadedData.splice(this.selectedRowIndex, 1);

    // Recalculate Sl No
    this.uploadedData.forEach((row, i) => row.slNo = i + 1);

    this.uploadedDataSource.data = [...this.uploadedData];
    this.selectedRowIndex = null;
  }
  selectLocationRow(index: number): void {
    this.selectedRowIndex = index;
  }

  private formatToDDMMYYYY(date: string | null): string | null {
    if (!date) return null;

    // expected input: yyyy-MM-dd
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  SaveESILocationClick(): void {

    if (!this.selectedPayCode) {
      alert('Please select Paycode');
      return;
    }

    if (!this.locFromDate) {
      alert('Please select From Date');
      return;
    }

    if (!this.selectedStateId) {
      alert('Please select State');
      return;
    }

    if (!this.selectedCityId) {
      alert('Please select City');
      return;
    }

    if (!this.uploadedData || this.uploadedData.length === 0) {
      alert('Please add at least one slab row');
      return;
    }

    /* ================= PAYLOAD (BACKEND-CORRECT) ================= */

    const payload = {
      mode: 'Add',
      CreatedBy: this.userdetail?.user_Id?.toString(),

      ESILocationSlab: {
        ESI_Location_Slab_Id: 0,

        // 🔥 IMPORTANT: DATE FORMAT FIX
        From_Date: this.formatToDDMMYYYY(this.locFromDate),
        To_Date: this.formatToDDMMYYYY(this.locToDate),

        Paycode_Id: Number(this.selectedPayCode),
        State_ID: Number(this.selectedStateId),
        City_ID: Number(this.selectedCityId)
      },

      ESILocationSlabDetails: this.uploadedData.map((r: any) => ({
        From_Value: String(r.fromValue ?? 0),
        To_Value: String(r.toValue ?? 0),
        Criteria: String(r.criteria ?? ''),
        Criteria_Type_Id: Number(r.criteriaType),
        ESI_Location_Slab_Detail_id: 0
      }))
    };

    console.log('ESI LOCATION SAVE PAYLOAD (FINAL):', JSON.stringify(payload, null, 2));

    /* ================= API CALL ================= */

    this.esiService.CreateUpdateDeleteEsiLocationSlab(payload).subscribe({
      next: (res: any) => {

        if (res?.StatusCode === 200) {

          const msg = res?.Data?.response || res?.Data?.message;

          if (msg && msg.toLowerCase().includes('failed')) {
            alert(msg);
            return;
          }

          alert(msg || 'ESI Location Slab saved successfully');
          this.dialogRef.close(true);

        } else {
          alert(res?.Message || 'Save failed');
        }
      },
      error: () => {
        alert('API Error');
      }
    });
  }
  private apiToInputDate(date: string | null): string | null {
    if (!date) return null;
    const [day, month, year] = date.split('/');
    return `${year}-${month}-${day}`;
  }

  private inputToApiDate(date: string | null): string | null {
    if (!date) return null;
    const [year, month, day] = date.split('-');
    return `${day}/${month}/${year}`;
  }

  UpdateESILocationClick(): void {

    const row = this.editSlabRow;

    const payload = {
      mode: 'Edit',
      CreatedBy: this.userdetail?.user_Id?.toString(),

      ESILocationSlab: {
        ESI_Location_Slab_Id: row.ESI_Location_Slab_Id,
        From_Date: this.inputToApiDate(this.locFromDate),
        To_Date: this.inputToApiDate(this.locToDate),
        Paycode_Id: Number(this.selectedPayCode),
        State_ID: Number(this.selectedStateId),
        City_ID: Number(this.selectedCityId)
      },

      ESILocationSlabDetails: this.uploadedData.map(r => ({
        From_Value: String(r.fromValue ?? 0),
        To_Value: String(r.toValue ?? 0),
        Criteria: String(r.criteria ?? ''),
        Criteria_Type_Id: Number(r.criteriaType),
        ESI_Location_Slab_Detail_id: row.ESI_location_Slab_Detail_Id
      }))
    };

    console.log('EDIT LOCATION PAYLOAD:', JSON.stringify(payload));

    this.esiService.CreateUpdateDeleteEsiLocationSlab(payload).subscribe({
      next: (res: any) => {

        console.log('UPDATE LOCATION RESPONSE:', res);

        if (res?.StatusCode === 200) {

          const msg =
            res?.Data?.response ||
            res?.Data?.message;

          alert(msg);
          this.dialogRef.close('updated');
        }
        else {
          alert(res?.Message || 'Update failed');
        }
      },
      error: () => {
        alert('API Error');
      }
    });
  }


  patchEditESILocation(row: any): void {
    console.log('EDIT LOCATION ROW:', row);

    this.selectedPayCode = row.Paycode_Id;
    this.locFromDate = this.apiToInputDate(row.From_Date);
    this.locToDate = this.apiToInputDate(row.To_Date);

    this.selectedStateId = row.State_Id;
    this.BindCity(row.State_Id, row.City_Id);
    const pay = this.payCodeList.find(p => p.paycode_Id == row.Paycode_Id);
    if (pay) {
      this.description = pay.description;
      this.printAs = pay.print_As;
    }

    this.uploadedData = [{
      slNo: row.SNo,
      fromValue: row.From_Value,
      toValue: row.To_Value,
      criteria: row.Criteria,
      criteriaType: row.Criteria_Type_Id
    }];

    this.uploadedDataSource.data = this.uploadedData;
  }

}
