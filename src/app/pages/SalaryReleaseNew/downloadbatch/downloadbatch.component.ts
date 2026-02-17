import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { PayrollinputComponent } from '../../PayrollInput/payrollinput.component';

@Component({
  selector: 'app-downloadbatch',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCheckboxModule, MatPaginatorModule,
    MatSelectModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, FormsModule,
    AlertpopupComponent],
  templateUrl: './downloadbatch.component.html',
  styleUrl: './downloadbatch.component.css'
})
export class DownloadbatchComponent {
  BatchDate: any;
  BatchId: any;
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  isLoading = false;
  searchText = '';
  selectedTemplate: any;
  applyFilter() {

  }


}
