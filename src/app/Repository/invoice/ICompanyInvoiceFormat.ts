import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";
import { format } from "echarts/core";

export interface ICompanyInvoiceFormatRepository{
   GetAllCompanyInvoiceFormat(userId: number): Observable<APIResponse>;
   GetAllInvoiceType(): Observable<APIResponse>;
   GetAllInvoiceFormat(): Observable<APIResponse>;
   CompanyInvoiceFormatAddsave(payload:any): Observable<string>;
   CompanyInvoiceFormatEditsave(payload:any): Observable<string>;
}