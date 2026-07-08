import { Component, ElementRef, Inject, InjectionToken, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { CommonModule } from '@angular/common';
import { IActivationLwdService } from '../../../Repository/iactivation-lwd-service';
import { ActivationLwdServiceService } from '../../../Service/activation-lwd-service.service';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSort } from '@angular/material/sort';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { FormsModule } from '@angular/forms';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { PayrollinputComponent } from "../payrollinput.component";
import { finalize } from 'rxjs';

const activationservice = InjectionToken<IActivationLwdService>;

@Component({
  selector: 'activation',
  standalone:true,
  imports: [CommonModule, FormsModule, MatPaginatorModule, MatTableModule, MatSelectModule,
    AlertpopupComponent, PayrollinputComponent],
  templateUrl: './activation-lwd.component.html',
  styleUrl: './activation-lwd.component.css',
  encapsulation: ViewEncapsulation.None,
  providers: [
    {
      provide: activationservice,
      useClass: ActivationLwdServiceService,
    }
  ]
})
export class ActivationLWDComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  selectedCC?: number;
  companyUI: any;
  selectedTemplate: string = '';
  selectedImport: string = '';
  activationlwddetails: any;
  fileUploaded: boolean = false;
  isLoading = false;
  File_Uploaded: any | null = null;
  UploadedResponse: any;
  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  payPeriodTypefromParent: string = '';
  mapnameUI: any;
  viewgrid = false;
  employeeId: string = '';

  constructor(@Inject(activationservice) private _activationservice: IActivationLwdService,
    public stateService: OnboardingStateService, 
    private _encry:EncryptionService,
    private sessionStorageService: SessionStorageService) { }

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

  handleCompanyEvent(company: any) {

    this.companyUI = company
    this.selectedCC = company.companyId;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    //console.log(this.companyUI);
  }

  TemplateOptions = [
    { value: '1', Text: 'Emp Validation' },
    { value: '2', Text: 'LWD' }
  ];

  ImportOptions = [
    { value: '1', Text: 'Emp Validation' },
    { value: '2', Text: 'LWD' }
  ];

  templateDataMap: { [key: string]: any[] } = {};

  onTemplateChange(templateValue: Event): void {

    if(!this.companyUI)
    {
      alert('Please select Company');
      return;
    }
    const value = (templateValue.target as HTMLSelectElement).value;

    if (this.companyUI && this.companyUI.companyCode !== '') {
      this.isLoading = true;
      this._activationservice.GetEmployeeActivationLwd(this.companyUI.companyCode, value).pipe(
            finalize(() => {
              this.isLoading = false;   // always runs
            })
          ).subscribe({
        next: res => {
          this.activationlwddetails = res.Data;

          if (!this.activationlwddetails || !Array.isArray(this.activationlwddetails)) {
            console.warn('No data defined for selected template.');
            return;
          }

          const dataToExport = this.activationlwddetails.map((item: any) => {
            const upperCasedItem: any = {};
            for (const key in item) {
              if (item.hasOwnProperty(key)) {
                upperCasedItem[key.toUpperCase()] = item[key];
              }
            }
            return upperCasedItem;
          });

          this.downloadExcel(dataToExport, value);
          this.isLoading = false;
        },
        error: err => {
          console.error('Error loading data', err);
        }
      });
    }
  }

  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();
  selection = new SelectionModel<any>(true, []);
  lastSelectedTemplate: string = '';

  onSelectImportClicked(): void {
    if (this.selectedImport === this.lastSelectedTemplate) {
      // Reset to allow re-selection of same option
      this.selectedImport = '';
    }
  }


  onImportChange(event: any): void {

    if(!this.companyUI)
    {
      alert('Please select Company');
      return;
    }

    this.lastSelectedTemplate = event.value;
    this.fileUploaded = false;
    this.dataSource = new MatTableDataSource<any>();

    // Reset the file input so the same file can be selected again
    if (this.fileInput) {
      this.fileInput.nativeElement.value = ''; // <-- key line
      this.fileInput.nativeElement.click();
    }
  }

  onFileSelected(event: any): void {
    const target: DataTransfer = <DataTransfer>(event.target);

    if (target.files.length !== 1) {
      console.error('Only one file allowed.');
      return;
    }

    this.fileUploaded = true; // Show the button or section

    const file = target.files[0];
    const reader: FileReader = new FileReader();

    if (file) {
      this.File_Uploaded = file;
    }

    reader.onload = (e: any) => {
      const arrayBuffer: ArrayBuffer = e.target.result;
      const data = new Uint8Array(arrayBuffer);
      const arr = Array.from(data).map(byte => String.fromCharCode(byte)).join('');
      const workbook: XLSX.WorkBook = XLSX.read(arr, { type: 'binary' });

      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      if (jsonData.length > 0) {
        this.tableHeaders = Object.keys(jsonData[0]);

        if (this.selectedImport == "1") {
          this.dynamicColumns = ['EMPLOYEE_CODE', 'EMPLOYEE_NAME', 'DOJ', 'LAST_WORKING_DAY'];
        }
        else if (this.selectedImport == "2") {
          this.dynamicColumns = ['EMPLOYEE_CODE', 'EMPLOYEE_NAME', 'DOJ', 'LAST_WORKING_DAY', 'RELIEVING_LETTER_YES_NO', 'REASON_OF_LEAVING'];
        }
        else {
          this.dynamicColumns = [...this.tableHeaders];
        }

        // Update dynamic columns
        this.displayedColumns = [...this.dynamicColumns]; // Include checkbox column
        this.dataSource = new MatTableDataSource(jsonData.slice(0, 100));
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.viewgrid = true;
      }
    };

    reader.readAsArrayBuffer(file);
  }


  downloadExcel(data: any[], templateId: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };

    // const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    // const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    var fileName;

    if (templateId == "1") {
      fileName = `Employee_Activation_Template.xlsx`;
    }
    else {
      fileName = `LWD_Template.xlsx`;
    }
    // FileSaver.saveAs(blob, fileName);
    XLSX.writeFile(workbook, fileName);
  }

  // UploadActivationLwd() {
  //   this.isLoading = true;
  //   if (this.dataSource.filteredData.length > 0) {

  //     const formData = new FormData();
  //     if (this.fileUploaded) {
  //       formData.append('file', this.File_Uploaded);
  //       formData.append('User', String(this.employeeId));
  //       formData.append('COMPANY_CODE', String(this.companyUI.companyCode));
  //       formData.append('FLAG', String(this.selectedImport));

  //       if (this.selectedImport == "1") {
  //         this._activationservice.UploadEmployeeActivation(formData).subscribe({
  //           next: res => {
  //             this.UploadedResponse = res;

  //             if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Import Successfully Done.') {
  //               alert('Import Successfully Done.');
  //               this.isLoading = false;
  //               this.showPopup = true;
  //               this.popupMessage = 'Import Successfully Done.';
  //             }
  //             else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

  //               const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
  //               const exportData = errorArray.map((item: any) => ({
  //                 MESSAGE: item.MESSAGE || item.Message || ''
  //               }));

  //               const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  //               const workbook: XLSX.WorkBook = {
  //                 Sheets: { 'ErrorMessages': worksheet },
  //                 SheetNames: ['ErrorMessages']
  //               };
  //               XLSX.writeFile(workbook, 'ErrorMessages_EmpActivation.xlsx');
  //               this.isLoading = false;
  //               this.showPopup = true;
  //               this.popupMessage = 'Import Failed.';

  //             }
  //             else {
  //               alert('Error while processing response.');
  //               this.isLoading = false;
  //             }
  //           },
  //           error: err => {
  //             console.error('❌ Upload failed', err);
  //           }
  //         });
  //       }
  //       else if (this.selectedImport == "2") {
  //         this._activationservice.UploadEmployeeLWD(formData).subscribe({
  //           next: res => {
  //             this.UploadedResponse = res;

  //             if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Import Successfully Done.') {
  //               alert('Import Successfully Done.');
  //               this.isLoading = false;
  //               this.showPopup = true;
  //               this.popupMessage = 'Import Successfully Done.';
  //             }
  //             else if (this.UploadedResponse.statuscode === 200 && this.UploadedResponse.data.response === 'Failed to import.') {

  //               const errorArray = JSON.parse(this.UploadedResponse.data.errors[0]);
  //               const exportData = errorArray.map((item: any) => ({
  //                 MESSAGE: item.MESSAGE || item.Message || ''
  //               }));

  //               const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
  //               const workbook: XLSX.WorkBook = {
  //                 Sheets: { 'ErrorMessages': worksheet },
  //                 SheetNames: ['ErrorMessages']
  //               };

  //               XLSX.writeFile(workbook, 'ErrorMessages_LWD.xlsx');
  //               this.isLoading = false;
  //               this.showPopup = true;
  //               this.popupMessage = 'Import Failed.';

  //             }
  //             else {
  //               alert('Error while processing response.');
  //               this.isLoading = false;
  //             }
  //           },
  //           error: err => {
  //             console.error('❌ Upload failed', err);
  //           }
  //         });
  //       }
  //     }
  //   }

  // }

  UploadActivationLwd() {
    this.isLoading = true;
    if (this.dataSource.filteredData.length > 0) {

      const formData = new FormData();
      if (this.fileUploaded) {
        formData.append('file', this.File_Uploaded);
        formData.append('User', String(this.employeeId));
        formData.append('COMPANY_CODE', String(this.companyUI.companyCode));
        formData.append('FLAG', String(0));

        
          this._activationservice.UploadEmployeeActivation(formData).pipe(
            finalize(() => {
              this.isLoading = false;   // always runs
            })
          ).subscribe({
            next: res => {
              this.UploadedResponse = res;

              if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Import Successfully Done.') {
                alert('Import Successfully Done.');
                this.isLoading = false;
                this.showPopup = true;
                this.popupMessage = 'Import Successfully Done.';
              }
              else if (this.UploadedResponse.StatusCode === 200 && this.UploadedResponse.Data.response === 'Failed to import.') {

                const errorArray = JSON.parse(this.UploadedResponse.Data.errors[0]);
                const exportData = errorArray.map((item: any) => ({
                  MESSAGE: item.MESSAGE || item.Message || ''
                }));

                const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
                const workbook: XLSX.WorkBook = {
                  Sheets: { 'ErrorMessages': worksheet },
                  SheetNames: ['ErrorMessages']
                };
                XLSX.writeFile(workbook, 'ErrorMessages_EmpActivationLwd.xlsx');
                this.isLoading = false;
                this.showPopup = true;
                alert('Failed to import.');

              }
              else {
                alert('Error while processing response.');
                this.isLoading = false;
              }
            },
            error: err => {
              alert('Error while processing response.');
                this.isLoading = false;
              console.error('❌ Upload failed', err);
            }
          });        
      }
    }

  }

  dropdownOptions = ['Emp Activation', 'L W D']; // dynamic values
  selectedOption = 'Export'; // default selected
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(option: string) {
    this.selectedOption = option;
    this.isDropdownOpen = false;
  }

}
