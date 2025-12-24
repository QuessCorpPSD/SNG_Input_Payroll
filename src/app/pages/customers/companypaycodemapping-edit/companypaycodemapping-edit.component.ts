import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanypaycodemappingService } from '../../../Service/customersserv/companypaycodemapping.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { ICompanypaycodemapping } from '../../../Repository/customer/ICompanypaycodemapping';
export const Pay_TOKEN = new InjectionToken<ICompanypaycodemapping>('Pay_TOKEN');

@Component({
  selector: 'app-companypaycodemapping-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatPaginatorModule, MatTableModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, AlertpopupComponent],
  templateUrl: './companypaycodemapping-edit.component.html',
  styleUrl: './companypaycodemapping-edit.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CompanypaycodemappingService,
    }
  ]
})
export class CompanypaycodemappingEditComponent {

  companypaycodeform!: FormGroup;
  selectedCompanyId: any;
  selectedCompanyCode: any;

  isFirstAddClick: boolean = true;
  paycodeList: any[] = [];
  pickfromlist: any[] = [];

  uploadDisplayedColumns: string[] = ['SNo', 'Paycode', 'Description', 'Paytype', 'formula', 'taxable', 'LopApplicable', 'PfApplicable', 'Earnedpaycode', 'Pickfrom'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  selectedRowIndex: number | null = null;

  popupMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  userdetail!: any;

  @ViewChild('paginator') paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanypaycodemappingEditComponent>,
    private dialog: MatDialog,
    @Inject(Pay_TOKEN) private paycodeService: ICompanypaycodemapping,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
  ) { }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.selectedCompanyId = this.data.companyId;
    this.selectedCompanyCode = this.data.companyCode;

    this.companypaycodeform = this.fb.group({
      companycode: [{ value: this.selectedCompanyCode, disabled: true }]
    });

    this.loadPaycodes();
    this.loadPickFrom();
    this.loadMappingTable();
  }

  ngAfterViewInit(): void {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company: any) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  selectRow(index: number) {
    if (this.paginator) {
      this.selectedRowIndex = index + (this.paginator.pageIndex * this.paginator.pageSize);
    } else {
      this.selectedRowIndex = index;
    }
  }


  AddPOOpen(): void {
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }
    this.addEmptyRow();
  }
  refreshTable() {
    this.uploadedDataSource.data = [...this.uploadedData];

    // Reassign paginator to ensure it works correctly after adding rows
    if (this.paginator) {
      this.uploadedDataSource.paginator = this.paginator;
    }
  }

  createEmptyRow(): any {
    return {
      SNo: null,
      Paycode_Id: null,
      Paycode_Code: '',
      Description: '',
      PayType: '',
      Formula: '',
      Taxable: '',
      LOP_Applicable: '',
      PF_Applicable: '',
      ESI_Applicable: '',
      PT_Applicable: '',
      EarnedPaycode_Code: '',
      Company_Paycode_Pick_From_Id: null,
      Company_Paycode_Pick_From_Value: '',
      Company_Paycode_Mapping_Detail_Id: 0,
      isEmpty: true
    };
  }
  recalculateSNo(): void {
    this.uploadedData.forEach((row, index) => {
      row.SNo = index + 1;
    });
  }


  addEmptyRow(): void {
    const emptyRow = this.createEmptyRow();
    this.recalculateSNo();
    this.uploadedData.push(emptyRow);
    this.refreshTable();
  }

  insertRow(): void {
    if (this.selectedRowIndex === null) {
      alert("Please select a row to insert above.");
      return;
    }

    const emptyRow = this.createEmptyRow();

    this.uploadedData.splice(this.selectedRowIndex, 0, emptyRow);
    this.recalculateSNo();

    this.refreshTable();
    this.selectedRowIndex = null;
  }

  getAbsoluteIndex(pageRelativeIndex: number): number {
    return pageRelativeIndex + (this.paginator.pageIndex * this.paginator.pageSize);
  }

  onPaycodeSelect(paycodeId: number, pageRelativeIndex: number) {
    const rowIndex = this.getAbsoluteIndex(pageRelativeIndex);
    const selectedPaycode = this.paycodeList.find(pc => pc.Paycode_Id === paycodeId);

    if (!selectedPaycode) return;

    const row = this.uploadedData[rowIndex];
    row.Paycode_Id = selectedPaycode.Paycode_Id;
    row.Paycode_Code = selectedPaycode.Paycode_Code;
    row.Description = selectedPaycode.Description;
    row.PayType = selectedPaycode.PayType;
    row.Formula = selectedPaycode.Formula;
    row.Taxable = selectedPaycode.IsTaxable;
    row.LOP_Applicable = selectedPaycode.Is_LOP_Applicable;
    row.PF_Applicable = selectedPaycode.Is_PF_Applicable;

    if (selectedPaycode.Is_LOP_Applicable) {
      row.EarnedPaycode_Code = 'E' + selectedPaycode.Paycode_Code;
    } else {
      row.EarnedPaycode_Code = selectedPaycode.EarnedPaycode_Code;
    }


    row.Company_Paycode_Pick_From_Id = selectedPaycode.Company_Paycode_Pick_From_Id;
    row.Company_Paycode_Pick_From_Value = selectedPaycode.Company_Paycode_Pick_From_Value;
    row.isEmpty = false;

    this.uploadedDataSource.data = [...this.uploadedData];
  }


  onPickFromSelect(selectedId: number, pageRelativeIndex: number) {
    const rowIndex = this.getAbsoluteIndex(pageRelativeIndex);
    const row = this.uploadedData[rowIndex];
    const selected = this.pickfromlist.find(x => x.Company_Paycode_Pick_From_Id === selectedId);

    row.Company_Paycode_Pick_From_Id = selectedId;
    row.Company_Paycode_Pick_From_Value = selected?.Company_Paycode_Pick_From_Value || '';

    this.uploadedDataSource.data = [...this.uploadedData];
  }

  deleteSelectedRow(): void {
    if (this.selectedRowIndex === null) {
      alert("Please select a row to delete.");
      return;
    }

    this.uploadedData.splice(this.selectedRowIndex, 1);
    this.recalculateSNo();
    this.refreshTable();
    this.selectedRowIndex = null;
  }


  loadPaycodes() {

    const payload = {
      "paycode_Code": '',
      "PayTypeId": 0,
      "IsTaxable": 0,
      "PayId": 0

    }
    this.paycodeService.paycodeSearch(payload).subscribe({
      next: (res: any) => {
        if (res?.Data?.data) {
          this.paycodeList = res.Data.data.Table0;
        }
      },
      error: (err) => console.error("Paycode API Error", err)
    });
  }

  loadPickFrom() {
    this.paycodeService.Pickfrom().subscribe({
      next: (res: any) => {
        if (res?.Data?.data?.Table0) {
          this.pickfromlist = res.Data.data.Table0;
        }
      },
      error: (err) => console.error("Pick From API Error", err)
    });
  }

  loadMappingTable() {
    this.paycodeService.companypaycodesearch(this.selectedCompanyId).subscribe({
      next: (res: any) => {
        if (res?.Data?.data) {
          this.uploadedData = res.Data.data.map((row: any) => ({
            ...row,
            isEmpty: false
          }));
          this.refreshTable();
        }
      },
      error: (err) => console.error("Mapping table load error", err)
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }

  savePaycodeDetails(): void {
    this.isLoading = true;

    const paycodeDetail = this.uploadedDataSource.data.map((row, index) => ({
      Paycode_Id: row.Paycode_Id ?? 0,
      EarnedPaycode_Code: row.EarnedPaycode_Code ?? '',
      Company_Paycode_Pick_From_Id: row.Company_Paycode_Pick_From_Id ?? 0,
      Company_Paycode_Mapping_Detail_Id: row.Company_Paycode_Mapping_Detail_Id ?? 0,
      SNo: row.SNo,
      Formula: row.Formula ?? null
    }));

    const payload = {
      Company_Id: this.selectedCompanyId,
      User_Id: this.userdetail.user_Id,
      Mode: "Edit",
      PaycodeDetail: paycodeDetail
    };

    this.paycodeService.PostAddPaycodeMapping(payload).subscribe({
      next: (res) => {
        const parsedData = JSON.parse(res.Data);
        const msg = parsedData[0].message;

        if (msg.toLowerCase().includes("success")) {
          alert("Company Paycode Mapping Saved Successfully");
        } else {
          alert(msg);
        }
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Error saving:", err);
        this.isLoading = false;
      }
    });
  }


  trackBySNo(index: number, item: any) {
    return item.SNo ?? index;
  }
}