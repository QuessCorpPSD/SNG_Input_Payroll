import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';

@Component({
  selector: 'app-new-joinee-existing-employee-bank-verified-report',
  standalone: true,
  imports: [CompanyallComponent,
    CommonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule],
  templateUrl: './new-joinee-existing-employee-bank-verified-report.component.html',
  styleUrl: './new-joinee-existing-employee-bank-verified-report.component.css'
})
export class NewJoineeExistingEmployeeBankVerifiedReportComponent {

   companyId: any;
  selectedCompanyCode: any;


  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

}
