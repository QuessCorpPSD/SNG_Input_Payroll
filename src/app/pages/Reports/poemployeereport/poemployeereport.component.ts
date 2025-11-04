import { Component, Inject, InjectionToken, ViewChild, ViewEncapsulation, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from "../../../Shared/encryption.service";
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCheckbox } from "@angular/material/checkbox";
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { IPOReportService } from '../../../Repository/Reports/Iporeports.service';
import { POReportService } from '../../../Service/Reports/POReports.service';
export const Report_TOKEN = new InjectionToken<IPOReportService>('Report_TOKEN');
@Component({
  selector: 'poemployeereport',
  standalone: true,
  imports: [CommonModule, MatTableModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, MatCardModule,
    MatIconModule, MatTooltipModule, FormsModule, ReactiveFormsModule],
  templateUrl: './poemployeereport.component.html',
  styleUrl: './poemployeereport.component.css',
  providers: [{
    provide: Report_TOKEN,
    useClass: POReportService,
  }]
})
export class PoemployeereportComponent {
  isLoading = false;
  showGrid = false;
  POEmployeeData: any[] = [];
  txtEmployeeId: string="";
  ddEmployeeType: string="0";

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  constructor(@Inject(Report_TOKEN) private poreportService: IPOReportService,
    private _sessionStoreage: SessionStorageService,
     private decry:EncryptionService,
  ) { }
  
  searchClick() {
    this.isLoading=true;
    this.BindDashBoard(this.txtEmployeeId, this.ddEmployeeType);
  }

  BindDashBoard(employeeId: string, employeeType: string) {

    this.poreportService.GetAllPOEmployeeReport(employeeId, employeeType).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        //console.log(res.Data);
        this.showGrid=true;
        this.POEmployeeData = res.Data;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  ExportClick() {
    this.poreportService.GetAllPOEmployeeReport(this.txtEmployeeId, this.ddEmployeeType).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        //console.log(res.Data);
        this.showGrid=true;
        this.POEmployeeData = res.Data;
        this.downloadExcel(this.POEmployeeData, "PO_Employee_Report_"+this.txtEmployeeId);
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  getTableColumns(): string[] {
    return this.POEmployeeData?.length ? Object.keys(this.POEmployeeData[0]) : [];
  }
  downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
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

    ClearClick(): void {
    window.location.reload();
  }
}
