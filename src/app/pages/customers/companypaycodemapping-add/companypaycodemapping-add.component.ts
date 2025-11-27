import { Component, ViewChild } from '@angular/core';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { MatCardModule } from "@angular/material/card";
import { MatIconModule } from "@angular/material/icon";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanypaycodemappingAddAddComponent } from '../companypaycodemapping-add-add/companypaycodemapping-add-add.component';
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatSelectModule } from "@angular/material/select";
import { CompanypaycodemappingService } from '../../../Service/customersserv/companypaycodemapping.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { error } from 'console';

@Component({
  selector: 'app-companypaycodemapping-add',
  standalone: true,
  imports: [CompanyallComponent, MatCardModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule, MatPaginatorModule, MatTableModule, MatTooltipModule, MatFormFieldModule, MatSelectModule, AlertpopupComponent],
  templateUrl: './companypaycodemapping-add.component.html',
  styleUrl: './companypaycodemapping-add.component.css'
})
export class CompanypaycodemappingAddComponent {

  companypaycodeform!: FormGroup;
  selectedCompanyId: any;
  selectedCompanyCode: any;

  isFirstAddClick: boolean = true;
  paycodeList: any[] = [];   // ← NEW
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  uploadDisplayedColumns: string[] = ['SNo', 'Paycode', 'Description', 'Paytype', 'taxable', 'LopApplicable', 'PfApplicable', 'ESIApplicable', 'PTApplicable', 'Earnedpaycode', 'Pickfrom'];
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  selectedRowIndex: number | null = null;
  pickfromlist: any;
  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading: boolean = false;
  userdetail!: any;

  selectRow(index: number) {
    this.selectedRowIndex = index;
  }

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanypaycodemappingAddComponent>,
    private dialog: MatDialog,
    private paycodeService: CompanypaycodemappingService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }


  onClose(): void {
    this.dialogRef.close();

  }

  handleCompanyEvent(company: any): void {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }
  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
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
      Paycode_Code: "",
      Description: "",
      PayType: "",
      IsTaxable: "",
      Is_LOP_Applicable: "",
      Is_PF_Applicable: "",
      Is_ESI_Applicable: "",
      Is_PT_Applicable: "",
      Earnedpaycode: "",
      isEmpty: true   // REQUIRED
    };

    this.uploadedData.push(emptyRow);
    this.uploadedDataSource.data = [...this.uploadedData];
  }
  ngOnInit() {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.loadPaycodes();
    this.loadPickFrom();
  }

  AddPOOpen(): void {
    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      return;
    }

    const dialogRef = this.dialog.open(CompanypaycodemappingAddAddComponent, {
      width: '50%',
      height: '90vh',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe((selectedRows: any[]) => {
      if (selectedRows && selectedRows.length > 0) {
        selectedRows.forEach(row => this.addSelectedRow(row));
      }
    });
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
      this.uploadedData[rowIndex].Paycode_Id = selectedPaycode.Paycode_Id;
      this.uploadedData[rowIndex].Paycode_Code = selectedPaycode.Paycode_Code;
      this.uploadedData[rowIndex].Description = selectedPaycode.Description;
      this.uploadedData[rowIndex].PayType = selectedPaycode.PayType;
      this.uploadedData[rowIndex].IsTaxable = selectedPaycode.IsTaxable;
      this.uploadedData[rowIndex].Is_LOP_Applicable = selectedPaycode.Is_LOP_Applicable;
      this.uploadedData[rowIndex].Is_PF_Applicable = selectedPaycode.Is_PF_Applicable;
      this.uploadedData[rowIndex].Is_ESI_Applicable = selectedPaycode.Is_ESI_Applicable;
      this.uploadedData[rowIndex].Is_PT_Applicable = selectedPaycode.Is_PT_Applicable;
      this.uploadedData[rowIndex].Earnedpaycode = selectedPaycode.Earnedpaycode;

      this.uploadedDataSource.data = [...this.uploadedData];
    }
  }

  onPickfromSelect(Company_Paycode_Pick_From_Id: number, rowIndex: number) {
    const selectedPickfrom = this.pickfromlist.find(pc => pc.Company_Paycode_Pick_From_Id === Company_Paycode_Pick_From_Id);

    if (selectedPickfrom) {
      this.uploadedData[rowIndex].Company_Paycode_Pick_From_Id = selectedPickfrom.Company_Paycode_Pick_From_Id;

      this.uploadedDataSource.data = [...this.uploadedData];
    }
  }

  insertRow() {
    if (this.selectedRowIndex === null) {
      alert("Please select a row to insert above.");
      return;
    }

    const emptyRow = {
      Paycode_Code: '',
      Description: '',
      PayType: '',
      IsTaxable: '',
      Is_LOP_Applicable: '',
      Is_PF_Applicable: '',
      Is_ESI_Applicable: '',
      Is_PT_Applicable: '',
      Earnedpaycode: '',
      isEmpty: true
    };

    // Insert above the selected row
    this.uploadedData.splice(this.selectedRowIndex, 0, emptyRow);

    // Update table datasource
    this.uploadedDataSource.data = [...this.uploadedData];

    // Move selection to new empty row
    this.selectedRowIndex = null;
  }

  savePaycodeDetails() {
    this.isLoading = true;
    const paycodeDetail = this.uploadedDataSource.data.map(row => ({
      Paycode_Id: row.Paycode_Id,
      EarnedPaycode_Code: row.EarnedPaycode_Code ?? '',
      Company_Paycode_Pick_From_Id: row.Company_Paycode_Pick_From_Id,
      SNo: row.SNo
    }));

    const payloadCreate = {
      Company_Id: this.selectedCompanyId,
      User_Id: this.userdetail.user_Id,
      Mode: "Add",
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
          this.popupMessage = "Company Paycode Mapping Created Successfully";
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

