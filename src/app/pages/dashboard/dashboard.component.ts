import { Component,  Inject,  InjectionToken, OnInit, ViewChild } from '@angular/core';
import { IDashBoardServices } from '../../Repository/IDashBoardService';
import { CommonModule } from '@angular/common';
import { DashBoardServices } from '../../Service/DashBoardService';
import { EncryptionService } from '../../Shared/encryption.service';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { FinancialYearComponent } from '../../common/financial-year/financial-year.component';
import { UserComponent } from '../../common/user/user.component';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import {provideNativeDateAdapter} from '@angular/material/core';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatTableModule,MatTableDataSource  } from '@angular/material/table';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';

export  const DASH_TOKEN=new InjectionToken<IDashBoardServices>('DASH_TOKEN');
export  const AUTH_TOKEN=new InjectionToken<IAssignmentService>('AUTH_TOKEN');

import {MatPaginator} from '@angular/material/paginator';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {AdminDashboardDetailUI} from '../../Models/AdminDashboardDetailUI';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AssignmentService } from '../../Service/Assignment.service';
import { IAssignmentService } from '../../Repository/IAssignment.service';
import { ToastrService } from 'ngx-toastr';

import { MatSortModule } from '@angular/material/sort';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCheckboxModule,MatPaginator,MatTooltipModule,CommonModule,FinancialYearComponent,
            UserComponent,MatTableModule,MatFormFieldModule, MatDatepickerModule, FormsModule, 
            ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',  
  providers:[provideNativeDateAdapter(),{
            provide: DASH_TOKEN,
            useClass: DashBoardServices,
          },
        {
            provide: AUTH_TOKEN,
            useClass: AssignmentService,
          }]
})
export class DashboardComponent implements OnInit {
carddashboard:any;
dataSource:any
pendingLots:any;
@ViewChild('PeningLotPaginator') PeningLot_paginator!: MatPaginator;

financialyear:any;
user:any;

userList:any;
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
 isLoading:boolean=false;

// displayedColumns: string[] = ['all', 'input', 'output','lot_Number','companyShortName',
//   'headCount','netPay','createdOn','allottedDateTime','assignedTo','qC_Verified_DateTime','estimateTime',
//   'reportingManager','invoiceGenerated','invoiceGeneratedDate','customer_Confirmation_Status','customer_Confirmation_DateTime'

// ];

displayedColumns: string[] = ['all', 'input', 'output','companyShortName','lot_Number',
  'headCount','ctc','netPay','createdOn','allottedDateTime','assignedTo','estimateTime','qC_Verified_DateTime','score',
  'reportingManager','invoiceGenerated','invoiceGeneratedDate','customer_Confirmation_DateTime','salaryPayout'

];
displayedPeningColumns: string[] =  ['companyShortName','lot_Number',
  'headCount','ctc','netPay','createdOn','allottedDateTime','assignedTo','estimateTime','score','qC_Verified_DateTime',
  'reportingManager','invoiceGenerated','invoiceGeneratedDate','customer_Confirmation_DateTime','salaryPayout'
];
 filterValues = {
    companyShortName: '',
    lot_Number: ''
  };
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  
constructor(@Inject(DASH_TOKEN) private dashService: IDashBoardServices,
    @Inject(AUTH_TOKEN) private _authService: IAssignmentService,
    private _decrypt:EncryptionService,
    private _sessionStoreage:SessionStorageService,
  private toastr: ToastrService ){}
    selection = new SelectionModel<AdminDashboardDetailUI>(true, []);
    
  ngOnInit(): void {
  this.BindDashBoard();

  const request = {
    FilterType: null,
    FinancialYear: null,
    UserId: 0,
    FromDate: null,
    ToDate: null
  };

  this.BindDashboardDetail(request);
  this.BindPendingLot();
}
exportToExcelPending():void
{
 
  const dataToExport = this.pendingLots.filteredData || this.pendingLots.data;



const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
const workbook: XLSX.WorkBook = {
  Sheets: { 'Sheet1': worksheet },
  SheetNames: ['Sheet1']
};

const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
FileSaver.saveAs(blob, 'PendingLot.xlsx');

}

exportToExcelCompleted():void{  
  
  const dataToExports = this.dataSource.filteredData || this.dataSource.data;



const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExports);
const workbook: XLSX.WorkBook = {
  Sheets: { 'Sheet1': worksheet },
  SheetNames: ['Sheet1']
};

const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
FileSaver.saveAs(blob, 'Completed.xlsx');

}
applyFilters()
{
// const { name, age } = this.filterValues;

//     this.filteredDataSource.data = this.originalData.filter(item =>
//       item.name.toLowerCase().includes(name.toLowerCase()) &&
//       item.age.toString().includes(age)
//        );
  
}
getScoreColor(element: any): string {
  return element.score;
}

   isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

 BindPendingLot(): void {
  this.isLoading = true; // Optional: Add loading indicator

  this.dashService.getadminPendingLot().subscribe({
    next: (res) => {
      if (res && res.Data) {
        //console.log('Pending Lots:', res.Data);       
        this.pendingLots =  new MatTableDataSource<any>(res.Data); 
        // Optional: assign to variable
        this.pendingLots.paginator=this.PeningLot_paginator
      } else {
        console.warn('No pending lot data received.');
      }
    },
    error: (err) => {
      console.error('Failed to fetch pending lots:', err);
      //this.toastr.error('Unable to load pending lots. Please try again later.', 'Error');
    },
    complete: () => {
      this.isLoading = false; // Optional: stop loading indicator
    }
  });
}

  
  downloadExcelFromBase64(base64String: string, fileName: string,FileType): void {
  const byteCharacters = atob(base64String);
  const byteNumbers = Array.from(byteCharacters, char => char.charCodeAt(0));
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const downloadLink = document.createElement('a');
  downloadLink.href = URL.createObjectURL(blob);
  downloadLink.download = `${fileName}_${FileType}.xlsx`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}
GetDatashboardByFilter(): void {
  const fromdates = this.range.get('start')?.value;
  const Todates = this.range.get('end')?.value;
  if (fromdates && !Todates) {
    alert("Please select To Date");
    return;
  }

  if (!fromdates && Todates) {
    alert("Please select From Date");
    return;
  }
const request = {
  FilterType: '',
  FinancialYear: this.financialyear ? this.financialyear.financial_Year_Name : null,
  UserId: this.user ? this.user.user_Id : null,
  FromDate: fromdates,
  ToDate: Todates
};

 this.BindDashboardDetail(request);
}

  // Proceed with API call or logic here if dates are valid



  OutPutFileDownload(element: any): void {
  this.isLoading = true;

  const request = {
    companyId: element.company_Id,
    companycode: element.company_Code,
    pay_period_Id: element.pay_Period_Id,
    pay_period: element.pay_period,
    lotNumber: element.lot_Number,
    payroll_input_type: "Q"
  };

  this._authService.OutPutFileDownload(request).subscribe({
    next: (res) => {
      this.isLoading = false;

      if (res.StatusCode === 200) {
        const base64 = res.Data?.file;
        
        if (base64 && base64 !== "No") {
          this.downloadExcelFromBase64(base64, element.lot_Number,"Output");
        }
        else
        {
           this.toastr.error( res.Data?.fileName, "Error");
        }
      } else {
       
        console.error('Unexpected status code:', res.StatusCode);
      }
    },
    error: (error) => {
      this.isLoading = false;
      console.error('Download error:', error);
    }
  });
}

  InputDownload(element){
  this.isLoading=true;
   var request = {
      "companycode": element.company_Id,
      "pay_period_Id": element.pay_Period_Id,
      "lotNumber": element.lot_Number,
      "InputType": element.payroll_Input_Type
    }
    this._authService.InputFileDownload(request).subscribe({
      next: res => { if(res.StatusCode==200){
        const data=res.Data;
        var base64=data.file;
        this.downloadExcelFromBase64(base64,element.lot_Number,"Input")
        this.isLoading=false;
      }

      },
      error: error => console.error('Error:', error)
    })

}

BindDashboardDetail(val){
  this.dashService.getadmindashboarddetail(val).subscribe({
      next:res=>{
        
        this.dataSource= new MatTableDataSource<AdminDashboardDetailUI>(res.Data);
      this.dataSource.paginator = this.paginator;},
      error:err=>{console.log(err.message)}
    })
}

  BindDashBoard()
  {
    this.dashService.getadmindashboard().subscribe({
      next:res=>{this.carddashboard=res.Data;},
      error:err=>{console.log(err.message)}
    })
  }

handlefinancialYearEvent(financialYear:any)
{
 this.financialyear=financialYear;
}
getfromToDate(fromTodate:any){  
  this.range.patchValue({
  start: fromTodate.start,  // January 1, 2024
  end: fromTodate.end   // December 31, 2024
});


}

handleuserEvent(user:any)
{
  this.user=user;
  //console.log(user)
}
 masterToggle() {
    this.isAllSelected() ?
        this.selection.clear() :
        this.dataSource.data.forEach(row => this.selection.select(row));
  }

  logSelection() {
    //this.selection.selected.forEach(s => console.log(s.name));
  }
}
