import { CompanyComponent } from "../../../common/company/company.component";
import { Company, Mapnameclass, Payperiodclass } from '../../../Models/Common';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { PayPeriodComponent } from "../../../common/payperiod/payperiod.component";
import { IOnboardingServices } from "../../../Repository/IOnboardingService";
import { OnboardingServices } from "../../../Service/OnboardingService";
import { OnboardingComponent } from "../onboarding/onboarding.component";
import { OnboardingStateService } from "../../../onboarding-state.service";
import { SessionStorageService } from "../../../Shared/SessionStorageService";
import { EncryptionService } from "../../../Shared/encryption.service";
export const DASH_TOKEN = new InjectionToken<IOnboardingServices>('DASH_TOKEN');
import { PayrollinputComponent } from "../payrollinput.component";
@Component({
  selector: 'onetimeinput',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSortModule, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, PayrollinputComponent],
  templateUrl: './onetimeinput.component.html',
  styleUrl: './onetimeinput.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [{
    provide: DASH_TOKEN,
    useClass: OnboardingServices
  }]
})
export class OnetimeinputComponent {
  selectedCC?: number;
  selectedPP?: string;
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;
  selectedTemplate: string = '';
  selectedImport: string = '';
  companyCode: any;
  payPeriod: any;
  mapName: any;
  isLoading = false;
  payPeriodTypefromParent: string='';
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showPreviewModal: boolean = false;
  showSearchGrid: boolean = true;
  offerIdJson: string = '';
  validateOffer: string = '';
  userdetail! :any;
  //headerResult: string = '';
  constructor(@Inject(DASH_TOKEN) private onboardService: IOnboardingServices,
    public stateService: OnboardingStateService, private _sessionStoreage: SessionStorageService,
     private decry:EncryptionService,
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
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
      //console.log(this.userdetail.userId);
    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.mapnameUI = {
      mapName: '',
      mapNameId: 0
    };
    
    this.payPeriodTypefromParent="Current";
  }
  onTemplateClick(): void {
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }
    else {
      this.oneTimeDownload();
    }
  }
  oneTimeDownload() {
    const formData = new FormData();
    if (this.companyUI) {
      formData.append('companyId', this.companyUI.companyId);
      formData.append('mapNameId', this.mapnameUI.mapNameId);
      formData.append('flag', '5');
      formData.append('payPeriodId', this.payperiodUI.payfrequencyid);

      this.onboardService.GetNewJoineeTemplate(formData).subscribe({
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
        error: error => console.error('Error:', error)
      })
    }
    this.isLoading = false;
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
    this.isLoading = true;
    if (!this.companyUI) {
      alert("Please select Company Code");
      this.isLoading = false;
      return;
    }
    fileInput.click();
  }

  onFileChange(event: any): void {
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
      const binaryStr: string = e.target.result;
      try {
        const workbook: XLSX.WorkBook = XLSX.read(binaryStr, { type: 'binary' });
        const sheetName: string = workbook.SheetNames[0];
        const sheet: XLSX.WorkSheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(sheet);
        const top100 = jsonData.slice(0, 100);
        this.excelPreviewData = top100;  // 🔹 Store for popup preview
        this.showPreviewModal = true;     // 🔹 Trigger modal
        this.showSearchGrid = false;     // 🔹 Trigger modal
        this.isLoading = false;
      } catch (error) {
        console.error('Error reading Excel file:', error);
      }
    };

    reader.readAsBinaryString(file);
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

    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
  }

  submitExcelData(): void {
    this.showPreviewModal = false;
    this.isLoading = true;
    if (!this.excelFile) {
      console.error("⚠️ No file selected.");
      return;
    }
    const formData = new FormData();
    if (this.excelFile) {
      formData.append('file', this.excelFile);
      formData.append('companyCode', this.companyUI.companyCode);
      formData.append('companyId', this.companyUI.companyId);
      formData.append('payPeriod', this.payperiodUI.payPeriod);
      formData.append('payPeriodId', this.payperiodUI.payfrequencyid);

      this.onboardService.PostOneTimeInputData(formData).subscribe({
        next: res => {
          this.datatable = res.Data;
          if (this.datatable && Array.isArray(this.datatable) && this.datatable.length > 0) {
            this.downloadExcel(this.datatable, "OneTimeInput_Validations");
            this.isLoading = false;
          } else {
            alert("No validations returned");
            this.isLoading = false;
          }
        },
        error: err => {
          console.error('❌ Upload failed', err);
          this.isLoading = false;
        }
      });
    }
  }
}
