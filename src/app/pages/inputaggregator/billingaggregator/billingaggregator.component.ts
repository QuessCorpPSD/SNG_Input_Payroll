import { Component, ViewChild } from '@angular/core';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { finalize } from 'rxjs';
import { Payperiodclass, Company } from '../../../Models/Common';
import { InputaggregatorService } from '../../../Service/inputaggregator/inputaggregator.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { InputaggregatoronboardingComponent } from '../inputaggregatoronboarding/inputaggregatoronboarding.component';



interface ClientAttribute {
  Client_Attribute_Id: number;
  Client_Attribute_Name: string;
}

interface ClientAttribute {
  Template_Field_Id: number;
  Template_Field_Name: string;
}

interface AttributeMapping {
  clientAttribute: string;
  quessAttribute: string;
  Template_Field_Name: string;
  SelectedQuessAttributeId: any;
}

interface QuessAttribute {
  Quess_Template_Field_Id: number;
  Quess_Template_Field_Name: string;
  IsActive: boolean;
}


@Component({
  selector: 'app-billingaggregator',
  standalone: true,
  imports: [CommonModule, FormsModule, InputaggregatoronboardingComponent, MatTableModule, MatPaginator, MatIconModule],
  templateUrl: './billingaggregator.component.html',
  styleUrl: './billingaggregator.component.css'
})
export class BillingaggregatorComponent {
  mapname: any;
  userdetail: any;
  sitename: any;
  isLoading = false;
  SelectedQuessAttributeId: any;
  selectCompanyId: any;
  selectCompanyCode: any;
  payPeriod!: Payperiodclass;
  payperiodId: any;
  payperiods: any;
  payPeriodType: any;
  selectedInputType: string = 'Billing';
  billingAttributes: any[] = [];
  attendanceAttributes: any[] = [];

  filteredBillingAttributes: any[] = [];
  filteredAttendanceAttributes: any[] = [];
  inputTypes: string[] = ['Attendance', 'Billing'];
  quessAttendanceAttributes: QuessAttribute[] = [];
  Attendancesearch: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [
    'action',
    'clientattributes',
    'quessattributes',
  ];
  payPeriodTypefromParent: any;
  companyUI: any;
  payperiodUI: any;
  siteNameUI: any;
  currentUploadType: string = '';
  showInfocliPopup: boolean = false;
  searchQueryclient: any;
  clientquessAttributes: any;
  ismappingDropdownOpen = false;
  isattributesDropdownOpen: any;
  constructor(private service: InputaggregatorService,
    private decry: EncryptionService, private _sessionStoreage: SessionStorageService) {

  }
  isCompanyDropdownOpen = false;
  isMapDropdownOpen = false;
  isSiteDropdownOpen = false;
  isManagerDropdownOpen = false;
  isAttendanceDropdownOpen = false;
  isReportDropdown = false;
  isTemplateDropdownOpen = false;
  openAttributeDropdown: number | null = null;

  searchText = '';
  searchQuery = '';
  selectedItem: string | null = null;
  quessMasterAttributes: QuessAttribute[] = [];

  selectedItems: { [key: number]: string } = {};
  selectedItemcli: string = '';

  selectedCompanyId: any;
  selectedCompanyCode: any;
  showInfoPopup = false;
  showreportPopup = false;
  isDropdownOpen = false;
  @ViewChild('paginator') paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  toggleattributesdropdownopen() {
    this.isattributesDropdownOpen = !this.isattributesDropdownOpen;
  }
  toggleDropdown(event: Event) {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectOption(type: string, fileInput5: any) {
    this.isDropdownOpen = false;


    fileInput5.click(); // open file picker
  }

  deleteClientAttribute(item: any) {

    if (!confirm('Are you sure you want to delete this attribute?')) {
      return;
    }

    const companyId = this.companyUI?.companyId;
    const siteId = this.siteNameUI.siteCode;
    const templateId = item.Template_Field_Id;
    const createdBy = this.userdetail?.user_Id;

    this.service
      .clientattributeMasterdelete(companyId, siteId, templateId, createdBy)
      .subscribe({

        next: (res: any) => {

          const index = this.clientquessAttributes.findIndex(
            (x: any) =>
              x.Template_Field_Id === item.Template_Field_Id
          );

          if (index !== -1) {
            this.clientquessAttributes.splice(index, 1);

            // refresh UI
            this.clientquessAttributes = [...this.clientquessAttributes];
          }

          alert(res?.Data?.data?.Table0?.[0]?.Error_Message);

        },

        error: (err) => {

          console.error('Delete failed', err);

        }

      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // ------------------client attributes start------------------------
  closeInfocliPopup() {
    this.showInfocliPopup = false;
  }
  toggleInfocliPopup() {
    if (!this.companyUI) {
      alert("Please select company");
      return;
    }
    this.showInfocliPopup = !this.showInfocliPopup;
  }
  loadClientAttributes() {
    this.clientquessAttributes = [];
    this.service.clientattributeMaster(this.companyUI.companyId, this.siteNameUI.siteCode).subscribe(res => {
      const data = res?.Data?.data?.Table0;

      if (!data || data.length === 0) {
        this.clientquessAttributes = [];
      } else {
        this.clientquessAttributes = data as ClientAttribute[];
      }
    });
  }
  selectItemcli(namecli: string) {
    this.selectedItemcli = namecli;
  }

  get filteredclientAttributes(): ClientAttribute[] {
    if (!this.searchQueryclient) {
      return this.clientquessAttributes;
    }

    return this.clientquessAttributes.filter(item =>
      item.Template_Field_Name
        .toLowerCase()
        .includes(this.searchQueryclient.toLowerCase())
    );
  }
  deleteRow(element: any, index: number) {

    if (!confirm('Are you sure you want to delete this mapping?')) {
      return;
    }

    const companyId = this.companyUI?.companyId;
    const templateId = element.Template_Field_Id;
    const quessTemplateFieldId = element.SelectedQuessAttributeId;
    const createdBy = this.userdetail?.user_Id;

    if (!companyId || !templateId || !quessTemplateFieldId) {
      alert('Required values missing');
      return;
    }

    this.isLoading = true;

    this.service
      .MappingAttributesDelete(
        companyId,
        templateId,
        quessTemplateFieldId,
        createdBy
      )
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({

        next: (res: any) => {

          this.attributeMappings.splice(index, 1);

          this.dataSource.data = [...this.attributeMappings];

          alert(res?.Data?.data?.Table0?.[0]?.Error_Message);

        },

        error: (err) => {
          console.error('Delete failed', err);
        }

      });
  }
  downloadExcelclient() {
    if (!this.filteredclientAttributes || this.filteredclientAttributes.length === 0) {
      return;
    }
    this.isLoading = true;

    const excelData = this.filteredclientAttributes.map(item => ({
      ID: item.Template_Field_Id,
      Clientquess_Template_Field_Name: item.Template_Field_Name
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'ClientAttributes_Attendance': worksheet },
      SheetNames: ['ClientAttributes_Attendance']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    this.isLoading = false;
    saveAs(blob, 'Client_Attributes_Attendance.xlsx');

  }
  openPreviewPopup(data: any[], type: string) {
    this.currentUploadType = type;

    this.previewData = data;

    if (data.length > 0) {
      this.previewColumns = Object.keys(data[0]);
    }

    this.showUploadPopup = true;
  }
  handleCompanysEvent(company: Company | null) {
    if (!company) {
      this.selectCompanyId = null;
      this.selectCompanyCode = null;
      return;
    }
    this.companyUI = company;
    this.selectCompanyId = company;
    this.selectCompanyCode = company.companyCode;
  }

  handleSiteNameEvent(site: any) {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    this.siteNameUI = site;
    console.log('Site', this.siteNameUI);
  }

  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  // handlePayperiodEvent(payperiod: Payperiodclass) {
  //   this.payPeriod = payperiod;
  //   this.payperiodId = payperiod.payfrequencyid;
  //   this.payperiods = payperiod.payPeriod;

  // }
  // toggleInfoPopup() {
  //   this.showInfoPopup = !this.showInfoPopup;
  // }

  toggleInfoPopup() {

    if (!this.selectedInputType) {
      alert('Please select Input Type');
      return;
    }

    this.searchQuery = '';
    if (this.selectedInputType === 'Billing') {

      this.service.getQuessMasterAttributes().subscribe(res => {
        this.quessMasterAttributes =
          res?.Data?.data?.Table0 as QuessAttribute[] || [];

        this.showInfoPopup = true;
      });

    } else if (this.selectedInputType === 'Attendance') {

      this.service.getQuessAttendanceAttributes().subscribe(res => {
        this.quessMasterAttributes =
          res?.Data?.data?.Table0 as QuessAttribute[] || [];
        this.showInfoPopup = true;
      });

    }
  }


  closeInfoPopup() {
    this.showInfoPopup = false;
  }

  closereportPopup() {
    this.showreportPopup = false;
  }
  togglereportPopup() {
    this.showreportPopup = !this.showreportPopup;
  }
  ngOnInit() {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    } else {
      console.warn('UserProfile not found in session storage');
    }
    this.loadQuessAttributes();
    // this.loadQuessAttendanceAttributes();
    this.payPeriodTypefromParent = "All";

    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const filterText = filter.trim().toLowerCase();

      // Client attribute
      const clientAttr = String(
        data.Template_Field_Name ?? ''
      ).toLowerCase();

      // Get dropdown selected object
      const selectedQuess = this.quessMasterAttributes.find(
        q => q.Quess_Template_Field_Id == data.SelectedQuessAttributeId
      );

      // Quess attribute name
      const quessName = String(
        selectedQuess?.Quess_Template_Field_Name ?? ''
      ).toLowerCase();

      return (
        clientAttr.includes(filterText) ||
        quessName.includes(filterText)
      );
    };
    if (!this.siteNameUI) {
      this.siteNameUI = {
        siteCode: '0',
        siteName: 'All'
      };
    }

  }


  handleCompanyEvent(company: any) {
    this.companyUI = company;
    // if (!this.companyUI) {
    //   alert("Select Company Code");
    //   return;
    // }

    this.BindMapname();
    this.BindSitename();
    this.loadClientAttributes();

  }
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    // if (!this.payperiodUI) {
    //   alert("Select Pay Period");
    //   return;
    // }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }
  BindMapname() {
    const companyid = this.companyUI;
    this.service.getmapname(companyid).subscribe({
      next: res => {
        this.mapname = res.Data;
      }
    });
  };
  BindSitename() {
    const companyid = this.companyUI.companyId || 0;
    const groupid = 0;

    this.service.SiteSearch(companyid, groupid).subscribe({
      next: res => {
        this.sitename = res.Data?.data?.Table0;
      }
    });
  };
  loadQuessAttributes() {
    this.service.getQuessMasterAttributes()
      .subscribe(res => {
        const data = res?.Data?.data?.Table0;

        if (!data || data.length === 0) {
          this.quessMasterAttributes = [];
        } else {
          this.quessMasterAttributes = data as QuessAttribute[];
        }
      });


  }

  loadQuessAttendanceAttributes() {
    this.service.getQuessAttendanceAttributes().subscribe(res => {
      this.quessAttendanceAttributes =
        res?.Data?.data?.Table0 as QuessAttribute[] || [];
    });
  }
  trackByIndex(index: number, item: any) {
    return index;
  }


  attributeMappings: AttributeMapping[] = [];

  selectItem(name: string) {
    this.selectedItem = name;
  }

  get filteredAttributes(): QuessAttribute[] {
    if (!this.searchQuery) {
      return this.quessMasterAttributes;
    }

    return this.quessMasterAttributes.filter(item =>
      item.Quess_Template_Field_Name
        .toLowerCase()
        .includes(this.searchQuery.toLowerCase())
    );
  }

  toggleTemplateDropdown() {
    this.isTemplateDropdownOpen = !this.isTemplateDropdownOpen;
  }
  toggleMappingDropdown() {
    this.ismappingDropdownOpen = !this.ismappingDropdownOpen;
  }
  toggleReprotDropdown() {
    this.isReportDropdown = !this.isReportDropdown;
  }



  downloadTemplate(type: 'mapping' | 'client') {
    this.isTemplateDropdownOpen = false;

    let worksheet: XLSX.WorkSheet;
    let workbook: XLSX.WorkBook;
    let fileName: string;

    if (type === 'mapping') {

      const headers = [
        'COMPANY_CODE',
        'GROUP_NAME',
        'CLIENT_ATTRIBUTE_NAME',
        'QUESS_ATTRIBUTE_NAME',
        'EFFECTIVE_DATE',
        'ISACTIVE',
        'MODE'
      ];

      const data = this.filteredAttributes.map(item => ({
        COMPANY_CODE: this.companyUI.companyCode || '',
        GROUP_NAME: this.siteNameUI.siteName || '',
        CLIENT_ATTRIBUTE_NAME: '',
        QUESS_ATTRIBUTE_NAME: item.Quess_Template_Field_Name,
        EFFECTIVE_DATE: '',
        ISACTIVE: '',
        MODE: ''
      }));

      worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
      fileName = 'Attributes_Mapping_Template.xlsx';

    } else {

      const headers = [
        'COMPANY_CODE',
        'GROUP_NAME',
        'CLIENT_ATTRIBUTE_NAME',
        'ISACTIVE',
        'MODE'
      ];

      worksheet = XLSX.utils.aoa_to_sheet([headers]);
      fileName = 'Client_Attributes_Template.xlsx';
    }

    workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template');

    XLSX.writeFile(workbook, fileName);
  }

  downloadExcelBillablereport() {
    if (!this.companyUI) {
      alert("Please select company");
      return;
    }
    if (!this.payperiodUI) {
      alert("Please select payperiod");
      return;
    }


    this.isLoading = true;
    this.service
      .downloadBillableReport(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
      .subscribe({
        next: (res: any) => {

          if (res.StatusCode === 200) {

            const tables = res?.Data?.data;

            // Check empty response
            if (!tables || Object.keys(tables).length === 0) {
              alert('No records Found');
              this.isLoading = false;
              return;
            }

            // Create workbook
            const workbook: XLSX.WorkBook = XLSX.utils.book_new();

            Object.keys(tables).forEach((tableName: string, index: number) => {

              const tableData = tables[tableName];

              if (tableData && tableData.length > 0) {

                const worksheet: XLSX.WorkSheet =
                  XLSX.utils.json_to_sheet(tableData);

                // Custom sheet names
                let sheetName = '';

                switch (tableName) {
                  case 'Table0':
                    sheetName = 'Billable Report';
                    break;

                  case 'Table1':
                    sheetName = 'Otherincome Payout';
                    break;

                  case 'Table2':
                    sheetName = 'Client Invoice data';
                    break;

                  default:
                    sheetName = `Report_${index + 1}`;
                }

                XLSX.utils.book_append_sheet(
                  workbook,
                  worksheet,
                  sheetName
                );
              }
            });

            // Generate Excel buffer
            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array'
            });

            // Create blob
            const blob = new Blob(
              [excelBuffer],
              {
                type:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
              }
            );

            // Download file
            saveAs(blob, 'Billable_Report.xlsx');

          } else if (res.StatusCode === 404) {
            alert('No Resource found');

          } else if (res.Data.statusCode === 400) {
            alert('Invalid request');

          } else if (res.Data.statusCode === 500) {
            alert('Server error, please try again later');

          } else {
            alert('Something went wrong');
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.log("err", err);
          this.isLoading = false;
        }
      });
  }



  downloadExcel() {
    if (!this.filteredAttributes || this.filteredAttributes.length === 0) {
      return;
    }
    this.isLoading = true;

    const excelData = this.filteredAttributes.map(item => ({
      ID: item.Quess_Template_Field_Id,
      Quess_Template_Field_Name: item.Quess_Template_Field_Name
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = {
      Sheets: { Attributes: worksheet },
      SheetNames: ['Attributes']
    };

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array'
    });

    const blob = new Blob([excelBuffer], {
      type:
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
    });
    this.isLoading = false;
    saveAs(blob, `Quess_Attributes.xlsx`);

  }
  Finalsubmissionclick() {
    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }
    if (!this.payperiodUI) {
      alert("Please Select Pay period");
      return;
    }



    this.isLoading = true;
    this.service
      .downloadFinalSubmission(this.companyUI.companyId, this.payperiodUI.payfrequencyid)
      .subscribe({
        next: (res: any) => {

          if (res.StatusCode === 200) {

            const tables = res?.Data?.data;

            if (!tables || Object.keys(tables).length === 0) {
              alert('No records Found');
              this.isLoading = false;
              return;
            }

            const workbook: XLSX.WorkBook = XLSX.utils.book_new();

            Object.keys(tables).forEach((tableName: string, index: number) => {

              const tableData = tables[tableName];

              if (tableData && tableData.length > 0) {

                const worksheet: XLSX.WorkSheet =
                  XLSX.utils.json_to_sheet(tableData);

                let sheetName = '';

                switch (tableName) {
                  case 'Table0':
                    sheetName = 'Final submission Report';
                    break;

                  // case 'Table1':
                  //   sheetName = 'Otherincome Payout';
                  //   break;

                  // case 'Table2':
                  //   sheetName = 'Client Invoice data';
                  //   break;

                  default:
                    sheetName = `Report_${index + 1}`;
                }

                XLSX.utils.book_append_sheet(
                  workbook,
                  worksheet,
                  sheetName
                );
              }
            });

            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array'
            });

            const blob = new Blob(
              [excelBuffer],
              {
                type:
                  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
              }
            );

            saveAs(blob, 'Billing_Finalsubmission_report.xlsx');

          } else if (res.StatusCode === 404) {
            alert('No Resource found');

          } else if (res.Data.statusCode === 400) {
            alert('Invalid request');

          } else if (res.Data.statusCode === 500) {
            alert('Server error, please try again later');

          } else {
            alert(res.Data.data.Error_Message);
          }

          this.isLoading = false;
        },
        error: (err) => {
          console.log("err", err);
          this.isLoading = false;
        }
      });

  }


  handleSearch(): void {
    // if (!this.selectedInputType) {
    //   alert("Please Select Input Type");
    //   return;
    // }

    if (!this.companyUI) {
      alert("Please Select Company");
      this.dataSource.data = [];
      return;
    }

    this.isLoading = true;

    this.service.search(this.companyUI.companyId, this.siteNameUI.siteCode)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {
          const tableData = res?.Data?.data?.Table0;

          if (!tableData || tableData.length === 0) {
            alert("No records found");
            this.dataSource.data = [];
            this.loadClientAttributesFallback();
            return;
          }

          this.bindClientAttributes(tableData);
        },
        error: () => {
          this.loadClientAttributesFallback();
        }
      });
  }





  loadClientAttributesFallback(): void {
    this.service.getClientAttributes(this.companyUI.companyId, this.siteNameUI.siteCode).subscribe(res => {
      const tableData = res?.Data?.data?.Table0 || [];
      this.bindClientAttributes(tableData);
    });
  }
  bindClientAttributes(data: any[]): void {
    this.attributeMappings = data.map(item => ({
      clientAttribute: item.Template_Field_Name,
      quessAttribute: item.Quess_Template_Field_Name || '',
      Template_Field_Name: item.Template_Field_Name,
      SelectedQuessAttributeId: item.Quess_Template_Field_Id || '',
      Template_Field_Id: item.Template_Field_Id,
      Quess_Template_Field_Id: item.Quess_Template_Field_Id

    }));
    this.dataSource.data = this.attributeMappings;
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  toggleAttributeDropdown(index: number): void {
    if (this.openAttributeDropdown === index) {
      this.openAttributeDropdown = null;
    } else {
      this.openAttributeDropdown = index;
    }
  }

  updateAttribute(index: number, value: string) {
    this.attributeMappings[index].quessAttribute = value;
    this.openAttributeDropdown = null;
  }
  ImportClickcli(fileInput1: HTMLInputElement): void {
    fileInput1.click();
  }
  onFileChangecli(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = ''; // reset file input
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.Uploadcli(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (res) => {

          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any data.');
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponse(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `ClientAttributes_ErrorMessages.xlsx`
            );
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback);
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err);
        }
      });
  }



  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }
  ImportClickatt(fileInput2: HTMLInputElement): void {
    fileInput2.click();
  }
  onFileChangeatt(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = ''; // reset file input
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    // 🔄 START LOADING
    this.isLoading = true;

    this.service.Upload(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {

          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any Data.');
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponseatt(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `AttributesMapping_ErrorMessages.xlsx`
            );
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback);
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err.error.message);
        }
      });
  }




  tryParseResponseatt(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }



  showUploadPopup = false;
  selectedFile!: File;
  previewData: any[] = [];
  previewColumns: string[] = [];

  previewExcelFile(file: File) {

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = (e: any) => {

      const workbook = XLSX.read(e.target.result, { type: 'array' });

      const sheetName = workbook.SheetNames[0];

      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      this.previewData = jsonData;

      this.previewColumns = jsonData.length
        ? Object.keys(jsonData[0])
        : [];

      this.showUploadPopup = true;
    };

    reader.readAsArrayBuffer(file);
  }

  submitUpload() {

    switch (this.currentUploadType) {

      case 'Billing Report':
        this.submitUploadBillingreport();
        break;

      case 'MSC':
        this.submitUploadMSC();
        break;

      case 'OI':
        this.submitUploadOI();
        break;


    }
  }
  ImportClickclient(fileInput: HTMLInputElement): void {

    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please Select Pay period");
      return;
    }

    fileInput.value = '';
    fileInput.click();

    this.currentUploadType = 'Billing Report';

  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = ''; // reset file input
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // this.previewData = jsonData;
      // this.previewColumns = jsonData.length ? Object.keys(jsonData[0]) : [];
      // this.showUploadPopup = true;
      this.previewExcelFile(file);

    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadBillingreport() {
    if (!this.selectedFile) {
      alert("Please Select File");
      return;
    };
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyId', this.companyUI?.companyId);
    formData.append('SiteId', this.siteNameUI.siteCode);
    formData.append('PayPeriodId', this.payperiodUI.payfrequencyid);


    this.isLoading = true;

    this.service.Uploadclient(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (!res || !res.Data) {
            alert(res.Data);
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponseClient(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            this.closeUploadPopup();
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, `AttributesMapping_ErrorMessages.xlsx`);
            this.closeUploadPopup();
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          // fallback
          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) : parsed?.Error_Message ?? res.Data.errors.Error_Message);
          alert(fallback);
        },
        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err.error.message);
        }
      });
  }

  tryParseResponseClient(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };
    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }


  closeUploadPopup() {
    this.showUploadPopup = false;
    this.previewData = [];
    this.previewColumns = [];
  }


  // This is For Input Aggregator 
  handleSearchattendance(): void {
    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }
    // this.isshowtable = true;
    this.isLoading = true;

    this.service.searchattendance(this.companyUI.companyId, this.siteNameUI.siteCode)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res) => {

          const tableData = res?.Data?.data?.Table0;
          if (!tableData || tableData.length === 0) {
            alert("No records found");
            this.Attendancesearch = [];
            return;
          }

          this.bindAttendance(tableData);
        },
        error: (err) => {
          console.error(err);
          this.Attendancesearch = [];
        }
      });
  }
  bindAttendance(data: any[]): void {

    this.Attendancesearch = data.map(item => ({
      clientattributes: item.ClientAttributes,
      quessatributes: item.QuessMasterAttributes,
    }));

  }
  downloadExcelBillablereportAttendance() {
    if (!this.selectCompanyId || !this.payperiodId) {
      alert("Please Select Company and PayPeriod");
      return;
    }

    this.isLoading = true;
    this.service
      .downloadBillableReportattendance(this.selectCompanyId, this.payperiodId, this.siteNameUI.siteCode)
      .subscribe({
        next: (res: any) => {
          if (res.StatusCode === 200) {
            const data = res?.Data?.data?.Table0;
            const err = res;
            if (!data || data.length === 0) {
              alert('No records Found');
              this.isLoading = false;
              return;
            }

            const worksheet: XLSX.WorkSheet =
              XLSX.utils.json_to_sheet(data);

            const workbook: XLSX.WorkBook = {
              Sheets: { 'Billable Report': worksheet },
              SheetNames: ['Billable Report']
            };

            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array'
            });

            const blob = new Blob([excelBuffer], {
              type:
                'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            });

            saveAs(blob, 'Billable_Report.xlsx');
          } else if (res.StatusCode === 404) {
            alert('No Resource found');
          } else if (res.Data.statusCode === 400) {
            alert('Invalid request');
          } else if (res.Data.statusCode === 500) {
            alert('Server error, please try again later');
          } else {
            alert('Something went wrong');
          }
          this.isLoading = false;

        },
        error: (err) => {
          console.log("err", err);
          // alert(err.error.message);

          this.isLoading = false;
        }
      });
  }

  ImportClickcliattendance(fileInput3: HTMLInputElement): void {
    fileInput3.click();
  }
  onFileChangecliattendance(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      alert('Please upload only one Excel file.');
      return;
    }

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = ''; // reset file input
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.Uploadattendancecli(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (res) => {

          if (!res || !res.Data) {
            alert(res.Data);
            return;
          }

          const response = res.Data.response;

          // if (response && response.includes("Row(s) Uploaded Successfully.")) {
          //   alert(res.Data.response);
          //   return;
          // }

          const { parsed, msg } = this.tryParseResponse(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            // ✅ Use Error_Message instead of Validation
            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `ClientAttributes_ErrorMessages.xlsx`
            );
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback);
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err);
        }
      });
  }



  tryParseResponseattendance(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }
  ImportClickattattendance(fileInput4: HTMLInputElement): void {
    fileInput4.click();
  }
  onFileChangeattattendance(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = ''; // reset file input
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    // 🔄 START LOADING
    this.isLoading = true;

    this.service.Uploadattendanceattributes(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {

          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any Data.');
            return;
          }

          const response = res.Data.response;

          // if (response && response.includes("Row(s) Uploaded Successfully.")) {
          //   alert(res.Data.response);
          //   return;
          // }

          const { parsed, msg } = this.tryParseResponseattattendance(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `AttributesMapping_ErrorMessages.xlsx`
            );
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback);
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err.error.message);
        }
      });
  }




  tryParseResponseattattendance(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }



  // showUploadPopupattendance = false;
  selectedFileattendance!: File;
  previewDataattendance: any[] = [];
  previewColumnsattendance: string[] = [];

  ImportClickclientattendance(fileInput5: HTMLInputElement): void {

    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }

    fileInput5.value = '';
    fileInput5.click();
  }

  onFileChangeattendance(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = ''; // reset file input
      return;
    }

    this.selectedFileattendance = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      this.previewDataattendance = jsonData;
      this.previewColumnsattendance = jsonData.length ? Object.keys(jsonData[0]) : [];
      this.showUploadPopup = true; // show popup with table
    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadattendance() {
    if (!this.selectedFileattendance) {
      alert("Please Select File");
      return;
    };
    const formData = new FormData();
    formData.append('file', this.selectedFileattendance);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyId', this.companyUI?.companyId);

    this.isLoading = true;

    this.service.Uploadclientattendance(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any data.');
            return;
          }

          const response = res.Data.response;

          // Success message
          // if (response && response.includes("Row(s) Uploaded Successfully.")) {
          //   alert(res.data.response);
          //   this.closeUploadPopup();
          //   return;
          // }

          const { parsed, msg } = this.tryParseResponseClientattendance(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            this.closeUploadPopup();
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, `ClientInput_ErrorMessages.xlsx`);
            this.closeUploadPopup();
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          // fallback
          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) : parsed?.Error_Message ?? '');
          alert(fallback);
        },
        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err.error.message);
        }
      });
  }

  tryParseResponseClientattendance(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };
    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }

  // ---------------------------------------MSC Upload----------------------------------------

  ImportClickMSC(fileInput6: HTMLInputElement): void {
    this.currentUploadType = 'MSC';

    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please Select Pay period");
      return;
    }

    fileInput6.value = '';
    fileInput6.click();

  }

  onFileChangeMSC(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // this.previewData = jsonData;
      // this.previewColumns = jsonData.length ? Object.keys(jsonData[0]) : [];
      // this.showUploadPopup = true;
      this.previewExcelFile(file);

    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadMSC() {
    if (!this.selectedFile) {
      alert("Please Select File");
      return;
    };
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyId', this.companyUI?.companyId);
    formData.append('SiteId', this.siteNameUI.siteCode);
    formData.append('PayPeriodId', this.payperiodUI.payfrequencyid);


    this.isLoading = true;

    this.service.UploadMSC(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (!res || !res.Data) {
            alert(res.Data);
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponseMSC(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            this.closeUploadPopup();
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, `ClientInputMSC_ErrorMessages.xlsx`);
            this.closeUploadPopup();
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          // fallback
          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) : parsed?.Error_Message ?? res.Data.errors.Error_Message);
          alert(fallback);
        },
        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err.error.message);
        }
      });
  }

  tryParseResponseMSC(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };
    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }
  // --------------------------------client attributes other income upload--------------------------------
  ImportClickOIattributes(fileInput8: HTMLInputElement): void {
    fileInput8.click();
  }
  onFileChangeOIattributes(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.ClientattributesUploadOI(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
      }))
      .subscribe({
        next: (res) => {

          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any Data.');
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponseOI(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `OtherIncomeAttributesOI_ErrorMessages.xlsx`
            );
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback);
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err);
        }
      });
  }



  tryParseResponseOI(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }
  // ------------------------------------other income attributesMapping upload--------------------------------

  ImportClickattOI(fileInput9: HTMLInputElement): void {
    fileInput9.click();
  }
  onFileChangeattOI(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];

    if (!file) {
      console.error('Please upload only one Excel file.');
      return;
    }

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = ''; // reset file input
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('CreatedBy', this.userdetail.user_Id);

    // 🔄 START LOADING
    this.isLoading = true;

    this.service.attributesMappingUploadOI(formData)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res) => {

          if (!res || !res.Data) {
            alert('Upload request processed. Server did not return any Data.');
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponseattOI(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(
              workbook,
              `OtherIncomeAttributesMapping_ErrorMessages.xlsx`
            );
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) :
              (parsed?.Error_Message ?? ''));

          alert(fallback);
        },

        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err.error.message);
        }
      });
  }




  tryParseResponseattOI(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };

    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    // string
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }
  // --------------------------client Input other income upload--------------------------------
  ImportClickOI(fileInput7: HTMLInputElement): void {
    this.currentUploadType = 'OI';

    if (!this.companyUI) {
      alert("Please Select Company");
      return;
    }

    if (!this.payperiodUI) {
      alert("Please Select Pay period");
      return;
    }

    fileInput7.value = '';
    fileInput7.click();

  }

  onFileChangeOI(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (!(fileName.endsWith('.xlsx') || fileName.endsWith('.xls'))) {
      alert('Please upload a valid Excel file (.xlsx or .xls only)');
      input.value = '';
      return;
    }

    this.selectedFile = file;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // this.previewData = jsonData;
      // this.previewColumns = jsonData.length ? Object.keys(jsonData[0]) : [];
      // this.showUploadPopup = true;
      this.previewExcelFile(file);

    };

    reader.readAsArrayBuffer(file);
  }

  submitUploadOI() {
    if (!this.selectedFile) {
      alert("Please Select File");
      return;
    };
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyId', this.companyUI?.companyId);
    formData.append('SiteId', this.siteNameUI.siteCode);
    formData.append('PayPeriodId', this.payperiodUI.payfrequencyid);


    this.isLoading = true;

    this.service.UploadOI(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (!res || !res.Data) {
            alert(res.Data);
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponseotherincome(response);



          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            this.closeUploadPopup();
            return;
          }

          if (res?.StatusCode === 200 && response.toLowerCase().includes('failed to import.')) {
            alert(res.Data.response);
            const rawErr = res.Data.errors?.[0];
            let errorArray: any[] = [];

            try {
              if (typeof rawErr === 'string') {
                const tryJson = JSON.parse(rawErr);
                errorArray = Array.isArray(tryJson) ? tryJson : [tryJson];
              } else if (Array.isArray(rawErr)) {
                errorArray = rawErr;
              } else if (rawErr) {
                errorArray = [rawErr];
              }
            } catch {
              errorArray = rawErr ? [{ Error_Message: String(rawErr) }] : [];
            }

            const exportData = errorArray.map((item: any) => ({
              Error_Message: item?.Error_Message || ''
            }));

            const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
            const workbook: XLSX.WorkBook = {
              Sheets: { ErrorMessages: worksheet },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, `ClientInputOI_ErrorMessages.xlsx`);
            this.closeUploadPopup();
            return;
          }
          else {
            alert(res.Data.response);
            return;
          }

          // fallback
          const fallback =
            msg ||
            (Array.isArray(parsed) ? JSON.stringify(parsed) : parsed?.Error_Message ?? res.Data.errors.Error_Message);
          alert(fallback);
        },
        error: (err) => {
          console.error('❌ Upload failed', err);
          // alert(err.error.message);
        }
      });
  }

  tryParseResponseotherincome(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };
    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') return { parsed: r, msg: '' };

    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        return { parsed: p, msg: '' };
      } catch {
        return { parsed: null, msg: r };
      }
    }

    return { parsed: null, msg: String(r) };
  }



}


