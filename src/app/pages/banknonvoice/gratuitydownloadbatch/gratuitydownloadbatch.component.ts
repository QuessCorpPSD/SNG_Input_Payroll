import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { IGratuityDownloadBatch } from '../../../Repository/banknonvoice/IGratuityDownloadBatch.service';
import { GratuitydownloadbatchService } from '../../../Service/banknonvoice/gratuitydownloadbatch.service';
export const Pay_Token = new InjectionToken<IGratuityDownloadBatch>('Pay_Token');


@Component({
  selector: 'app-gratuitydownloadbatch',
  standalone:true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent, MatCardModule, MatIconModule, MatTooltipModule],
  templateUrl: './gratuitydownloadbatch.component.html',
  styleUrl: './gratuitydownloadbatch.component.css',
  providers: [
    {
      provide: Pay_Token,
      useClass: GratuitydownloadbatchService,
    }
  ]
})
export class GratuitydownloadbatchComponent {
  BatchDate: any;
  BatchId: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading = false;
  searchText = '';
  selectedTemplate: any;
  userdetail: any;
  batchtype: any;
  dataSource = new MatTableDataSource<any>([]);
  Batchtype: string = '';
  batchid: any;
  getId: any;

  constructor(@Inject(Pay_Token) private service: GratuitydownloadbatchService,) { }

  ngOnInit() {
    this.bindBatchId();
  }

  bindBatchId() {
    const flag = 'GetBatch';

    this.service.GetBatchid(this.BatchDate, flag).subscribe({
      next: (res: any) => {
        this.getId = res.Data?.data ?? [];
        console.log(this.getId);
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  downloadBatchFile(): void {

    const filename = this.getId;

    // if (!filename) {
    //   alert('Please select Batch ID');
    //   return;
    // }

    this.isLoading = true;

    this.service.ExporttoExcel(filename).subscribe({
      next: (res: Blob) => {

        const blob = new Blob([res], {
          type: 'application/zip'
        });

        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename + '.rar';
        a.click();

        window.URL.revokeObjectURL(url);

        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        alert('Batch does not exist!');
        this.isLoading = false;
      }
    });
  }

}
