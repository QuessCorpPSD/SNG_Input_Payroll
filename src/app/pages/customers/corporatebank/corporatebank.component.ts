import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CorporatebankaddComponent } from '../corporatebankadd/corporatebankadd.component';
import { MatDialog } from '@angular/material/dialog';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { ICorporatebabk } from '../../../Repository/customer/Icorporatebank';
import { CorporateBankService } from '../../../Service/CUSTOMER/corporatebank.service';
import * as XLSX from 'xlsx';
import { ThemeService } from 'ng2-charts';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

export const Pay_TOKEN = new InjectionToken<ICorporatebabk>('Pay_TOKEN');

@Component({
  selector: 'app-corporatebank',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule,
    MatPaginatorModule, FormsModule, ReactiveFormsModule, AlertpopupComponent],
  templateUrl: './corporatebank.component.html',
  styleUrl: './corporatebank.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CorporateBankService,
    }
  ]
})
export class CorporatebankComponent {
  BankName: any;

  constructor(private dialog: MatDialog,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_TOKEN) private corporatebankService: ICorporatebabk) { }

  corporateBankForm!: FormGroup;
  showTable = false;
  userdetail: any;
  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage = '';
  popupSubMessage = '';

  uploadDisplayedColumns: string[] = [
    'Action', 'slNo', 'bankname', 'branch', 'branchcode', 'bankcode', 'accountno', 'swiftcode', 'address'
  ];

  uploadedData: any[] = []; // 🧾 No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;


  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    //this.setUpCustomFilter();
  }

  setUpCustomFilter() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.category?.toLowerCase().includes(search.category) &&
        data.date?.toLowerCase().includes(search.date) &&
        data.fromvalue?.toString().toLowerCase().includes(search.fromvalue) &&
        data.tovalue?.toString().toLowerCase().includes(search.tovalue) &&
        data.criteria?.toLowerCase().includes(search.criteria) &&
        data.criterianame?.toLowerCase().includes(search.criterianame)
      );
    };
  }

  onsearch() {
    this.showTable = true;
    this.isLoading = true;   // <-- Start loader

    this.corporatebankService.Search().subscribe({
      next: (res: any) => {

        if (res?.Message === 'Success') {
          const data = res?.Data?.data?.Table0 || res?.Data || [];

          if (Array.isArray(data) && data.length > 0) {
            this.uploadedData = data;
            this.uploadedDataSource.data = this.uploadedData;
          }
          else if (res?.Data?.errors) {
            const validationErrors = res.Data.errors;
            const messages: string[] = [];

            Object.keys(validationErrors).forEach(key => {
              messages.push(`${key}: ${validationErrors[key].join(', ')}`);
            });

            alert('Validation Errors:\n' + messages.join('\n'));
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
          }
          else {
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
            alert('No data found.');
          }
        }
        else {
          alert('Unexpected API response. Check console.');
          console.warn('Unexpected:', res);
        }

        this.isLoading = false;  // <-- Stop loader on success
      },

      error: (err) => {
        console.error('Error fetching GST slab data:', err);
        this.isLoading = false;  // <-- Stop loader on error
      }
    });
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.corporateBankForm = new FormGroup({
      BankName: new FormControl('',),
    })

    this.onsearch();
  }

  AddCorporatebank() {
    const dialogRef = this.dialog.open(CorporatebankaddComponent, {
      width: '65%',
      height: '70vh',
      disableClose: true,
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onsearch();     // <-- Refresh table
    });
  }

  ExportToExcel(): void {

    this.corporatebankService.Search().subscribe({
      next: (res) => {

        try {
          const jsonData = res.Data.data.Table0;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            return;
          }

          // Create Excel file from the JSON data
          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'GST');

          // Generate filename with timestamp
          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `CorporateBank_Details_${timestamp}.xlsx`;


          XLSX.writeFile(wb, fileName);


        } catch (err) {
          console.error('Error exporting to Excel:', err);

        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
      },
    });
  }

  editCorporateBank(row: any) {
    const dialogRef = this.dialog.open(CorporatebankaddComponent, {
      width: '65%',
      height: '70vh',
      disableClose: true,
      data: row           // <-- passing the row to popup
    });

    dialogRef.afterClosed().subscribe(result => {
      this.onsearch();     // <-- Refresh table
    });
  }

  deletCorporateBank(row: any) {
    this.isLoading = true;
    const bankId = row.Bank_Id;

    var payload;

    payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Delete",
      parentDetail: {
        Bank_Id: bankId,
        Bank_Name: "",
        Ifsc_Code: "",
        Account_No: "",
        Address: "",
        Error_Message: "",
        Serial_No: "",
        BranchName: "",
        BrsCode: "",
        BankCode: "",
      }
    };



    this.corporatebankService.Create(payload).subscribe({
      next: (res: any) => {

        let isSuccess = String(res?.StatusCode) === '200' &&
          String(res?.Data?.statusCode) === '200';

        if (isSuccess) {

          // SUCCESS CASE
          const table = res?.Data?.data?.Table0;
          const message = table?.[0]?.Error_Message || res?.Data?.message;
          alert(message);
          this.onsearch();
        } else {

          // FAILURE CASE
          const errorMessage =
            res?.Data?.message ||
            res?.Error?.ErrorMessage ||
            res?.Message ||
            "Failed. Please try again.";

          alert(errorMessage.trim());
        }

        // <-- show popup for both cases
        //this.dialogRef?.close();
        this.isLoading = false;
      },

      error: (err) => {
        alert("Error while processing");
        this.isLoading = false;
      }
    });
  }


}
