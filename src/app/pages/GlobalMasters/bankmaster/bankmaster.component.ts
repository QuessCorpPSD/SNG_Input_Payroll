import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

import * as XLSX from 'xlsx';
import { BankmasteraddComponent } from '../bankmasteradd/bankmasteradd.component';
import { AddEditComponent } from '../add-edit/add-edit.component';
import { IBankRepository } from '../../../Repository/GlobalMasters/IBankrepository';
import { BankService } from '../../../Service/GlobalMasters/Bank.service';
import { MatCardModule } from "@angular/material/card";
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { finalize } from 'rxjs/operators';

export const Bank_TOKEN = new InjectionToken<IBankRepository>('Bank_TOKEN');

@Component({
  selector: 'app-bankmaster',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, MatCardModule, AlertpopupComponent],
  templateUrl: './bankmaster.component.html',
  styleUrl: './bankmaster.component.css',
  providers: [
    {
      provide: Bank_TOKEN,
      useClass: BankService,
    }
  ]
})
export class BankmasterComponent implements AfterViewInit {
  userdetail: any;
  EditbankForm: any;
  Editdata: any;
  dialogRef: any;

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  constructor(
    private dialog: MatDialog,
    @Inject(Bank_TOKEN) private bankService: IBankRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  showTable = false;
  uploadedData: any;

  uploadDisplayedColumns: string[] = [
    'Action',
    'slNo',
    'bankname',
    'digitlengthcondition',
    'bankacdigit',
    'swiftcode'
  ];

  uploadedDataSource = new MatTableDataSource<any>([]);

  filterValues = {
    Serial_No: '',
    Bank_Name: '',
    Digit_Length_Condition: '',
    Bank_Account_Number_Digits: '',
    IFSC_Treatment: ''
  };

  bankName: string = "";
  digitLength: string = "";
  ifscTreatment: string = "";

  @ViewChild(MatPaginator) paginator!: MatPaginator;

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
  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.setupFilterPredicate();
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in the session Storage');
    }
  }

  setupFilterPredicate() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);

      return (
        data.Bank_Name?.toLowerCase().includes(search.Bank_Name) &&
        data.Digit_Length_Condition?.toLowerCase().includes(search.Digit_Length_Condition) &&
        data.Bank_Account_Number_Digits?.toString().toLowerCase().includes(search.Bank_Account_Number_Digits) &&
        data.IFSC_Treatment?.toLowerCase().includes(search.IFSC_Treatment)
      );
    };
  }

  applyFilter() {
    this.filterValues = {
      Serial_No: '',
      Bank_Name: this.bankName.toLowerCase(),
      Digit_Length_Condition: this.digitLength.toLowerCase(),
      Bank_Account_Number_Digits: '',
      IFSC_Treatment: this.ifscTreatment.toLowerCase()
    };

    this.uploadedDataSource.filter = JSON.stringify(this.filterValues);
  }

  onsearch() {
    this.showTable = true;
    this.isLoading = true;
    this.bankService.Search().subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res) {
          const table = res?.Data?.data?.Table0 || [];

          if (!table.length) {
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
            alert("No data found.");
            return;
          }

          let filteredTable = table;

          if (this.bankName.trim() !== "") {
            const keyword = this.bankName.trim().toLowerCase();

            filteredTable = table.filter((row: any) =>
              row.Bank_Name?.toLowerCase().includes(keyword)
            );
          }

          this.uploadedData = filteredTable;
          this.uploadedDataSource.data = this.uploadedData;
          this.uploadedDataSource.paginator = this.paginator;
        } else {
          console.warn('Unexpected:', res);
          this.isLoading = false;
          alert('Unexpected API response. Check console.');
        }
      },
      error: (err) => {
        console.error('Error fetching GST slab data:', err);
        this.isLoading = false
      }
    });
  }

  exportToExcel() {
    this.isLoading = true;

    this.bankService.Search().subscribe({
      next: (res: any) => {
        const table = res?.Data?.data?.Table0 || [];

        if (!Array.isArray(table) || table.length === 0) {
          this.isLoading = false;
          alert("No data available to export!");
          return;
        }

        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(table);
        const wb: XLSX.WorkBook = XLSX.utils.book_new();

        XLSX.utils.book_append_sheet(wb, ws, "BankMaster");

        const timestamp = new Date().toISOString().split("T")[0];
        const fileName = `Bank_Master_${timestamp}.xlsx`;

        XLSX.writeFile(wb, fileName);
        this.isLoading = false;
      },

      error: (err) => {
        this.isLoading = false;
        console.error("Export failed", err);
        alert("Export failed. Please try again.");
      }
    });
  }


  AddBankOpen() {
    const dialogRef = this.dialog.open(BankmasteraddComponent, {
      width: '30%',
      height: '60vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'saved') {
        this.onsearch();
      }
    });
  }

  openEdit(row: any) {
    const dialogRef = this.dialog.open(AddEditComponent, {
      width: '30%',
      height: '60vh',
      disableClose: true,
      data: row
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'updated') {
        this.onsearch();
      }
    });
  }

  DeleteBankMaster(row: any) {
    if (!row) {
      alert("Please select a row to delete.");
      return;
    }

    if (!confirm("Are you sure you want to delete this bank record?")) {
      return;
    }

    this.isLoading = true;

    const BankAdd = {
      Bank_Id: row.Bank_Id,
      Serial_No: 0,
      Error_Message: '',
      Bank_Name: "",
      Bank_Account_Number_Digits: 0,
      Digit_Length_Condition: "",
      Swift_Code: ""
    };

    const BankRequest = {
      createdBy: this.userdetail.user_Id,
      mode: "Delete",
      detail: BankAdd
    };

    this.bankService.PostAddBank(BankRequest)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          const msg = res?.Data?.data;

          if (msg === "Bank details Deleted Successfully") {
            alert(msg);
            this.onsearch();
          } else {
            alert(msg || "Delete failed");
          }
        },
        error: () => {
          alert("Failed");
        }
      });
  }

  onClose() {
    this.dialogRef.close();
  }
}


