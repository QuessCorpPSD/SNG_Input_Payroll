import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanypaycodemappingService } from '../../../Service/CUSTOMER/companypaycodemapping.service';
import { CompanypaycodemappingAddAddComponent } from '../companypaycodemapping-add-add/companypaycodemapping-add-add.component';
import { CompanypaycodemappingAddComponent } from '../companypaycodemapping-add/companypaycodemapping-add.component';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

@Component({
  selector: 'app-companypaycodemapping-edit',
  standalone: true,
  imports: [MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatPaginatorModule, MatTableModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, AlertpopupComponent],
  templateUrl: './companypaycodemapping-edit.component.html',
  styleUrl: './companypaycodemapping-edit.component.css'
})
export class CompanypaycodemappingEditComponent {

  companypaycodeform!: FormGroup;
  selectedCompanyId: any;
  selectedCompanyCode: any;

  isFirstAddClick: boolean = true;
  paycodeList: any[] = [];   // ← NEW
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uploadDisplayedColumns: string[] = ['SNo', 'Paycode', 'Description', 'Paytype', 'formula', 'taxable', 'LopApplicable', 'PfApplicable', 'ESIApplicable', 'PTApplicable', 'Earnedpaycode', 'Pickfrom'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  selectedRowIndex: number | null = null;
  pickfromlist: any;
  isLoading: boolean = false;
  userdetail: any;
  showPopup: boolean = false;
  popupMessage: string = "";

  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanypaycodemappingAddComponent>,
    private dialog: MatDialog,
    private paycodeService: CompanypaycodemappingService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  onClose(): void {
    this.dialogRef.close();
  }

  deleteSelectedRow() {
    if (this.selectedRowIndex === null) {
      alert("Please select a row to delete.");
      return;
    }

    this.uploadedData.splice(this.selectedRowIndex, 1);

    // Refresh table
    this.uploadedDataSource.data = [...this.uploadedData];

    // Reset selection
    this.selectedRowIndex = null;
  }
  addEmptyRow(): void {
    const emptyRow = {
      Paycode_Id: null,
      Paycode_Code: '',
      Description: '',
      PayType: '',
      Taxable: '',
      LOP_Applicable: '',
      PF_Applicable: '',
      ESI_Applicable: '',
      PT_Applicable: '',
      EarnedPaycode_Code: '',
      Company_Paycode_Pick_From_Id: null,
      Company_Paycode_Pick_From_Value: '',
      isEmpty: true
    };

    this.uploadedData.push(emptyRow);
    this.uploadedDataSource.data = [...this.uploadedData];
  }

  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.selectedCompanyId = this.data.companyId;
    this.selectedCompanyCode = this.data.companyCode;


    this.loadPaycodes();
    this.loadPickFrom();
    this.loadMappingTable();
    this.companypaycodeform = this.fb.group({
      companycode: [{ value: this.selectedCompanyCode, disabled: true }]
    });
  }

  AddPOOpen(): void {

    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    this.addEmptyRow();
  }

 loadPaycodes() {
    const payload = {
      paycode_Code: '',
      PayTypeId: 0,
      IsTaxable: 0,
      PayId: 0
    };
    this.paycodeService.paycodeSearch(payload).subscribe({
      next: (res: any) => {
        if (res?.Data?.data?.Table0) {
          this.paycodeList = res.Data.data.Table0;
        }
      },
      error: (err) => {
        console.error("Paycode API Error", err);
      }
    });
  }

  loadPickFrom() {
    this.paycodeService.Pickfrom().subscribe({
      next: (res: any) => {
        if (res?.Data?.data?.Table0) {
          this.pickfromlist = res.Data.data.Table0;
        }
      },
      error: (err) => {
        console.error("Pick From API Error", err);
      }
    });
  }
  loadMappingTable() {
    this.paycodeService.companypaycodesearch(this.selectedCompanyId)
      .subscribe({
        next: (res: any) => {

          if (res?.Data?.data) {

            // Load API rows into table
            this.uploadedData = res.Data.data.map((row: any) => ({
              ...row,
              isEmpty: false    // mark rows as real rows
            }));

            this.uploadedDataSource.data = [...this.uploadedData];

            console.log(this.uploadedDataSource.data);

            // enable paginator
            setTimeout(() => {
              this.uploadedDataSource.paginator = this.paginator;
            });

          }
        },
        error: (err) => {
          console.error("Mapping table load error", err);
        }
      });
  }


  addSelectedRow(row: any): void {
    const existingRowIndex = this.uploadedData.findIndex(
      item => item.Paycode_Id === row.Paycode_Id
    );

    if (existingRowIndex === -1) {
      this.uploadedData.push(row);
      this.uploadedDataSource.data = [...this.uploadedData];
      this.uploadedDataSource.paginator = this.paginator;

    }
  }

  onPaycodeSelect(paycodeId: number, rowIndex: number) {

    const selectedPaycode = this.paycodeList.find(pc => pc.Paycode_Id === paycodeId);

    if (selectedPaycode) {

      this.uploadedData[rowIndex] = {
        ...this.uploadedData[rowIndex],
        Paycode_Id: selectedPaycode.Paycode_Id,
        Paycode_Code: selectedPaycode.Paycode_Code,
        Description: selectedPaycode.Description,
        PayType: selectedPaycode.PayType,
        Taxable: selectedPaycode.Taxable,
        LOP_Applicable: selectedPaycode.LOP_Applicable,
        PF_Applicable: selectedPaycode.PF_Applicable,
        ESI_Applicable: selectedPaycode.ESI_Applicable,
        PT_Applicable: selectedPaycode.PT_Applicable,
        EarnedPaycode_Code: selectedPaycode.EarnedPaycode_Code,
        Company_Paycode_Pick_From_Id: selectedPaycode.Company_Paycode_Pick_From_Id,
      };

      this.uploadedDataSource.data = [...this.uploadedData];
    }
  }


  insertRow() {
    if (this.selectedRowIndex === null) {
      alert("Please select a row to insert above.");
      return;
    }

    const emptyRow = {
      Paycode_Id: null,
      Paycode_Code: '',
      Description: '',
      PayType: '',
      Taxable: '',
      LOP_Applicable: '',
      PF_Applicable: '',
      ESI_Applicable: '',
      PT_Applicable: '',
      EarnedPaycode_Code: '',
      Company_Paycode_Pick_From_Id: null,
      Company_Paycode_Pick_From_Value: '',
      isEmpty: true
    };

    this.uploadedData.splice(this.selectedRowIndex, 0, emptyRow);
    this.uploadedDataSource.data = [...this.uploadedData];
    this.selectedRowIndex = null;
  }


  onPickFromSelect(selectedId: number, rowIndex: number): void {

    const selected = this.pickfromlist.find(x => x.Company_Paycode_Pick_From_Id == selectedId);

    this.uploadedData[rowIndex].Company_Paycode_Pick_From_Id = selectedId;
    this.uploadedData[rowIndex].Company_Paycode_Pick_From_Value = selected?.Company_Paycode_Pick_From_Value || '';

    this.uploadedDataSource.data = [...this.uploadedData];
  }

  closePopup() {
    this.showPopup = false;
  }

  savePaycodeDetails() {
    this.isLoading = true;
    const Company_Paycode_Mapping_Id = this.uploadedDataSource.data[0].Company_Paycode_Mapping_Id;
    const paycodeDetail = this.uploadedDataSource.data.map(row => ({
      Company_Paycode_Mapping_Detail_Id: row.Company_Paycode_Mapping_Detail_Id,
      Paycode_Id: row.Paycode_Id,
      EarnedPaycode_Code: row.EarnedPaycode_Code ?? '',
      Company_Paycode_Pick_From_Id: row.Company_Paycode_Pick_From_Id,
      SNo: row.SNo
    }));

    const payloadCreate = {
      Company_Id: this.selectedCompanyId,
      User_Id: this.userdetail.user_Id,
      Company_Paycode_Mapping_Id: Company_Paycode_Mapping_Id,
      Mode: "Edit",
      PaycodeDetail: paycodeDetail
    };

    console.log(payloadCreate);

    this.paycodeService.PostAddPaycodeMapping(payloadCreate).subscribe({
      next: (res) => {
        console.log(res);
        const parsedData = JSON.parse(res.Data.data);
        const errormsg = parsedData[0].Error_Message;

        if (errormsg.toLowerCase().includes("successfully")) {
          //alert(errormsg);
          this.showPopup = true;
          this.popupMessage = "Company Paycode Mapping Updated Successfully";
          this.isLoading = false;
        } else {
          alert(errormsg);
          this.isLoading = false;
        }
        error: (err) => {
          console.error("Error saving:", err);
          this.isLoading = false;
        }
      }
    });

  }
}
