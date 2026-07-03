import { Component, ImportProvidersSource, Inject, InjectionToken, TrackByFunction } from '@angular/core';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { OnboardingServices } from '../../../Service/OnboardingService';
import { Payperiodclass } from '../../../Models/Common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CommonModule } from '@angular/common';
import * as XLSX from 'xlsx';
import { json } from 'stream/consumers';
import { IProvisionalInvoiceRepository } from '../../../Repository/iprovisionalinvoicerepository';
import { ProvisionalInvoiceService } from '../../../Service/ProvisionalInvoiceService';
import { NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import FileSaver from 'file-saver';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { PayrollinputComponent } from "../../PayrollInput/payrollinput.component";


const provisionalInvoice = InjectionToken<IProvisionalInvoiceRepository>;
type RawRow = Record<string, any>;

interface ViewRow {
  Input_No: string;
  Map_Name_Id: number;
  Map_name: string;
  LotNo: string;
  Employee_Head_Count: string;
  NetPay: string;
  Net_CTC: string;
  Invoice_Category_Id: number;
  Invoice_Category: string;
  selected: boolean;
  Data_From: string;
}

@Component({
  selector: 'provisionalinvoice',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSortModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule,
    FormsModule, AlertpopupComponent, PayrollinputComponent],
  templateUrl: './provisionalinvoice.component.html',
  styleUrl: './provisionalinvoice.component.css',
  providers: [
    { provide: provisionalInvoice, useClass: ProvisionalInvoiceService }]
})
export class ProvisionalinvoiceComponent {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any;
  payPeriodTypefromParentall: string = '';
  userdetail!: any;
  searchText: string = '';
  MergeRemarks: string = '';
  isLoading = false;
  apiResponse: any;
  rows: ViewRow[] = [];
  filteredRows: any[] = [];
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  selectedMapName: string | null = null;
  selectedInvoiceCategory: string | null = null;
  selectedInputNo: string | null = null;
  selectedDataFrom: string | null = null;
  excelFile: File | null = null;
  UploadedResponse: any;
  assignments: number[] = [];
  assignmentsmapid: number[] = [];
  assignmentsInput: number[] = [];
  assignmentsDataFrom: string[] = [];
  ismerge = false;
  isattributes = false;

  attributes = [
    { name: 'Narration', selected: false },
    { name: 'PO_Number', selected: false },
    { name: 'GL_Code', selected: false },
    { name: 'Cost_Centre', selected: false },
    { name: 'Client_SPOC_Name', selected: false },
    { name: 'Work_Order_Number', selected: false }
  ];

  constructor( private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService, @Inject(provisionalInvoice) private provisionalService: ProvisionalInvoiceService
    , private zone: NgZone, private router: Router
  ) { }

  trackRow: TrackByFunction<ViewRow> = (_, row) => row.Input_No;

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParentall = "All";
    this.filteredRows = [...this.rows];
  }

  handleCompanyEvent(company: any) {

    this.companyUI = company;
    if (this.companyUI.isProforma === false) {
      this.router.navigate(['/layout/pinavigation/invoice']);
    }
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
  }

  searchClick() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }

    if (this.companyUI && this.payperiodUI) {
      this.searchText = '';
      this.applyFilter();
      this.GetProvisionalInvoice(this.companyUI.companyId, this.payperiodUI.payfrequencyid, "154");
    }
  }

  GetProvisionalInvoice(ComapnayId: string, payPeriodId: string, userId: string) {
    this.isLoading = true;
    this.provisionalService.GetProvisionalInvoice(ComapnayId, payPeriodId, userId).subscribe({
      next: res => {
        if (!res.Data || res.Data === null) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }

        this.apiResponse = res.Data;
        const table: RawRow[] = this.apiResponse?.data?.Table0 ?? [];
        if (!table.length) {
          this.filteredRows = [];
          this.isLoading = false;
          return;
        }
        //  normalize table rows to view rows
        this.rows = table.map((r: RawRow): ViewRow => {
          const row: ViewRow = {
            Input_No: r['Input_No'],
            Map_Name_Id: r['Map_Name_Id'],
            Map_name: r['Map_name'],
            LotNo: r['LotNo'],
            Employee_Head_Count: r['Employee_Head_Count'],
            NetPay: r['NetPay'],
            Net_CTC: r['Net_CTC'],
            Invoice_Category_Id: r['Invoice_Category_Id'],
            Invoice_Category: r['Invoice_Category'],
            selected: false,
            Data_From: r['Data_From'],
          };

          return row;
        });

        this.filteredRows = [...this.rows];
        this.isLoading = false;

      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  applyFilter() {
    const text = (this.searchText || '').toLowerCase().trim();

    if (!text) {
      this.filteredRows = [...this.rows];
      return;
    }

    this.filteredRows = this.rows.filter(r =>
      (r.LotNo && r.LotNo.toString().toLowerCase().includes(text)) ||
      (r.Map_name && r.Map_name.toLowerCase().includes(text))
    );
  }

  get selectedRowsCount(): number {
    return this.rows.filter(r => r.selected).length;
  }

  // onCheckboxChange(row: any, event: any): void {

  //   if (event.checked) {
  //     // First selection: set the reference values
  //     if (!this.selectedMapName && !this.selectedInvoiceCategory && !this.selectedDataFrom
  //     ) {
  //       this.selectedMapName = row.Map_name;
  //       this.selectedInvoiceCategory = row.Invoice_Category;
  //       this.selectedDataFrom = row.Data_From;
  //     }
  //     else {
  //       // Validate against first selected values
  //       if (
  //         row.Map_name !== this.selectedMapName ||
  //         row.Invoice_Category !== this.selectedInvoiceCategory
  //       ) {
  //         // Reset checkbox if not matching
  //         row.selected = false;
  //         event.source.checked = false;

  //         // Show popup
  //         alert("Map Name and Invoice Category must be same for all selected rows!");
  //       }

  //       //Check Data From
  //       if (this.selectedDataFrom == "OI") {
  //         if (row.Data_From != "OI") {
  //           row.selected = false;
  //           event.source.checked = false;
  //           alert("Regular and Other income cannot be merge!");
  //         }
  //       }
  //       else if (this.selectedDataFrom == "R" || this.selectedDataFrom == "F") {
  //         if (row.Data_From == "OI") {
  //           row.selected = false;
  //           event.source.checked = false;
  //           alert("Regular and Other income cannot be merge!");
  //         }
  //       }

  //     }
  //   } else {
  //     // If unchecked, reset reference if no rows left
  //     const stillSelected = this.rows?.filter(r => r.selected);
  //     if (!stillSelected?.length) {
  //       this.selectedMapName = '';
  //       this.selectedInvoiceCategory = '';
  //       this.selectedInputNo = '';
  //       this.selectedDataFrom = '';
  //     }
  //   }

  //   // if (event.checked) {
  //   //   // First selection: set the reference values
  //   //   if (!this.selectedMapName && !this.selectedInvoiceCategory) {
  //   //     this.selectedMapName = row.Map_name;
  //   //     this.selectedInvoiceCategory = row.Invoice_Category;

  //   //   } else {
  //   //     // Validate against first selected values
  //   //     if (
  //   //       row.Map_name !== this.selectedMapName ||
  //   //       row.Invoice_Category !== this.selectedInvoiceCategory
  //   //     ) {
  //   //       // Reset checkbox if not matching
  //   //       row.selected = false;
  //   //       event.source.checked = false;

  //   //       // Show popup
  //   //       alert("Input No,Map Name and Invoice Category must be same for all selected rows!");
  //   //     }
  //   //   }
  //   // } else {
  //   //   // If unchecked, reset reference if no rows left
  //   //   const stillSelected = this.rows?.filter(r => r.selected);
  //   //   if (!stillSelected?.length) {
  //   //     this.selectedMapName = null;
  //   //     this.selectedInvoiceCategory = null;
  //   //   }
  //   // }
  // }

  downloadExcel() {
    const data: any[][] = [
      ["EmployeeCode"]];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Split");

    XLSX.writeFile(wb, "ProvisionalInvoiceSplit_Template.xlsx");
  }

  downloadMapExcel() {
    const data: any[][] = [
      ["EMPLOYEE_CODE", "MAP_NAME", "ACTION"]];

    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Table");

    XLSX.writeFile(wb, "MapNameChangesTemplate.xlsx");
  }

  onImportClick(fileInput: HTMLInputElement): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please select PayPeriod");
      return;
    }
    fileInput.value = '';
    fileInput.click();

  }

  onFileChange(event: any): void {
    this.isLoading = true

    setTimeout(() => {
      const target: DataTransfer = <DataTransfer>(event.target);

      if (!target.files || target.files.length !== 1) {
        console.error('Please upload only one Excel file.');
        this.isLoading = false;
        return;
      }

      const file = target.files[0];
      this.excelFile = target.files[0];

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;

        // ✅ heavy XLSX processing now happens after UI update
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];
        const data: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (!data.length) {
          alert("Uploaded file is empty.");
          this.isLoading = false;
          return;
        }
        // Extract header row
        const headers = data[0].map((h: string) => h?.trim().toUpperCase());


        // Define expected header sets
        const mapHeaders = ["EMPLOYEE_CODE", "MAP_NAME", "ACTION"];
        const splitHeaders = ["EMPLOYEECODE"];
        const attributeHeaders = ["LOTNO", "EMPLOYEE_CODE"];
        const attributeAllowedExtras = ["NARRATION", "PO_NUMBER", "GL_CODE", "COST_CENTRE",
          "CLIENT_SPOC_NAME", "WORK_ORDER_NUMBER"];

        if (this.arraysMatch(headers, splitHeaders)) {
          console.log("before form");
          const formData = new FormData();
          if (this.excelFile) {
            formData.append('file', this.excelFile);
            formData.append('CompanyId', this.companyUI.companyId);
            formData.append('payperiod', this.payperiodUI.payPeriod);
            formData.append('CreatedBy', "154");
            formData.append('payperiodId', this.payperiodUI.payfrequencyid);
            console.log("before api");
            this.provisionalService.ProvisionalInvoiceSplit(formData).subscribe({
              next: res => {
                this.UploadedResponse = res;

                if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response.includes('Row(s) Uploaded Successfully.')) {
                  this.isLoading = false;
                  this.showPopup = true;
                  this.popupMessage = this.UploadedResponse.data.response;
                  this.selectedMapName = '';
                  this.selectedInvoiceCategory = '';
                  this.selectedInputNo = '';
                  this.selectedDataFrom = '';
                  this.searchClick();
                }
                else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

                  const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
                  const exportData = errorArray.map((item: any) => ({
                    Error_Message: item.Error_Message || item.Error_Message || ''
                      || item.Message || item.MESSAGE || item.message
                  }));

                  const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
                  const workbook: XLSX.WorkBook = {
                    Sheets: { 'ErrorMessages': worksheet },
                    SheetNames: ['ErrorMessages']
                  };

                  // Export the file
                  XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Split.xlsx');
                  this.isLoading = false;
                  this.showPopup = true;
                  this.popupMessage = 'Import Failed.';

                }
                else {
                  if (this.UploadedResponse.data.response != '') {
                    alert(this.UploadedResponse.data.response);
                    this.isLoading = false;
                  }
                  else {
                    alert('Error while processing response.');
                    this.isLoading = false;
                  }

                }
              },
              error: err => {
                console.error('❌ Upload failed', err);
                this.isLoading = false;
              }
            });
          }
          else {
            alert("No File");
            this.isLoading = false;
          }
        }

        else {
          alert("Invalid file headers. Please upload a valid template.");
          this.isLoading = false;
        }
      };

      reader.readAsBinaryString(file);

    }, 100);
  }

  arraysMatch(a: string[], b: string[]): boolean {
    return a.length === b.length && a.every((val, i) => val === b[i]);
  }

  hasRequiredColumnsAttributes(headers: string[], required: string[]): boolean {
    return required.every(col => headers.includes(col.toUpperCase()));
  }

  Mergeclick() {
    this.assignments = [
      ...new Set(
        this.filteredRows
          .filter(r => r.selected)
          .map(r => r.LotNo)
      )
    ];

    this.assignmentsInput = [
      ...new Set(
        this.filteredRows
          .filter(r => r.selected)
          .map(r => r.Input_No)
      )
    ];


    this.assignmentsmapid = this.filteredRows
      .filter(r => r.selected)
      .map(r => r.Map_Name_Id)[0] || null;

    this.assignmentsDataFrom = this.filteredRows
      .filter(r => r.selected)
      .map(r => r.Data_From)[0] || null;
    this.ismerge = true;

  }




  // MergeSubmit() {
  //   const assignmentsString = this.assignments.join(",");
  //   const assignmentsmapidString = this.assignmentsmapid;
  //   const assignmentsInputString = this.assignmentsInput.join(",");
  //   const assignmentsDataFromString = this.assignmentsDataFrom;
  //   const requestPayload = {
  //     CompanyId: String(this.companyUI.companyId),
  //     PayPeriodId: String(this.payperiodUI.payfrequencyid),
  //     MAP_NAME_ID: String(assignmentsmapidString),
  //     MergeLot: assignmentsString,
  //     Merged_Input_No: assignmentsInputString,
  //     CreatedBy: this.userdetail.userId,
  //     Remarks: this.MergeRemarks,
  //     Data_From: assignmentsDataFromString
  //   }

  //   this.provisionalService.PerformaInvoiceMerge(requestPayload).subscribe({
  //     next: res => {
  //       this.UploadedResponse = res;

  //       if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response.includes("Merged successfully with lot number")) {
  //         this.isLoading = false;
  //         this.showPopup = true;
  //         this.popupMessage = this.UploadedResponse.data.response;
  //         this.selectedMapName = '';
  //         this.selectedInvoiceCategory = '';
  //         this.MergeRemarks='';
  //         this.ismerge = false;
  //         this.assignments = [];
  //         this.assignmentsmapid = [];
  //         this.assignmentsInput = [];
  //         this.MergeRemarks = '';
  //         this.searchClick();
  //       }
  //       else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

  //         const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
  //         const exportData = errorArray.map((item: any) => ({
  //           ERORR: item.ERORR || item.ERORR || ''
  //         }));

  //         const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  //         const workbook: XLSX.WorkBook = {
  //           Sheets: { 'ErrorMessages': worksheet },
  //           SheetNames: ['ErrorMessages']
  //         };

  //         // Export the file
  //         XLSX.writeFile(workbook, 'ErrorMessages_Invoice_Merge.xlsx');
  //         this.isLoading = false;
  //         this.showPopup = true;
  //         this.popupMessage = 'Merged';

  //       }
  //       else {
  //         if (this.UploadedResponse.data.response != '') {
  //           alert(this.UploadedResponse.data.response);
  //           this.isLoading = false;
  //         }
  //         else {
  //           alert('Error while processing response.');
  //           this.isLoading = false;
  //         }

  //       }
  //     },
  //     error: err => {
  //       console.error('❌ Upload failed', err);
  //     }
  //   });

  // }

  // InvoiceInitiateClick() {
  //   this.isLoading = true;
  //   const selectedRow = this.filteredRows.find(r => r.selected);

  //   if (!selectedRow) {
  //     alert("Please select a row");
  //     return;
  //   }
  //   const requestPayload = {
  //     CompanyId: String(this.companyUI.companyId),
  //     CompanyCode: String(this.companyUI.CompanyCode),
  //     PayPeriodId: String(this.payperiodUI.payfrequencyid),
  //     PayPeriod: String(this.payperiodUI.payPeriod),
  //     LotNo: String(selectedRow.LotNo),
  //     Input_No: String(selectedRow.Input_No),
  //     Map_Name_Id: String(selectedRow.Map_Name_Id),
  //     Map_Name: String(selectedRow.Map_name),
  //     CreatedBy: "154"
  //   };

  //   console.log(requestPayload);

  //   this.provisionalService.ProvisionalInvoiceInitiate(requestPayload).subscribe({
  //     next: res => {
  //       this.UploadedResponse = res;
  //       console.log(res);
  //       if (this.UploadedResponse.data.response === 'Invoice Initiated Successfully') {
  //         this.isLoading = false;
  //         this.showPopup = true;
  //         this.searchClick();
  //         this.selectedMapName = '';
  //         this.selectedInvoiceCategory = '';
  //         this.popupMessage = 'Invoice Initiated Successfully';

  //       }
  //       else {
  //         if (this.UploadedResponse.data.response != '') {
  //           alert(this.UploadedResponse.data.response);
  //           this.isLoading = false;
  //         }
  //         else {
  //           alert('Error while processing response.');
  //           this.isLoading = false;
  //         }

  //       }
  //     },
  //     error: err => {
  //       console.error('❌ Upload failed', err);
  //       this.isLoading = false;
  //     }
  //   });
  // }

  async InvoiceInitiateClick() {
    this.isLoading = true;

    const selectedRows = this.filteredRows.filter(r => r.selected);

    if (selectedRows.length === 0) {
      alert("Please select at least one row");
      this.isLoading = false;
      return;
    }

    const allResponses: any[] = [];

    try {
      for (const row of selectedRows) {

        const requestPayload = {
          CompanyId: String(this.companyUI.companyId),
          CompanyCode: String(this.companyUI.CompanyCode),
          PayPeriodId: String(this.payperiodUI.payfrequencyid),
          PayPeriod: String(this.payperiodUI.payPeriod),
          LotNo: String(row.LotNo),
          Input_No: String(row.Input_No),
          Map_Name_Id: String(row.Map_Name_Id),
          Map_Name: String(row.Map_name),
          CreatedBy: "154"
        };

        console.log("Sending API for row:", requestPayload);

        const res: any = await lastValueFrom(
          this.provisionalService.ProvisionalInvoiceInitiate(requestPayload)
        );

        console.log("Received response for row:", res);

        allResponses.push({
          Map_Name: requestPayload.Map_Name,
          LotNo: requestPayload.LotNo,
          Response: res.data.response
        });
      }

      console.log(allResponses);
      this.downloadExcelValidate(allResponses, "ProvisionalInvoiceInitiateLog");
      this.isLoading = false;
      // this.showPopup = true;
      // this.popupMessage = "All selected invoices processed!";
      this.searchClick();

    } catch (err) {
      console.error("❌ Error processing rows:", err);
      alert("Error while processing.");
      this.isLoading = false;
    }

  }

  downloadExcelValidate(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
     const fileName = `${templateId}.xlsx`;
    // FileSaver.saveAs(blob, fileName);
    XLSX.writeFile(workbook, fileName);
  }

  Attributeclick() {
    this.isattributes = true;
  }

  AttributesTemplateclick() {
    const selectedAttributes = this.attributes
      .filter(attr => attr.selected)
      .map(attr => attr.name);

    if (selectedAttributes.length == 0) {
      alert('Please select atleast one Attributes');
      return;
    }

    const baseHeaders = ["Company_Code", "PayPeriod", "LotNo", "Employee_Code"];
    const finalHeaders = [...baseHeaders, ...selectedAttributes];
    const data: any[][] = [finalHeaders];
    const ws: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(data);

    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, "Split");

    XLSX.writeFile(wb, "Attributes_Template.xlsx");

  }

}
