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
import { finalize } from 'rxjs';
export const Report_TOKEN = new InjectionToken<IPOReportService>('Report_TOKEN');

@Component({
  selector: 'pomonthwisereport',
  standalone: true,
  imports: [CommonModule, MatTableModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, MatCardModule,
    MatIconModule, MatTooltipModule, FormsModule, ReactiveFormsModule],
  templateUrl: './pomonthwisereport.component.html',
  styleUrl: './pomonthwisereport.component.css',
  providers: [{
    provide: Report_TOKEN,
    useClass: POReportService,
  }]
})
export class PomonthwisereportComponent {

  isLoading = false;
  POEmployeeData: any[] = [];
  txtFromDate = new Date;
  txtToDate = new Date;

  constructor(@Inject(Report_TOKEN) private poreportService: IPOReportService,
    private _sessionStoreage: SessionStorageService,
    private decry: EncryptionService,
  ) { }


  ExportClick() {
    this.isLoading = true;
    this.poreportService.GetAllMonthWisePOReport(this.txtFromDate, this.txtToDate).pipe(
      finalize(() => this.isLoading = false) // ✅ only one place to stop loading
    )
      .subscribe({
        next: res => {
          //console.log(res);
          if (res.StatusCode === 200) {
            const data = res.Data;
            this.downloadExcelFromBase64(data.file, data.fileName);
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

    downloadExcelFromBase64(base64: string, filename: string) {
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

  ClearClick(): void {
    window.location.reload();
  }

}
