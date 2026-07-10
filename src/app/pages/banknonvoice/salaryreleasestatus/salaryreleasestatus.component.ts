import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { Payperiodclass } from '../../../Models/Common';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { ISalaryReleaseStatus } from '../../../Repository/banknonvoice/ISalaryReleaseStatus.service';
import { SalaryreleasestatusService } from '../../../Service/banknonvoice/salaryreleasestatus.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { finalize } from 'rxjs';
import * as XLSX from 'xlsx';
export const Pay_Token = new InjectionToken<ISalaryReleaseStatus>('Pay_Token');


@Component({
  selector: 'app-salaryreleasestatus',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, MatCardModule, MatIconModule, MatTooltipModule, PayPeriodComponent, CompanyallComponent],
  templateUrl: './salaryreleasestatus.component.html',
  styleUrl: './salaryreleasestatus.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: SalaryreleasestatusService,
    }
  ]
})
export class SalaryreleasestatusComponent {
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;

  dataSource = new MatTableDataSource<any>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedImport: string = '';
  excelData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  holdSelections: { [key: number]: string } = {};
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  istablevisible = false;
  selectedBatchType: string = '';
  startDate: string = '';
  endDate: string = '';
  employeeCode: string = '';
  batchtype: any[] = [];
  batchList: any[] = [];
  startDateInput: string = '';
  endDateInput: string = '';
  comapnyId: number = 0;
  selectedCompanyCode: string = '';
  CreditNotePurpose: any;
  Credit_Note_Type: string = "";
  Ref_id: string = "";
  isPayPeriod = false;
  isRefId = false;
  payPeriodType: string = "All";
  PayPeriodUI: any;
  StartDate: string = "";
  EndDate: string = "";
  payPeriodmain!: Payperiodclass;
  payperiodIdmain: any;
  payperiodsmain: any;
  selectedCompanyId: any;
  payPeriodTypetoChild?: string;
  payPeriodTypefromParentall: string = '';
  selectedPPid?: string;
  selectedPP?: string;
  paginatedData: any[] = [];
  companyId: any;
  BatchType = '';
  batchtypes: any;
  EmployeeCode: any;
  FormattedStartBatchDate = '';
  FormattedendBatchDate = '';

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, @Inject(Pay_Token) private service: ISalaryReleaseStatus) { }



  displayedColumns: string[] = [
    'SINo', 'CompanyCode', 'Company_Name', 'EmployeeName', 'PayPeriod', 'ReleaseStatus', 'BatchId', 'BatchCreatedBy', 'BatchCreatedOn', 'IkyaLocation', 'WorkLocation', 'Bank', 'AccountNumber', 'IFSCCode', 'PTState', 'NetPay', 'BankRefNo', 'UTRChequeNo', 'UTRDate'

  ];

  ngOnInit(): void {
    this.payPeriodTypefromParentall = "All";
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this._decrypt.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.loadbatchType(this.userdetail.user_Id);
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.paginatedData = [];
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPPid = String(payperiod.payfrequencyid);
    this.selectedPP = String(payperiod.payPeriod);
    this.paginatedData = [];
  }


  handlePayperiodEventmain(payperiod: Payperiodclass) {
    this.payPeriodmain = payperiod;
    this.payperiodIdmain = payperiod.payfrequencyid;
    this.payperiodsmain = payperiod.payPeriod;
  }

  BindPurpose(companyId: number) {

  }


  searchClick(): void {

    if (!this.BatchType) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.startDate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.endDate) {
      alert("Please Select To Date");
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      alert("Start Date cannot be greater than End Date");
      return;
    }

    this.isLoading = true;

    if (this.startDate) {
      const [year, month, day] = this.startDate.split('-');
      this.FormattedStartBatchDate = `${day}-${month}-${year}`;
    }

    if (this.endDate) {
      const [year, month, day] = this.endDate.split('-');
      this.FormattedendBatchDate = `${day}-${month}-${year}`;
    }

    this.service.GetSalaryReleaseStatusdata(
      this.BatchType,
      this.FormattedStartBatchDate,
      this.FormattedendBatchDate,
      this.EmployeeCode ?? 0,
      this.userdetail.user_Id
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 ?? [];

          this.dataSource.data = tableData;

          if (!tableData.length) {
            alert('No records found.');
            this.istablevisible = false;
          }
          this.istablevisible = true;

        },
        error: (err) => {
          console.error(err);
          this.dataSource.data = [];
          this.istablevisible = false;
          alert('Something went wrong.');
        }
      });

  }

  exportToExcel(): void {

    if (!this.BatchType) {
      alert("Please Select Batch Type");
      return;
    }

    if (!this.startDate) {
      alert("Please Select From Date");
      return;
    }

    if (!this.endDate) {
      alert("Please Select To Date");
      return;
    }

    if (new Date(this.startDate) > new Date(this.endDate)) {
      alert("Start Date cannot be greater than End Date");
      return;
    }

    this.isLoading = true;

    if (this.startDate) {
      const [year, month, day] = this.startDate.split('-');
      this.FormattedStartBatchDate = `${day}-${month}-${year}`;
    }

    if (this.endDate) {
      const [year, month, day] = this.endDate.split('-');
      this.FormattedendBatchDate = `${day}-${month}-${year}`;
    }

    this.service.GetSalaryReleaseStatusdataExport(
      this.BatchType,
      this.FormattedStartBatchDate,
      this.FormattedendBatchDate,
      this.EmployeeCode ?? 0,
      this.userdetail.user_Id
    )
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 ?? [];

          if (!tableData.length) {
            alert('No records found.');
            return;
          }
          alert("Report downloaded successfully.");
          this.exportDataToExcel(tableData, 'salary_release_status_');

        },
        error: (err) => {
          console.error(err);
          alert('Export failed.');
        }
      });
  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {

    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      alert('Please select a file.');
      return;
    }

    if (!this.BatchType) {
      alert('Please select Batch Type.');
      input.value = '';
      return;
    }

    const file = input.files[0];

    const allowedExtensions = ['xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension || '')) {
      alert('Only Excel files (.xls/.xlsx) are allowed.');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('BatchType', this.BatchType);
    formData.append('UserId', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.UtrUpload(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
        input.value = '';
      }))
      .subscribe({

        next: (res) => {

          if (!res?.Data) {
            alert('Server returned no data.');
            return;
          }

          const response = res.Data.response ?? '';

          if (response.includes('Row(s) Uploaded Successfully.')) {
            alert('Rows Uploaded Successfully.');
            return;
          }

          if (response.includes('Failed to import.')) {

            alert('Failed to Import.');

            const rawErr = res.Data.errors?.[0];

            let errorArray: any[] = [];

            try {

              if (typeof rawErr === 'string') {

                const parsed = JSON.parse(rawErr);

                errorArray = Array.isArray(parsed)
                  ? parsed
                  : [parsed];

              } else {

                errorArray = Array.isArray(rawErr)
                  ? rawErr
                  : rawErr
                    ? [rawErr]
                    : [];

              }

            } catch {

              errorArray = rawErr
                ? [{ Error_Message: String(rawErr) }]
                : [];

            }

            const exportData = errorArray.map((x: any) => ({
              Error_Message: x.Error_Message || x.Validation || ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            const workbook = {
              Sheets: {
                ErrorMessages: worksheet
              },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, 'ErrorMessages.xlsx');

          }

        },
        error: (err) => {
          console.error(err);
          alert('Upload failed.');
        }

      });
  }

  applyFilter() {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  loadbatchType(userid): void {
    this.service.GetBatchTypeList(userid).subscribe({
      next: (res: any) => {
        this.batchtypes = res?.Data ?? [];
      },
      error: (err: any) => {
        console.error("Dropdown Error", err);
      }
    });
  }

  onDownloadTemplate() {
    var flag = 'NIUTR';
    this.isLoading = true;
    this.service.GetTemplate(this.userdetail.user_Id, flag)
      .subscribe({
        next: (res: any) => {
          this.isLoading = false;
          const tableData = res?.Data?.data?.Table0 ?? [];

          if (!tableData.length) {
            alert('No template data found.');
            return;
          }
          this.exportDataToExcel(tableData, 'batch_generation_template');
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
          alert('Unable to download template.');
        }

      });
  }

  exportDataToExcel(data: any[], filename: string) {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);

      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, 'Users');

      xlsx.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`
      );
    });
  }

}
