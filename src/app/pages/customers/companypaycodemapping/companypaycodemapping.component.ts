import { Component, ViewChild } from '@angular/core';
import { CompanypaycodemappingEditComponent } from '../companypaycodemapping-edit/companypaycodemapping-edit.component';
import { CompanypaycodemappingAddComponent } from '../companypaycodemapping-add/companypaycodemapping-add.component';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from "@angular/material/icon";
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { CompanypaycodemappingService } from '../../../Service/CUSTOMER/companypaycodemapping.service';
import * as XLSX from 'xlsx';
import FileSaver from 'file-saver';
import { IdletimeoutService } from '../../../Service/idletimeout.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import { CompanypaycodemappingCopyComponent } from '../companypaycodemapping-copy/companypaycodemapping-copy.component';
@Component({
  selector: 'app-companypaycodemapping',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatPaginatorModule, CompanyallComponent, CommonModule, MatTooltipModule, AlertpopupComponent],
  templateUrl: './companypaycodemapping.component.html',
  styleUrl: './companypaycodemapping.component.css'
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
    'PTApplicable', 'Earnedpaycode', 'Pickfrom'
  ];
  uploadedData: any[] = [];
  dataSource = new MatTableDataSource<any>();
  tableHeaders: string[] = [];
  dynamicColumns: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;

  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  Companypaycode: any;
  constructor(private dialog: MatDialog, private service: CompanypaycodemappingService, private idleTimeoutService: IdletimeoutService) { }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  selectedCompanyId: any;
  selectedCompanyCode: any;


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
      height: '95vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
  selectedRow: any | null = null;

  onRowClick(row: any) {
    this.selectedRow = row;
  }

  EditOpen() {
    if (!this.selectedRow) {
      alert("Please select a row to edit.");
      return;
    }

    // Pass selected row data to Edit dialog
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

  onsearch() {
    this.isLoading = true;
    
    if (!this.selectedCompanyId) {
      alert('Please Select Company')
      this.isLoading = false;
      this.isuploadgridvisible=false;
      return;
    }

    const Companyid = this.selectedCompanyId;

    this.service.companypaycodesearch(Companyid).subscribe({
      next: (res) => {
        this.isLoading = false;
        console.log('API Response:', res.Data);
        this.Companypaycode = res?.Data?.data;

        if (!this.Companypaycode) {
          this.isLoading = false;
          alert(res.Data.message)
        }
        if (this.Companypaycode && this.Companypaycode.length > 0) {
          this.isLoading = false;
          this.isuploadgridvisible = true;
          this.dataSource = new MatTableDataSource(this.Companypaycode);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.uploadDisplayedColumns = [
            'SNo', 'CompanyCode', 'Paycode', 'Description', 'Paytype',
            'taxable', 'LopApplicable', 'PfApplicable', 'ESIApplicable',
            'PTApplicable', 'Earnedpaycode', 'Pickfrom'
          ];
        } else {
          this.isLoading = false;
          this.dataSource.data = [];
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error loading Companypaycode release data', err);
      },
    });
    this.isLoading = false;
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

          this.showAlertPopup('File downloaded successfully!');

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
