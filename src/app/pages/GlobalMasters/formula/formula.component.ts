import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddFormulasComponent } from '../add-formulas/add-formulas.component';
import { PaycodeComponent } from "../../../common/paycode/paycode.component";
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import { FormualService } from '../../../Service/GlobalMasters/formula.service';
import { IFormulaRepository } from '../../../Repository/GlobalMasters/IFormulaRepository';
import { MatCardModule } from "@angular/material/card";
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

export const Formula_TOKEN = new InjectionToken<IFormulaRepository>('Formula_TOKEN');

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginator, PaycodeComponent, MatCardModule, AlertpopupComponent],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.css',
  providers: [{
    provide: Formula_TOKEN,
    useClass: FormualService,
  }
  ]
})
export class FormulaComponent {
  uploadedData: any[] = [];
  showTable: boolean = false;

  paycodeUI: any;
  userdetail: any;

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';


  uploadDisplayedColumns: string[] = [
    'Action',
    // 'Formula_Id',
    'SI No',
    'Company Code',
    'Pay Category',
    'Formula Name',
    'Formula'
  ];

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(private dialog: MatDialog,
    @Inject(Formula_TOKEN) private formula: IFormulaRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }


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
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.paycodeUI = {
      "paycode_Id": 0,
      "paycode_Code": "",
      "description": ""
    }

  }

  handlePaycodeEvent(paycode: any) {
    this.paycodeUI = paycode;
  }


  onSearchClick() {
    this.showTable = true;
    this.isLoading = true;
    this.BindDashBoard(this.paycodeUI.paycode_Id);
  }

  BindDashBoard(paycode_Id: number) {
    this.formula.GetFormulaSearch(paycode_Id).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        this.uploadedDataSource = new MatTableDataSource<any>(res.Data.data.Table0);
        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }
  exportToExcel() {
    this.isLoading = true;
    const data = this.uploadedDataSource.data;
    if (!data || data.length === 0) {
      alert("No data available to export");
      this.isLoading = false;
      return;
    }
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Formula");
    const today = new Date().toISOString().split('T')[0];
    const fileName = `Formula_${today}.xlsx`;
    XLSX.writeFile(wb, fileName);
    this.isLoading = false;
  }

  AddPOOpen() {
    this.dialog.open(AddFormulasComponent, {
      width: '40%',
      height: '54vh',
      disableClose: true,
      data: { mode: 'add' }
    });
  }

  openEdit(row: any) {
    const dialogRef = this.dialog.open(AddFormulasComponent, {
      width: '40%',
      height: '54vh',
      disableClose: true,
      data: { mode: 'edit', row: row }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.onSearchClick();
      }
    });
  }
  deleteFormula(row: any) {

    this.isLoading = true;
    if (!row) {
      alert("Please select a row to delete.");
      this.isLoading = false;
      return;
    }


    const confirmDelete = confirm("Are you sure you want to delete this row?");
    if (!confirmDelete) {
      this.isLoading = false;
      return;
    }
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Delete",

      detail: {
        Formula_Id: row.Formula_Id,
        Paycode_Id: 0,
        Paycode_Code: "",
        Formula_Name: "",
        Formula: "",
        Company_Id: 0,
        Company_Code: "",
        PayCategory_Id: 0,
        Paycateory: "",
        Error_Message: "",
        SNo: 0
      }
    };
    this.formula.CreateFormula(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          this.showAlertPopup(res?.Data?.message || "Formula Deleted successfully");
          this.onSearchClick();
        } else {
          alert("Delete failed");
          this.isLoading = false;
        }
      },
      error: () => {
        this.isLoading = false;
        alert("Failed");
      }
    });

  }


}


