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


import FileSaver from 'file-saver';
import * as XLSX from 'xlsx';
import { FormualService } from '../../../Repository/GlobalMasters/formula.service';
import { IFormulaRepository } from '../../../Repository/GlobalMasters/IFormulaRepository';

export const Formula_TOKEN = new InjectionToken<IFormulaRepository>('Formula_TOKEN');

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginator, PaycodeComponent],
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
  constructor(private dialog: MatDialog,
    @Inject(Formula_TOKEN) private formula: IFormulaRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }
  isLoading = false;
  paycodeUI: any;
  userdetail: any;


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
    console.log(this.paycodeUI);
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
        console.log(res.Data.data.Table0);
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

    const data = this.uploadedDataSource.data;
    if (!data || data.length === 0) {
      alert("No data available to export");
      return;
    }


    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);


    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Formula");


    const today = new Date().toISOString().split('T')[0];
    const fileName = `Formula_${today}.xlsx`;


    XLSX.writeFile(wb, fileName);

    alert("Excel exported successfully!");
  }

  AddPOOpen() {
    this.dialog.open(AddFormulasComponent, {
      width: '50%',
      height: '60vh',
      disableClose: true,
      data: { mode: 'add' }
    });
  }

  openEdit(row: any) {
    const dialogRef = this.dialog.open(AddFormulasComponent, {
      width: '50%',
      height: '60vh',
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


    // if (!row) {
    //   alert("Please select a row to delete.");
    //   return;
    // }


    const confirmDelete = confirm("Are you sure you want to delete this row?");
    if (!confirmDelete) {
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

    console.log("DELETE PAYLOAD:", JSON.stringify(payload));


    this.formula.CreateFormula(payload).subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Formula Deleted successfully");
          this.onSearchClick();
        } else {
          alert("Delete failed");
        }
      },
      error: () => alert("Failed")
    });

  }


}


