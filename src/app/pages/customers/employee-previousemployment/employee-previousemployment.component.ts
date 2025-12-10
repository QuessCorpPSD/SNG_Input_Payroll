import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatCardModule } from "@angular/material/card";
import { MatTableModule } from "@angular/material/table";
import { MatIconModule } from "@angular/material/icon";
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { APIResponse } from '../../../Models/apiresponse';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EmployeeService } from '../../../Service/CUSTOMER/employee.service';
import { IEmployeeservice } from '../../../Repository/customer/Iemployee';
export const Pay_TOKEN = new InjectionToken<IEmployeeservice>('Pay_TOKEN');


@Component({
  selector: 'app-employee-previousemployment',
  standalone: true,
  imports: [MatPaginatorModule, MatCardModule, MatTableModule, MatIconModule, CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './employee-previousemployment.component.html',
  styleUrl: './employee-previousemployment.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: EmployeeService,
    }
  ]
})
export class EmployeePreviousemploymentComponent {
  prevEmploymentForm!: FormGroup;
  submitted = false;
  rowData: any;
  userdetail: any;

  constructor(
    private dialogRef: MatDialogRef<EmployeePreviousemploymentComponent>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    @Inject(Pay_TOKEN) private service: IEmployeeservice,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) {
    this.rowData = data.rowData;
  }
  formatDate(date: string): string {
    const [day, month, year] = date.split('-');
    return `${year}-${month}-${day}`; // Converts DD-MM-YYYY to YYYY-MM-DD
  }

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }

    this.prevEmploymentForm = this.fb.group({
      companyName: ['', Validators.required],
      designation: ['', Validators.required],
      experience: [this.rowData.Experience_In_Years ?? '', Validators.required],

      startDate: [
        this.formatDate(this.rowData.Start_Date),
        Validators.required
      ],

      endDate: [
        this.formatDate(this.rowData.End_Date),
        Validators.required
      ]
    });
  }


  onClose(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.prevEmploymentForm.invalid) {
      this.prevEmploymentForm.markAllAsTouched();
      return;
    }

    const raw = this.prevEmploymentForm.getRawValue();

    const payload = {
      createdBy: this.userdetail.user_Id,
      detail: {
        Employee_Previous_Employment_Detail_Id: this.rowData.Employee_Previous_Employment_Detail_Id ?? 0,
        Company_Name: raw.companyName,
        Designation: raw.designation,
        Experience_In_Years: raw.experience,
        Start_Date: raw.startDate,
        End_Date: raw.endDate
      }
    };

    console.log("Payload:", payload);

    this.service.AddemployeePrevioussave(payload).subscribe({
      next: (res: any) => {
        alert(res.Data.message);
        this.dialogRef.close();
      },
      error: (err) => console.error(err)
    });
  }
}
