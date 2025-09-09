import { Component, ViewChild, AfterViewInit, ViewEncapsulation, InjectionToken, Inject, Input, OnChanges, Output, OnInit } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { IOnboardingServices } from '../../../Repository/IOnboardingService';
import { OnboardingServices } from '../../../Service/OnboardingService';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { SelectionModel } from '@angular/cdk/collections';
export const DASH_TOKEN = new InjectionToken<IOnboardingServices>('DASH_TOKEN');
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatPaginatorModule } from '@angular/material/paginator';
import { OnboardingComponent } from '../onboarding/onboarding.component';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { FinalSubmitGrid } from '../../../Models/FinalSubmitGrid';
import { Payperiodclass } from '../../../Models/Common';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PsdstatusComponent } from '../../../common/psdstatus/psdstatus.component';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { finalize } from 'rxjs/operators';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { PayrollinputComponent } from '../payrollinput.component';

@Component({
  selector: 'finalsubmission',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule, MatSort, MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule, PayrollinputComponent, AlertpopupComponent, PsdstatusComponent],
  templateUrl: './finalsubmission.component.html',
  styleUrl: './finalsubmission.component.css',
  providers: [{
    provide: DASH_TOKEN,
    useClass: OnboardingServices
  }, {
    provide: COMM_TOKEN,
    useClass: CommonService
  }]
})
export class FinalsubmissionComponent {
  companyUI: any;
  payperiodUI: any;
  inputTypeUI: any;
  filter: any;

  dataSource = new MatTableDataSource<FinalSubmitGrid>([]);
  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  selectedTemplate: string = '';
  excelData: any[] = [];
  excelPreviewData: any[] = [];
  excelFile: File | null = null;
  showSearchGrid: boolean = true;
  isLoading = false;
  showPopup = false;
  showpsd = false;
  payPeriodTypefromParent: string = '';
  lotNoJson: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  companyIdtopsd?: number;
  payPeriodIdtopsd?: number;
  inputTypetopsd?: string = '';
  lotNotopsd?: number;
  inputTexttopsd: string = '';
  userdetail! : any;

  displayedColumns: string[] = [
    'select',
    'inputName', 'headCount', 'firstName', 'currentStatus',
    'inputLotNumber', 'psdstatus', 'register', 'revised'
  ];
  TemplateOptions = [
    { value: 'input submitted', Text: 'Input Submitted' },
    { value: 'modify request', Text: 'Modify Request' },
    { value: 'in-progress', Text: 'In-Progress' },
    { value: '', Text: 'Clear' }
  ];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(@Inject(DASH_TOKEN) private onboardService: IOnboardingServices,
    @Inject(COMM_TOKEN) private commonService: ICommonService,
    public stateService: OnboardingStateService, private _sessionStoreage: SessionStorageService,
     private decry:EncryptionService
  ) { }

  handleCompanyEvent(company: any) {
    this.companyUI = company;
    //console.log(this.companyUI);
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    // this.isLoading = true;
    // this.BindDashBoard(this.companyUI.companyId, this.inputTypeUI.inputId)

  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    //console.log('Received in Final:', payperiod);
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code pay");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.inputTypeUI.inputId)

  }

  // handleInputTypeEvent(InputType: any) {
  //   this.inputTypeUI = InputType;

  //   if (!this.companyUI) {
  //     alert("Select Company Code");
  //     return;
  //   }
  //   if (!this.payperiodUI) {
  //     alert("Select Pay Period");
  //     return;
  //   }
  //   if (!this.inputTypeUI) {
  //     alert("Select Input Type");
  //     return;
  //   }
  //   this.isLoading = true;
  //   this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.inputTypeUI.inputId)
  // }

  searchClick() {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    if (!this.payperiodUI) {
      alert("Select Pay Period");
      return;
    }
    if (!this.inputTypeUI) {
      alert("Select Input Type");
      return;
    }
    if (this.companyUI && this.payperiodUI) {
      this.isLoading = true;
      this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.inputTypeUI.inputId)
    }
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
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName,
    };

    this.payPeriodTypefromParent = "Current";

    this.dataSource.filterPredicate = (row: any, filter: string): boolean => {
      return row.currentstatus.toLowerCase().includes(filter);
    };
    this.inputTypeUI = {
        inputId: 1,
        inputType: "Salary"
    };
  }

  selection = new SelectionModel<FinalSubmitGrid>(true, []);

  isAnyFilteredRowSelected(): boolean {
    return this.selection.selected.some(sel =>
      this.dataSource.filteredData.some(row => row.inputLotNumber === sel.inputLotNumber
      )
    );
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  isPartialSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected > 0 && numSelected < numRows;
  }
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach((row: any) => this.selection.select(row));
    }
  }

  toggleRow(row: FinalSubmitGrid) {
    this.selection.toggle(row);
  }


  BindDashBoard(companyId: number, payPeriodId: number, inputId: number) {
    this.onboardService.GetFinalSubmitData(companyId, payPeriodId, inputId, this.userdetail.userId).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        //console.log(res.Data);
        this.dataSource = new MatTableDataSource<any>(res.Data);
        //console.log(this.dataSource);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }
  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }
  onTemplateChange(): void {
    //console.log(this.selectedTemplate);
    this.dataSource.filter = this.selectedTemplate.trim().toLowerCase();
  }
  isSelectedLotSubmitted(): boolean {
    const selected = this.selection.selected;

    if (!selected || selected.length === 0) return false;

    const lotNumbers = [...new Set(selected.map(item => item.inputLotNumber))];

    // Block if multiple lot numbers selected
    if (lotNumbers.length !== 1) return true;

    // Check if any record for the selected lotNumber is already submitted
    return selected.some(item => item.inputLotNumber === lotNumbers[0] && item.isSubmitted === true);
  }


  PsdStatusclick(lotNumber: any, revised: any): void {
    //console.log("PSD Status clicked");
    this.companyIdtopsd = this.companyUI.companyId;
    this.payPeriodIdtopsd = this.payperiodUI.payfrequencyid;
    this.inputTypetopsd = this.inputTypeUI.inputType;
    this.lotNotopsd = lotNumber;
    if (revised) {
      this.inputTexttopsd = "Revised Input";
    } else {
      this.inputTexttopsd = "Input";
    }
    //console.log(this.inputTexttopsd);

    this.showpsd = true;

  }
  FinalSubmitClick(): void {
    this.isLoading = true;
    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );

    const selectedItems = filteredSelected;
    const lotNumbers = [...new Set(selectedItems.map(item => item.inputLotNumber))];

    if (lotNumbers.length > 1) {
      alert('Multiple Lot Number selection not allowed.');
      this.isLoading = false;
      return;
    }

    if (lotNumbers.length === 0) {
      alert("Please select at least one record.");
      this.isLoading = false;
      return;
    }
    const lotNumber = lotNumbers[0];
    const formData = new FormData();
    formData.append('companyCode', this.companyUI.companyCode);
    formData.append('companyId', this.companyUI.companyId);
    formData.append('payPeriod', this.payperiodUI.payPeriod);
    formData.append('payPeriodId', this.payperiodUI.payfrequencyid);
    formData.append('lotNumber', lotNumber);
    formData.append('userId', this.userdetail.userId);

    this.onboardService.PostFinalSubmission(formData).subscribe({
      next: res => {
        const result = res.Data;
        const errormsg = result[0]?.Result;

        if (errormsg === 'Submitted successfully') {
          this.showPopup = true;
          this.popupMessage = "Final Submission Successful";
          this.popupSubMessage = "Important Note: Assignment Lot No: " + lotNumber + " submitted successfully.";
          // this.downloadExcel(this.datatable, "FinalSubmit_Validations");
          this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.inputTypeUI.inputId);
          this.isLoading = false;
        } else {
          alert("No validations returned");
          this.isLoading = false;
        }

        this.isLoading = false;
      },
      error: err => {
        console.error(`Error for lot number ${lotNumber}:`, err.message);
        alert("Submission failed.");
        this.isLoading = false;
      }
    });
  }


  DownloadEmployeeIDReport(inputLotNumber: number) {
    this.isLoading = true;
    const formData = new FormData();
    if (this.companyUI) {
      formData.append('companyId', this.companyUI.companyId);
      formData.append('payPeriod', this.payperiodUI.payPeriod);
      formData.append('lotNumber', inputLotNumber.toString());

      this.onboardService.GetNewJoineeEmployeeId(formData).subscribe({
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

  DownloadRegister(inputLotNumber: number) {
    if (!inputLotNumber) return;

    this.isLoading = true;
    const formData = new FormData();

    formData.append('companyCode', this.companyUI.companyCode);
    formData.append('companyId', this.companyUI.companyId);
    formData.append('payPeriod', this.payperiodUI.payPeriod);
    formData.append('payPeriodId', this.payperiodUI.payfrequencyid);
    formData.append('inputId', this.inputTypeUI.inputId);
    formData.append('lotNumber', inputLotNumber.toString());
    formData.append('flag', "1");

    this.onboardService.GetPayRegister(formData)
      .pipe(
        finalize(() => this.isLoading = false) 
      )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            var base64 = data.file;
            this.downloadExcelFromBase64(base64, data.fileName);
          } else {
            console.error('Unexpected status code', res.StatusCode);
          }
        },
        error: error => {
          console.error('Error:', error);
        }
      });
  }


  onConsolidatedClick(): void {
    this.isLoading = true;

    const filteredSelected = this.selection.selected.filter((item: any) =>
      this.dataSource.filteredData.includes(item)
    );
    const selectedLots = [...new Set(filteredSelected.map(item => item.inputLotNumber))];
    this.lotNoJson = JSON.stringify(selectedLots);

    if (!selectedLots || selectedLots.length === 0) {
      alert("Please select at least one lot.");
      this.isLoading = false;
      return;
    }

    const formData = new FormData();
    formData.append('companyId', this.companyUI.companyId);
    formData.append('payPeriodId', this.payperiodUI.payfrequencyid);
    formData.append('lotNumber', selectedLots.toString());

    this.onboardService.GetConsolidatedPayRegister(formData)
      .pipe(
        finalize(() => this.isLoading = false) // ✅ only one place to stop loading
      )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            this.downloadExcelFromBase64(data.file, data.fileName);
            this.BindDashBoard(this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.inputTypeUI.inputId);
          } else {
            alert("Something went wrong while generating the report.");
          }
        },
        error: error => {
          console.error('Error:', error);
          alert("Server error occurred.");
        }
      });
  }
}

