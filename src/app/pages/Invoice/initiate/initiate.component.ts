import { Component, Inject, InjectionToken, OnInit } from '@angular/core';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { CommonModule } from '@angular/common';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Payperiodclass } from '../../../Models/Common';
import { MatIconModule } from '@angular/material/icon';
import { IInvoiceRepository } from '../../../Repository/IInvoiceRepository';
import { InvoiceRepository } from '../../../Service/InvoiceRepository';
import { ICommonService } from '../../../Repository/ICommonService';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { InvoicetypeComponent } from '../../../common/invoicetype/invoicetype.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { InvoiceType } from '../../../Models/invoicetype';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Invoice_TOKEN = new InjectionToken<IInvoiceRepository>('Invoice_TOKEN');
@Component({
  selector: 'initiate',
  standalone: true,
  imports: [CommonModule,MatCheckboxModule,InvoicetypeComponent,CompanyallComponent,PayPeriodComponent,MatIconModule,MatTableModule],
  templateUrl: './initiate.component.html',
  styleUrl: './initiate.component.css',
   providers: [
        {
    
          provide: Invoice_TOKEN,
          useClass: InvoiceRepository,
    
        }]
})
export class InitiateComponent implements OnInit {
  selectedCompanyId!: number;
  payPeriod!: Payperiodclass;
  payPeriodType!: string;
  dataSource=new MatTableDataSource<any>([]);;
  invoiceType:any;
  selection = new SelectionModel<any>(true, []);
  userdetail:any;
  displayColumns=['action','serial_No','map_Name','net_CTC','netPay','input_No','pO_Number','employee_Head_Count','service_Charge','serviceChargeAmount','service_Charge_Master','service_Charge_Type','bgvbl','astfee','discT1','discT2','idcard','email','regfee','trnfee','ggdbt','ppekit','vmsfee','edufee','ntpry','renmac','draded','othdd','mbapp','calcrg','calrt','narration']
  constructor(@Inject(Invoice_TOKEN) private _invoiceService: IInvoiceRepository,private _decrypt:EncryptionService,
  private _sessionStoreage:SessionStorageService){

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

    const request={
      "invoiceInitiations":this.selection.selected,
      "TaxTypeId":this.invoiceType.geN_iID,
      "CreatedBy":this.userdetail.user_Id,
    }
    this._invoiceService.InvoiceInitiate(request).subscribe({
      next:res=>{ console.log(res);
        alert(res.Data.error_Message)},
      error:err=>{console.log(err)}
    })
  }
    downloadExcelFromBase64(base64: string, filename: string) {
     // this.isLoading=false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }
  export():void{
    
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
    const request={
      "companyId":this.selectedCompanyId,
      "Pay_Period":this.payPeriod.payPeriod,
      "Pay_Period_Id":this.payPeriod.payfrequencyid,
      "taxtypeId":this.invoiceType.geN_iID
    }
    this._invoiceService.ExportToExcel(request).subscribe({
      next:res=>{
        if(res.Data.file!="No")
        {
          this.downloadExcelFromBase64(res.Data.file,res.Data.fileName)
        }
        console.log(res)
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
  }
  handlePayperiodEvent(payperiod: Payperiodclass){
    this.payPeriod = payperiod;
  }
  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
      this.payPeriodType = "All";
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
    const request={
      "companyId":this.selectedCompanyId,
      "Pay_Period":this.payPeriod.payPeriod,
      "Pay_Period_Id":this.payPeriod.payfrequencyid,
      "taxtypeId":this.invoiceType.geN_iID
    }
    this._invoiceService.Search(request).subscribe({
      next:res=>{
         this.dataSource = new MatTableDataSource<any>(Array.isArray(res.Data) ? res.Data : []);
       // this.dataSource=new MatTableDataSource<any[]>(res.Data);
        //console.log(JSON.stringify(res.Data));
      },
      error:err=>{}
    });
  }
  onOptionSelected(event:InvoiceType){
   this.invoiceType =event;
  }
}
