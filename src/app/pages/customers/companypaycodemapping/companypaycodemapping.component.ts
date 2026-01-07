import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { CompanypaycodemappingEditComponent } from '../companypaycodemapping-edit/companypaycodemapping-edit.component';
import { CompanypaycodemappingAddComponent } from '../companypaycodemapping-add/companypaycodemapping-add.component';
import { FormGroup, FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { CompanypaycodemappingService } from '../../../Service/customersserv/companypaycodemapping.service';
import * as XLSX from 'xlsx';
import { IdletimeoutService } from '../../../Service/idletimeout.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { CompanypaycodemappingCopyComponent } from '../companypaycodemapping-copy/companypaycodemapping-copy.component';
import { ICompanypaycodemapping } from '../../../Repository/customer/ICompanypaycodemapping';
export const Pay_TOKEN = new InjectionToken<ICompanypaycodemapping>('Pay_TOKEN');

@Component({
  selector: 'app-companypaycodemapping',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatPaginator, CompanyallComponent, CommonModule, MatTooltipModule, AlertpopupComponent, FormsModule],
  templateUrl: './companypaycodemapping.component.html',
  styleUrl: './companypaycodemapping.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: CompanypaycodemappingService,
    }
  ]
})
export class CompanypaycodemappingComponent {

  message: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  showAlert = false;
  showValidate = false;
  isLoading: boolean = false;
  Itcalenderform!: FormGroup;
  isuploadgridvisible = false;
  uploadDisplayedColumns: string[] = [
    'SNo', 'CompanyCode', 'Paycode', 'Description', 'Paytype',
    'taxable', 'LopApplicable', 'PfApplicable', 'ESIApplicable',
    'PTApplicable', 'Earnedpaycode', 'Pickfrom', 'Formula'
  ];
  uploadedData: any[] = [];
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  Companypaycode: any;
  selectedCompanyId: any;
  selectedCompanyCode: any;
  @ViewChild("paginator") paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  searchText: any;

  constructor(private dialog: MatDialog,
    @Inject(Pay_TOKEN) private service: ICompanypaycodemapping,
    private idleTimeoutService: IdletimeoutService) { }


  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showAlert = true;
    this.showValidate = false;
  }

  closePopup() {
    this.showAlert = false;
    this.showValidate = false;
  }

  AddPOOpen() {
    this.dialog.open(CompanypaycodemappingAddComponent, {
      width: '80%',
      height: '80vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
  selectedRow: any | null = null;

  onRowClick(row: any) {
    this.selectedRow = row;
  }
  ngOnInit(): void {
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchText = filter.toLowerCase();

      return (
        data.Company_Code?.toLowerCase().includes(searchText) ||
        data.Paycode_Code?.toLowerCase().includes(searchText) ||
        data.Description?.toLowerCase().includes(searchText) ||
        data.PayType?.toLowerCase().includes(searchText) ||
        data.Taxable?.toLowerCase().includes(searchText) ||
        data.EarnedPaycode_Code?.toLowerCase().includes(searchText) ||
        data.Pick_From?.toLowerCase().includes(searchText) ||
        data.Formula?.toLowerCase().includes(searchText)
      );
    };
  }
  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  EditOpen() {
    if (!this.selectedRow) {
      alert("Please select a row to edit.");
      return;
    }

    this.dialog.open(CompanypaycodemappingEditComponent, {
      width: '80%',
      height: '95vh',
      disableClose: true,
      data: {
        companyId: this.selectedRow.Company_Id,
        companyCode: this.selectedRow.Company_Code,
        row: this.selectedRow
      }
    });
  }

  CopyOpen() {
    if (!this.selectedRow) {
      alert("Please select a row to edit.");
      return;
    }

    this.dialog.open(CompanypaycodemappingCopyComponent, {
      width: '80%',
      height: '95vh',
      disableClose: true,
      data: {
        companyId: this.selectedRow.Company_Id,
        companyCode: this.selectedRow.Company_Code,
        row: this.selectedRow
      }
    });
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  onsearch() {
    this.isLoading = true;

    if (!this.selectedCompanyId) {
      alert('Please Select Company');
      this.isLoading = false;
      this.isuploadgridvisible = false;
      return;
    }

    const Companyid = this.selectedCompanyId;

    this.service.companypaycodesearch(Companyid).subscribe({
      next: (res) => {
        this.isLoading = false;

        this.Companypaycode = res?.Data?.data;

        if (!this.Companypaycode || this.Companypaycode.length === 0) {
          this.dataSource.data = [];
          this.isuploadgridvisible = false;
          return;
        }

        this.isuploadgridvisible = true;

        this.dataSource.data = this.Companypaycode;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.uploadDisplayedColumns = [
          'SNo', 'CompanyCode', 'Paycode', 'Description', 'Paytype',
          'taxable', 'LopApplicable', 'PfApplicable', 'ESIApplicable',
          'PTApplicable', 'Earnedpaycode', 'Pickfrom', 'Formula'
        ];
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading Companypaycode release data', err);
      },
    });
  }

  exportToExcel(): void {
    this.isLoading = true;

    if (!this.selectedCompanyId) {
      this.isLoading = false;
      alert('Please Select Company')
      return;
    }

    const Companyid = this.selectedCompanyId;

    this.service.Exporttoexcel(Companyid).subscribe({
      next: (res) => {
        this.isLoading = false;
        try {
          const jsonData = res.Data.data.Table0;
          this.Companypaycode = res.Data.message;

          if (!jsonData || !Array.isArray(jsonData) || jsonData.length === 0) {
            alert(this.Companypaycode);
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'CompanypaycodeMapping');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `CompanyPaycodeMapping${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          console.error('Error exporting to Excel:', err);
        }

      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading data for export', err);
      },
    });
  }

}
