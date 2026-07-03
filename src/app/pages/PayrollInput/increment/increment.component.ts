import { Component, Inject, InjectionToken } from '@angular/core';
import { Company, Mapnameclass, Payperiodclass } from '../../../Models/Common';
import { IIncrementService } from '../../../Repository/iincrement.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { IncrementService } from '../../../Service/increment.service';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { IOnboardingServices } from '../../../Repository/IOnboardingService';
import { OnboardingStateService } from '../../../onboarding-state.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { PayrollinputComponent } from '../payrollinput.component';

const incrementservice = InjectionToken<IIncrementService>;

@Component({
  selector: 'increment',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSortModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    PayrollinputComponent, AlertpopupComponent],
  templateUrl: './increment.component.html',
  styleUrl: './increment.component.css',
  providers: [
    {
      provide: incrementservice,
      useClass: IncrementService,
    }
  ]
})
export class IncrementComponent {
  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;
  companyCode: any;
  payPeriod: any;
  mapName: any;
  selectedPayPeriodFromApi?: PayPeriodComponent;
  isLoading = false;
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  payPeriodTypefromParent: string = '';
  fileUploaded = false;
  File_Uploaded: any | null = null;
  UploadedResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  employeeId: string = '';

  constructor(@Inject(incrementservice) private incrementService: IIncrementService,
    public stateService: OnboardingStateService,
    private _encry: EncryptionService,
    private sessionStorageService: SessionStorageService
  ) { }

  handleCompanyEvent(company: any) {

    this.companyUI = company;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {

    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.payperiodUI);
  }
  handleMapNameEvent(mapName: any) {
    this.mapnameUI = mapName;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.mapnameUI);
  }
  onTemplateChange(payPeriod: Payperiodclass) {
    this.payperiodUI = payPeriod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.payperiodUI);
  }
  ngOnInit(): void {

    const userdetail = this.sessionStorageService.getItem('UserProfile');
    var user = JSON.parse(this._encry.decrypt(userdetail!));
    this.employeeId = String(user.user_Id);

    this.mapnameUI = {
      mapName: '',
      mapNameId: 0
    };
    this.payPeriodTypefromParent = "Current";
  }

  onTemplateClick(): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }
    else {
      this.incrementDownload();
    }
  }

  incrementDownload() {
    this.isLoading = true;
    const formData = new FormData();
    if (this.companyUI) {

      this.incrementService.GetEmployeeIncrement(this.companyUI.companyId, String('1'), this.mapnameUI.mapNameId).subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode == 200) {
            const data = res.Data;
            var base64 = data.file;
            //console.log(data.FileName);
            this.downloadExcelFromBase64(base64, data.fileName)
            this.isLoading = false;
          }
        },
        error: error => {
          console.error('Error:', error);
          this.isLoading = false;
        }
      })
    }
    return;
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

  onImportClick(fileInput: HTMLInputElement): void {
    if (!this.companyUI) {
      alert("Please select Company Code");
      return;
    }
    fileInput.click();
  }

  onFileChange(event: any): void {
    this.isLoading = true;
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Only one file allowed.');
      this.isLoading = false;
      return;
    }

    this.fileUploaded = true; // Show the button or section

    const file = target.files[0];
    const reader: FileReader = new FileReader();

    if (file) {
      this.File_Uploaded = file;
    }

    reader.onload = (e: any) => {
      try {
        const arrayBuffer: ArrayBuffer = e.target.result;
        const data = new Uint8Array(arrayBuffer);
        const arr = Array.from(data).map(byte => String.fromCharCode(byte)).join('');
        const workbook: XLSX.WorkBook = XLSX.read(arr, { type: 'binary' });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        //const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
        const jsonData = XLSX.utils.sheet_to_json(worksheet);
        const top100 = jsonData.slice(0, 100);
        this.excelPreviewData = top100;
        this.showPreviewModal = true;
      }
      catch (error) {
        console.error('Error reading Excel file:', error);
        alert('Error reading Excel file.');
      } finally {
        this.isLoading = false;  // ✅ turn off loader after file processing is complete
      }
    };

    reader.onerror = () => {
      console.error('Error loading file');
      alert('Error loading file.');
      this.isLoading = false;
    };

    reader.readAsArrayBuffer(file);
  }


  getTableColumns(): string[] {
    return this.excelPreviewData?.length ? Object.keys(this.excelPreviewData[0]) : [];
  }

  downloadExcel(data: any[], templateId: string): void {
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

  UploadIncrement() {
    this.isLoading = true;
    if (this.excelPreviewData.length > 0) {

      const formData = new FormData();
      if (this.fileUploaded) {
        formData.append('file', this.File_Uploaded);
        formData.append('User', String(this.employeeId));
        formData.append('companyCode', String(this.companyUI.companyCode));
        formData.append('companyId', String(this.companyUI.companyId));
        formData.append('InputType', String('1'));

        this.incrementService.UploadIncrementData(formData).subscribe({
          next: res => {
            this.UploadedResponse = res;

            if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.data.response === 'Import Successfully Done.') {
              alert('Import Successfully Done.');
              this.isLoading = false;
              this.showPopup = true;
              this.popupMessage = 'Import Successfully Done.';
            }
            else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

              const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
              const exportData = errorArray.map((item: any) => ({
                MESSAGE: item.MESSAGE || item.Message || ''
              }));

              const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
              const workbook: XLSX.WorkBook = {
                Sheets: { 'ErrorMessages': worksheet },
                SheetNames: ['ErrorMessages']
              };

              // Export the file
              XLSX.writeFile(workbook, 'ErrorMessages_Increment.xlsx');
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
          }
        });

      }
    }
  }

}
