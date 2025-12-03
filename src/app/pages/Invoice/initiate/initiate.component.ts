import { Component, Inject, InjectionToken, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { CommonModule } from '@angular/common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { MatIconModule } from '@angular/material/icon';
import { IInvoiceRepository } from '../../../Repository/invoice/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/invoice/InvoiceRepository';
import { ICommonService } from '../../../Repository/ICommonService';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoicetypeComponent } from '../../../common/invoicetype/invoicetype.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { InvoiceType } from '../../../Models/invoicetype';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
@Component({
  selector: 'initiate',
  standalone: true,
  imports: [CommonModule,  MatTabsModule,MatPaginatorModule,FormsModule,MatFormFieldModule, MatCardModule,MatCheckboxModule, InvoicetypeComponent, CompanyallComponent, PayPeriodComponent, MatIconModule, MatTableModule],
  templateUrl: './initiate.component.html',
  styleUrl: './initiate.component.css',
   providers: [
        {
    
          provide: Invoice_TOKEN,
          useClass: InvoiceRepository,
    
        }]
})
export class InitiateComponent implements OnInit {
  @ViewChild('PeningLotPaginator') PeningLot_paginator!: MatPaginator;
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  remarks = '';
  dataSource=new MatTableDataSource<any>([]);;
  invoiceType:any;
  selection = new SelectionModel<any>(true, []);
  userdetail:any;
  currentElement:any;
  isdisabled:boolean=false;
  issearch:boolean=false;
  @ViewChild('editDialog') editDialog!: TemplateRef<any>;
  dialogRef!: MatDialogRef<any>;
  isLoading:boolean= false;
  companyUI: any;
  displayColumns=['action','serial_No','map_name','net_CTC','netPay','lotNo','input_No','pO_Number','employee_Head_Count','service_Charge','serviceChargeAmount','service_Charge_Master','service_Charge_Type','bgvbl','astfee','discT1','discT2','idcard','email','regfee','trnfee','ggdbt','ppekit','vmsfee','edufee','ntpry','renmac','draded','othdd','mbapp','calcrg','calrt','narration']
  constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository,private _decrypt:EncryptionService,
  private _sessionStoreage:SessionStorageService,private dialog: MatDialog){
  }
 

  openDialog(): void {
    //this.currentElement = { ...element }; // make copy for editing
    this.dialogRef = this.dialog.open(this.editDialog, {
      width: '400px',
      data: "text"
    });
  }
  
  Invoiceintiate():void{
      if(this.selectedCompanyId==undefined)
      {
        alert("Select Company ");
        return;
      }
  
      if(this.payPeriod==undefined)
      {
        alert("Select PayPeriod ");
        return;
      }
      if(this.invoiceType==undefined)
      {
        alert("Select Invoice Type ");
        return;
      }
     if(this.selection.selected.length==0)
     {
      alert("Please Select atleast one row");
      return;
     }
     this.isdisabled=true;
     this.isLoading=true;
      const request={
        "invoiceInitiations":this.selection.selected,
        "TaxTypeId":this.invoiceType.geN_iID,
        "CreatedBy":this.userdetail.user_Id,
      }
      this._invoiceService.InvoiceInitiate(request).subscribe({
        next:res=>{ console.log(res);
          alert(res.Data.error_Message);
         this.isdisabled=false;
         this.InvoiceSearch();
         this.isLoading=false;
        },
        error:err=>{console.log(err);
          this.isdisabled=false;
          this.isLoading=false;
        }
      })
    }
  downloadExcelFromBase64(base64: string, filename: string) {
       // this.isLoading=false;
      const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
      const downloadLink = document.createElement('a');
      downloadLink.href = source;
      downloadLink.download = filename;
      downloadLink.click();
      this.isLoading=false;
    }
    InitiationSearchExport():void{
      
      if(this.selectedCompanyId==undefined)
      {
        alert("Select Company ");
        return;
      }
  
      if(this.payPeriod==undefined)
      {
        alert("Select PayPeriod ");
        return;
      }
      if(this.invoiceType==undefined)
      {
        alert("Select Invoice Type ");
        return;
      }
      this.isLoading=true;
       const request = {
        "Company_Id": this.selectedCompanyId,
        "PayPeriod_Id": this.payPeriod.payfrequencyid,
        "InvoiceType": 0,
        "ActionType": "S"
      }
      this.isLoading=true;
      this._invoiceService.InitiationSearchExport(request).subscribe({
        next:res=>{
          if(res.Data.file!="No")
          {
            this.downloadExcelFromBase64(res.Data.file,res.Data.fileName)
          }
          
        },
        error:err=>{
          console.log(err);
        }
      })
    }
    toggleRow(event)
    {
  
    }
     isAllSelected() {
      const numSelected = this.selection.selected.length;
      const numRows = this.dataSource.data.length;
      return numSelected === numRows;
    }
      isSomeSelected() {
      console.log(this.selection.selected);
      return this.selection.selected.length > 0;
    }
     masterToggle() {
      // if there is a selection then clear that selection
      if (this.isSomeSelected()) {
        this.selection.clear();
      } else {
        this.isAllSelected()
          ? this.selection.clear()
          : this.dataSource.data.forEach(row => this.selection.select(row));
      }
    }
    handleCompanyEvent(company)
    {
      this.selectedCompanyId = company.companyId;
      this.companyUI = company;
      console.log(this.companyUI);
    }
    handlePayperiodEvent(payperiod: Payperiodclass){
      this.payPeriod = payperiod;
    }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.payPeriodType = "All";
    const request = {
      "Company_Id": 0,
      "PayPeriod_Id": 0,
      "InvoiceType": 0,
      "ActionType": "A"
    }
    
    // this._invoiceService.InitialSearch(request).subscribe({
    //   next: res => {
        
    //     this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
    //     this.dataSource.paginator=this.PeningLot_paginator
    //   },
    //   error: err => { console.log(err) }
    // })

  }
  
    InvoiceSearch(){
  
      if(this.selectedCompanyId==undefined)
      {
        alert("Select Company ");
        return;
      }
  
      if(this.payPeriod==undefined)
      {
        alert("Select PayPeriod ");
        return;
      }
      if(this.invoiceType==undefined)
      {
        alert("Select Invoice Type ");
        return;
      }
      // const request={
      //   "companyId":this.selectedCompanyId,
      //   "Pay_Period":this.payPeriod.payPeriod,
      //   "Pay_Period_Id":this.payPeriod.payfrequencyid,
      //   "taxtypeId":this.invoiceType.geN_iID
      // }
      this.issearch=true;
      this.isLoading=true;
      const request = {
        "Company_Id": this.selectedCompanyId,
        "PayPeriod_Id": this.payPeriod.payfrequencyid,
        "ActionType": "Search",
        "Invoice_Billing_Type": this.companyUI.invoice_Billing_Type,
        "CreatedBy": this.userdetail.user_Id
      }
      this._invoiceService.InitialSearch(request).subscribe({
        next:res=>{
          console.log(res);
           this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
           this.dataSource.paginator=this.PeningLot_paginator;
           this.issearch=false;
           this.isLoading=false;
         // this.dataSource=new MatTableDataSource<any[]>(res.Data);
          //console.log(JSON.stringify(res.Data));
        },
        error:err=>{this.issearch=false;}
      });
    }
    onOptionSelected(event:InvoiceType){
     this.invoiceType =event;
    }
}
