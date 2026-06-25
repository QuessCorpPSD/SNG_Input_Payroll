import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PayrollinputComponent } from "../../PayrollInput/payrollinput.component";
import { InputaggregatoronboardingComponent } from "../inputaggregatoronboarding/inputaggregatoronboarding.component";
import { ICommonService } from '../../../Repository/ICommonService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { InputaggregatorService } from '../../../Service/inputaggregator/inputaggregator.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { Payperiodclass } from '../../../Models/Common';
import { finalize } from 'rxjs';
import { MatIconModule } from "@angular/material/icon";

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
  selector: 'app-inputaggregatorattendance',
  standalone: true,
  imports: [CommonModule, FormsModule, InputaggregatoronboardingComponent, MatTableModule, MatPaginator, MatIconModule],
  templateUrl: './inputaggregatorattendance.component.html',
  styleUrl: './inputaggregatorattendance.component.css'
})
export class InputaggregatorattendanceComponent {
  displayedColumns: string[] = [
    'delete',
    'clientattributes',
    'quessattributes',
    'actions'
  ];
  companyUI: any;
  payperiodUI: any;
  mapnameUI: any;
  isLoading = false;
  payPeriodTypefromParent: string = '';
  userdetail!: any;
  showTable = false;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  dataSource = new MatTableDataSource<any>([]);

  datatable: Array<{ [key: string]: any }> = [];
  searchText: string = '';
  sitename: any;
  siteNameUI: any;
  isDropdownOpen = false;
  isTemplateDropdownOpen = false;
  showInfocliPopup = false;
  mapname: any;

  SelectedQuessAttributeId: any;
  selectCompanyId: any;
  selectCompanyCode: any;
  payPeriod!: Payperiodclass;
  payperiodId: any;
  payperiods: any;
  payPeriodType: any;
  Attendancesearch: any[] = [];
  payPeriodmain!: Payperiodclass;
  payperiodIdmain: any;
  payperiodsmain: any;
  clientAttributes: any;
  quessAttributes: any;
  searchQueryclient: any;
  clientquessAttributes: any;
  quessAttributesclient: any;
  selectedItemcli: string = '';
  isCompanyDropdownOpen = false;
  isMapDropdownOpen = false;
  isSiteDropdownOpen = false;
  isManagerDropdownOpen = false;
  isAttendanceDropdownOpen = false;
  isReportDropdown = false;
  openAttributeDropdown: number | null = null;

  searchQuery = '';
  selectedItem: string | null = null;
  quessMasterAttributes: QuessAttribute[] = [];

  selectedItems: { [key: number]: string } = {};

  selectedCompanyId: any;
  selectedCompanyCode: any;
  showInfoPopup = false;
  showreportPopup = false;
  constructor(
    private service: InputaggregatorService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
  ) { }


  applyFilter(): void {
    const filterValue = this.searchText.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  newRow = {
    clientAttributeId: null,
    quessAttributeId: null
  };
  handleCompanyEvent(company: any) {
    this.companyUI = company;
    // if (!this.companyUI) {
    //   alert("Select Company Code");
    //   return;
    // }

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

  handleSiteNameEvent(site: any) {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    this.siteNameUI = site;
    //console.log('Site', this.siteNameUI);
    this.loadClientAttributes();
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
      .downloadFinalSubmissionattendance
      (this.companyUI.companyId, this.payperiodUI.payfrequencyid)
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


  toggleDropdown(event: Event) {
    event.stopPropagation(); // VERY IMPORTANT
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  isreportDropdownOpen = false;
  togglereportDropdown(event: Event) {
    event.stopPropagation(); // VERY IMPORTANT
    this.isreportDropdownOpen = !this.isreportDropdownOpen;
  }

  selectOption(type: string, fileInput2: HTMLInputElement) {
    this.isDropdownOpen = false;


    this.ImportClickclient(fileInput2);
    // fileInput.click(); // open file picker
  }
  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "user_Id": this.userdetail.user_Id,
      "userName": this.userdetail.userName,
    };
    this.loadQuessAttributes();

    this.payPeriodTypefromParent = "All";
    this.dataSource.filterPredicate = (data: any, filter: string) => {

      const filterText = filter.trim().toLowerCase();

      return Object.values(data).some((value: any) =>
        String(value ?? '')
          .toLowerCase()
          .includes(filterText)
      );
    };
    if (!this.siteNameUI) {
      this.siteNameUI = {
        siteCode: '0',
        siteName: 'All'
      };
    }

  }
  closeInfocliPopup() {
    this.showInfocliPopup = false;
  }

  loadClientAttributes() {
    this.clientquessAttributes = [];
    this.service.ClientAttendanceAttributeMaster(this.companyUI.companyId, this.siteNameUI.siteCode).subscribe(res => {
      const data = res?.Data?.data?.Table0;

      if (!data || data.length === 0) {
        this.clientquessAttributes = [];
      } else {
        this.clientquessAttributes = data as ClientAttribute[];
      }
    });
  }

  loadQuessAttributesclient() {
    this.service.QuessAttendanceAttributeClient(this.companyUI.companyId)
      .subscribe(res => {
        const data = res?.Data?.data?.Table0;

        if (!data || data.length === 0) {
          this.quessAttributesclient = [];
        } else {
          this.quessAttributesclient = data as QuessAttribute[];
        }
      });

  }

  deleteClientAttribute(item: any) {

    if (!confirm('Are you sure you want to delete this attribute?')) {
      return;
    }

    const companyId = this.companyUI?.companyId;
    const siteId = this.siteNameUI?.siteCode;
    const templateId = item.Template_Field_Id;
    const createdBy = this.userdetail?.user_Id;

    this.service
      .attclientattributeMasterdelete(companyId, siteId, templateId, createdBy)
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
  addRow() {
    if (!this.newRow.clientAttributeId || !this.newRow.quessAttributeId) {
      alert('Please select both attributes');
      return;
    }

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: 'add',
      parentDetail: {
        company_Id: this.companyUI.companyId,
        Template_Field_Id: this.newRow.clientAttributeId,
        Quess_Template_Field_Id: this.newRow.quessAttributeId,
        IsActive: true
      }
    };

    this.service.saveClientAttribute(payload).subscribe({
      next: () => {

        const clientName = this.clientquessAttributes.find(
          c => c.Template_Field_Id == this.newRow.clientAttributeId
        )?.Template_Field_Name;

        const quessName = this.quessAttributesclient.find(
          q => q.Quess_Template_Field_Id == this.newRow.quessAttributeId
        )?.Quess_Template_Field_Name;

        this.dataSource.data = [
          ...this.dataSource.data,
          {
            clientattributes: clientName,
            quessatributes: quessName,
            clientattributesid: this.newRow.clientAttributeId,
            quessatributesid: this.newRow.quessAttributeId
          }
        ];
        this.dataSource.paginator = this.paginator;

        this.newRow = { clientAttributeId: null, quessAttributeId: null };
      },
      error: (err) => {
        console.error(err);
        // alert(err.error.message);
      }
    });
  }
  deleterow(item: any) {

    if (!confirm("Are you sure you want to delete this row?")) {
      return;
    }
    this.isLoading = true;
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: 'delete',
      parentDetail: {
        company_Id: this.companyUI.companyId,
        Template_Field_Id: item.clientattributesid,
        Quess_Template_Field_Id: item.quessatributesid,
        IsActive: true
      }
    };


    this.service.saveClientAttribute(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          this.isLoading = false;
          const message =
            res?.Data?.data?.Table0?.[0]?.Error_Message ||
            'Deleted Successfully';

          alert(message);

          this.handleSearchattendance();
        } else {
          this.isLoading = false;
          alert("Delete Failed due to internal server error");
        }
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
        // console.log(err.error.message);
      }
    });
  }

  toggleInfoPopup() {
    this.showInfoPopup = !this.showInfoPopup;
  }
  toggleInfocliPopup() {
    if (!this.companyUI) {
      alert("Please select company");
      return;
    }
    this.showInfocliPopup = !this.showInfocliPopup;
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



  BindMapname() {
    const companyid = this.companyUI.companyId;
    this.service.getmapname(companyid).subscribe({
      next: res => {
        this.mapname = res.Data;
      }
    });
  };
  // BindSitename() {
  //   const companyid = this.companyUI.companyId || 0;
  //   const groupid = 0;

  //   this.service.SiteSearch(companyid, groupid).subscribe({
  //     next: res => {
  //       this.sitename = res.Data?.data?.Table0;

  //     }
  //   });
  // };
  loadQuessAttributes() {
    this.service.getQuessAttendanceAttributes().subscribe(res => {
      this.quessMasterAttributes =
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
  selectItemcli(namecli: string) {
    this.selectedItemcli = namecli;
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

  toggleTemplateDropdown() {
    this.isTemplateDropdownOpen = !this.isTemplateDropdownOpen;

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
      fileName = 'Attributes_attendance_Mapping_Template.xlsx';

    } else {


      const headers = [
        'COMPANY_CODE',
        'GROUP_NAME',
        'CLIENT_ATTRIBUTE_NAME',
        'ATTRIBUTE_TYPE',
        'ISACTIVE',
        'MODE'
      ];

      worksheet = XLSX.utils.aoa_to_sheet([headers]);
      fileName = 'Client_Attributes_attendance_Template.xlsx';
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
      .downloadBillableReportattendance(this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.siteNameUI.siteCode).pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (res: any) => {


          if (res.StatusCode === 200) {
            const data0 = res?.Data?.data?.Table0;
            const data1 = res?.Data?.data?.Table1;

            if ((!data0 || data0.length === 0) && (!data1 || data1.length === 0)) {
              alert('No records Found');
              this.isLoading = false;
              return;
            }

            // Create worksheets
            const worksheet0: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data0 || []);
            const worksheet1: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data1 || []);

            // Create workbook with multiple sheets
            const workbook: XLSX.WorkBook = {
              Sheets: {
                'EMPLOYEE': worksheet0,
                'PreviousLOP_LOPR': worksheet1
              },
              SheetNames: ['EMPLOYEE', 'PreviousLOP_LOPR']
            };

            const excelBuffer = XLSX.write(workbook, {
              bookType: 'xlsx',
              type: 'array'
            });

            const blob = new Blob([excelBuffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
            });

            saveAs(blob, 'Attendance_Report.xlsx');

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
          // alert(err.error.message);
          this.isLoading = false;
        }
      });
  }

  downloadExcelBillablereportbilling() {
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
      .downloadBillableReportbilling(this.companyUI.companyId, this.payperiodUI.payfrequencyid, this.siteNameUI.siteCode)
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

          // alert(err.error.message);

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
      Sheets: { 'Attributes_Attendance': worksheet },
      SheetNames: ['Attributes_Attendance']
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
    saveAs(blob, 'Quess_Attributes_Attendance.xlsx');

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
  handleSearchattendance(): void {
    if (!this.companyUI) {
      alert("Please select company");
      this.Attendancesearch = [];
      this.dataSource.data = [];
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
            alert(res.Data.message);
            this.Attendancesearch = [];
            this.dataSource.data = [];
            return;
          }

          this.bindAttendance(tableData);
        },
        error: (err) => {
          console.error(err);
          this.Attendancesearch = [];
          this.dataSource.data = [];

        }
      });
  }
  hasData = false;
  bindAttendance(data: any[]): void {

    const mappedData = data.map(item => ({
      clientattributes: item.ClientAttributes,
      quessatributes: item.QuessMasterAttributes,
      clientattributesid: item.ClientTemplateId,
      quessatributesid: item.Quess_Template_Field_Id,
      isAddRow: false
    }));

    this.Attendancesearch = mappedData;
    this.hasData = mappedData.length > 0;
    const addRowObject = {
      isAddRow: true,
      clientattributes: '',
      quessatributes: ''
    };
    this.dataSource.data = [addRowObject, ...mappedData];

    this.dataSource.paginator = this.paginator;

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
      SelectedQuessAttributeId: item.Quess_Template_Field_Id || ''
    }));
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

    this.service.Uploadattendancecli(formData)
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
              `ClientAttributesAttendance_ErrorMessages.xlsx`
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
  ImportClickatt(fileInput: HTMLInputElement): void {
    fileInput.click();
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
          //   alert(res.data.response);
          //   return;
          // }

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
              `AttributesAttendanceMapping_ErrorMessages.xlsx`
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

  ImportClickclient(fileInput2: HTMLInputElement): void {
    this.currentUploadType = 'Attendance';
    if (!this.companyUI) {
      alert("Please select company");
      return;
    }
    if (!this.payperiodUI) {
      alert("Please select payperiod");
      return;
    }

    fileInput2.value = '';
    fileInput2.click();

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
    this.isLoading = true;

    const reader = new FileReader();
    reader.onload = (e: any) => {
      const workbook = XLSX.read(e.target.result, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      const jsonData: any[] = XLSX.utils.sheet_to_json(worksheet, { defval: '' });

      // this.previewData = jsonData.slice(0, 100);
      // this.previewColumns = jsonData.length ? Object.keys(jsonData[0]) : [];
      // this.showUploadPopup = true;
      this.previewExcelFile(file);
      this.isLoading = false;
    };

    reader.readAsArrayBuffer(file);
  }

  submitUpload() {
    if (!this.selectedFile) {
      alert("Please select file");
      return;
    };
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyId', this.companyUI.companyId);
    formData.append('PayPeriodId', this.payperiodUI.payfrequencyid);
    formData.append('SiteId', this.siteNameUI.siteCode);
    this.isLoading = true;

    this.service.Uploadclientattendance(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          // if (!res || !res.data) {
          //   alert('Upload request processed. Server did not return any data.');
          //   return;
          // }

          console.log('res', JSON.stringify(res));

          const response = res.Data.response;

          const { parsed, msg } = this.tryParseResponseClient(response);
          if (res?.StatusCode === 200 && response.toLowerCase().includes('success')) {
            alert(res.Data.response);
            this.closeUploadPopup();
            return;
          }

          // Error parsing → download Excel
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

            XLSX.writeFile(workbook, `AttributesAttendanceMapping_ErrorMessages.xlsx`);
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
    this.closeUploadPopup();
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

  // -------------------------------------OTC Rate------------------------------------------------

  currentUploadType: any;

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

  submitUploadpopup() {

    switch (this.currentUploadType) {

      case 'Attendance':
        this.submitUpload();
        break;



      case 'OTC Rate':
        this.submitUploadOTC();
        break;
    }
  }
  ImportClicKOTC(fileInput7: HTMLInputElement): void {
    this.currentUploadType = 'OTC Rate';

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

  onFileChangeOTC(event: Event): void {
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

  submitUploadOTC() {
    if (!this.selectedFile) {
      alert("Please Select File");
      return;
    };
    const formData = new FormData();
    formData.append('file', this.selectedFile);
    formData.append('CreatedBy', this.userdetail.user_Id);
    formData.append('CompanyId', this.companyUI?.companyId);
    formData.append('SiteId', this.siteNameUI?.siteCode);
    formData.append('PayPeriodId', this.payperiodUI.payfrequencyid);


    this.isLoading = true;

    this.service.UploadOTC(formData)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe({
        next: (res: any) => {
          if (!res || !res.Data) {
            alert(res.Data);
            return;
          }

          const response = res.Data.response;



          const { parsed, msg } = this.tryParseResponseOTC(response);



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

  tryParseResponseOTC(r: any): { parsed: any; msg: string } {
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
