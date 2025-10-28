import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyComponent } from '../../../common/company/company.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
// import { V } from '@angular/cdk/scrolling-module.d-ud2XrbF8';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// import { POItemtypeComponent } from "../../../../common/pointemtype/POItemtypeComponent";
import { PonumbersearchComponent } from '../../../common/ponumbersearch/ponumbersearch.component';

@Component({
  selector: 'app-add-epo',
  standalone: true,
  imports: [CommonModule, MatCard, MatCardModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
      PonumbersearchComponent],
  templateUrl: './add-epo.component.html',
  styleUrl: './add-epo.component.css'
})
export class AddEpoComponent implements OnInit {
  POAddForm!: FormGroup;
  poNumber: any;
  postartdate: any;
  selectedItemType: any;
  showExtensionInput = false;
  extensionEndDate: string = '';
  statusId: any;
  StatusID: any;
  selectedOption: any;
  comapnyId: number = 0;
  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddEpoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  companyId: number = 0;
  siteId = '';
  selectedCompanyCode: any;
  selectedSiteName: any;
  isdisable = true;

  onClose() {
    this.dialogRef.close();
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
  }

  groupnameEvent(event: any) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;
  }
  ItemTypeEvent(item: any): void {
    this.selectedItemType = item;
    console.log('Selected Item Type:', item);
    // Optionally patch to formControl if you're using Reactive Forms:
    this.POAddForm.get('ItemType')?.setValue(item.itemId);
  }

  // ngOnInit(): void {
  //   this.POAddForm = this.fb.group({
  //     CompanyCode: ['', Validators.required],
  //     PONo: ['', Validators.required],
  //     POStartDate: ['', Validators.required],
  //     POEndDate: ['', Validators.required],
  //     POtotalvalue: ['', Validators.required],
  //     StartDate: ['', Validators.required],
  //     EndDate: ['', Validators.required],
  //     Duration: ['', Validators.required],
  //     ItemType: ['', Validators.required],
  //     EmployeeID: ['', Validators.required],
  //     EmployeeName: ['', Validators.required],
  //     ClientEmpNo: ['', Validators.required],
  //     OfferPOValue: ['', Validators.required],
  //     Quantitytype: ['', Validators.required],
  //     Quantity: ['', Validators.required],
  //     CTC: ['', Validators.required],
  //     ServiceCharge: ['', Validators.required],
  //     PORate: ['', Validators.required],
  //     BalanceAmount: ['', Validators.required],
  //     MonthlyRate: ['', Validators.required],
  //     ResourceValue: ['', Validators.required]
  //   })
  //   if (this.data?.row) {
  //     const row = this.data.row;
  //     if (row['COMPANY CODE']) {
  //       this.POAddForm.get('CompanyCode')?.setValue(row['COMPANY CODE']);
  //       this.selectedCompanyCode = row.companyCode;
  //     }
  //     if (row?.PoNumber) {
  //       this.POAddForm.get('PONo')?.setValue(row.PoNumber);
  //       this.poNumber = row.PoNumber;
  //     }
  //     if (row['PO START DATE']) {
  //       // Convert to proper Date object if needed
  //       const startDate = new Date(row['PO START DATE']);
  //       this.POAddForm.get('POStartDate')?.setValue(startDate);
  //       this.postartdate = startDate;
  //     }

  //     if (row['PO END DATE']) {
  //       const endDate = new Date(row['PO END DATE']);
  //       this.POAddForm.get('POEndDate')?.setValue(endDate);
  //     }

  //     if (row['FixedRate']) {
  //       this.POAddForm.get('POtotalvalue')?.setValue(row['FixedRate']);
  //     }
  //   }


  //   this.POAddForm.get('CompanyCode')?.disable();
  //   this.POAddForm.get('POStartDate')?.disable();
  //   this.POAddForm.get('POEndDate')?.disable();

  //   this.POAddForm.get('POtotalvalue')?.disable();
  //   this.POAddForm.get('PONo')?.disable();
  //   this.POAddForm.get('Duration')?.disable();
  //   this.POAddForm.get('EmployeeID')?.disable();
  //   this.POAddForm.get('EmployeeName')?.disable();
  //   this.POAddForm.get('ClentEmpNo')?.disable();
  //   this.POAddForm.get('OfferPOValue')?.disable();
  //   this.POAddForm.get('CTC')?.disable();
  //   this.POAddForm.get('BalanceAmount')?.disable();
  //   this.POAddForm.get('MonthlyRate')?.disable();
  // }
  ngOnInit(): void {
    this.POAddForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      PONo: ['', Validators.required],
      POStartDate: ['', Validators.required],
      POEndDate: ['', Validators.required],
      POtotalvalue: ['', Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      Duration: ['', Validators.required],
      ItemType: ['', Validators.required],
      EmployeeID: ['', Validators.required],
      EmployeeName: ['', Validators.required],
      ClientEmpNo: ['', Validators.required], // ✅ spelling fixed
      OfferPOValue: ['', Validators.required],
      Quantitytype: ['', Validators.required],
      Quantity: ['', Validators.required],
      CTC: ['', Validators.required],
      ServiceCharge: ['', Validators.required],
      PORate: ['', Validators.required],
      BalanceAmount: ['', Validators.required],
      MonthlyRate: ['', Validators.required],
      ResourceValue: ['', Validators.required],
      ExtensionEndDate: [''],

    });

    if (this.data?.row) {
      const row = this.data.row;
      console.log('Row Data:', row);
      console.log('PO START DATE:', row['PO START DATE']);
      console.log('PO END DATE:', row['PO END DATE']);
      console.log('FixedRate:', row['FixedRate']);
      console.log('employeeid:', row['EMPLOYEE ID']);
      console.log('employeeName:', row['EMPLOYEE NAME']);


      if (row['COMPANY CODE']) {
        this.POAddForm.get('CompanyCode')?.setValue(row['COMPANY CODE']);
        this.selectedCompanyCode = row['COMPANY CODE'];
      }

      if (row?.PoNumber) {
        this.POAddForm.get('PONo')?.setValue(row.PoNumber);
        this.poNumber = row.PoNumber;
      }

      if (row['PO START DATE']) {
        this.POAddForm.get('POStartDate')
          ?.setValue(this.formatDateForInput(row['PO START DATE']));
      }

      if (row['PO END DATE']) {
        this.POAddForm.get('POEndDate')
          ?.setValue(this.formatDateForInput(row['PO END DATE']));
      }



      if (row['FixedRate']) {
        this.POAddForm.get('POtotalvalue')?.setValue(row['FixedRate']);
      }
      if (row['EMPLOYEE ID']) {
        this.POAddForm.get('EmployeeID')?.setValue(row['EMPLOYEE ID']);
      }
      if (row['EMPLOYEE NAME']) {
        this.POAddForm.get('EmployeeName')?.setValue(row['EMPLOYEE NAME']);
      }
    }


    this.POAddForm.get('CompanyCode')?.disable();
    this.POAddForm.get('POStartDate')?.disable();
    this.POAddForm.get('POEndDate')?.disable();
    this.POAddForm.get('POtotalvalue')?.disable();
    if (this.data?.row?.StatusID === 3) {
      this.POAddForm.get('PONo')?.disable();
    }
    this.POAddForm.get('Duration')?.disable();
    this.POAddForm.get('EmployeeID')?.disable();
    this.POAddForm.get('EmployeeName')?.disable();
    this.POAddForm.get('ClientEmpNo')?.disable();
    this.POAddForm.get('OfferPOValue')?.disable();
    this.POAddForm.get('CTC')?.disable();
    this.POAddForm.get('BalanceAmount')?.disable();
    this.POAddForm.get('MonthlyRate')?.disable();
    this.POAddForm.get('ExtensionEndDate')?.disable();
    if (this.data?.row?.StatusID === 3) {
      this.POAddForm.get('EndDate')?.disable();
    }

    this.statusId = this.data?.row?.StatusID;
    console.log('Status ID:', this.statusId);

    this.companyId = this.data?.row?.COMPANY_ID;
    console.log('Company ID:', this.companyId);
  }



  toggleExtensionInput() {
    this.POAddForm.get('EndDate')?.enable();


  }



  onRevised(): void {
    this.showExtensionInput = true;
    this.POAddForm.get('ExtensionEndDate')?.enable();

    console.log('Revised button clicked');
  }

  handleponumbersearchEvent(event: any) {
    this.selectedOption = event.ponumber;
    console.log(this.selectedOption);
  }
  formatDateForInput(dateStr: string): string | null {
    if (!dateStr) return null;

    const months: any = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };

    const [day, mon, year] = dateStr.split('-');
    const month = months[mon];
    return `${year}-${month}-${day.padStart(2, '0')}`;
  }
}
