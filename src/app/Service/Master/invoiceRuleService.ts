import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment.development";
import { APIResponse } from "../../Models/apiresponse";
import { map, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IinvoiceRuleService } from "../../Repository/Master/IinvoiceRuleService";
@Injectable({
  providedIn: 'root'
})
export class invoiceRuleService implements IinvoiceRuleService {
  environment = environment
  constructor(private http: HttpClient) {
  }
  GetAllInvoiceRule(companyId: number, siteId: string): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceRule/GetAllInvoiceRule/${companyId}/${siteId}`;
    //console.log(url);
    return this.http.get<APIResponse>(url);
  }
  PostAddInvoiceRule(InvoiceRuleAdd: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceRule/PostAddInvoiceRule`;
    return this.http.post<APIResponse>(url, InvoiceRuleAdd);
  }
  PostDeleteInvoiceRule(invoicingRulesID: number): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceRule/PostDeleteInvoiceRule`;
    return this.http.post<APIResponse>(url, invoicingRulesID);
  }
  GetInvoiceRuleTemplate(formData: FormData): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceRule/GetInvoiceRuleTemplate`;
    //console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }
  PostInvoiceRuleUpload(formData: FormData): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceRule/PostInvoiceRuleUpload`;
    //console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }

  InvoiceRuleExport(formData: FormData): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceRule/InvoiceRuleExport`;
    //console.log(url);
    return this.http.post<APIResponse>(url, formData);
  }
  // invoice-rule.service.ts
  PostUpdateInvoiceRule(invoiceRuleEdit: any): Observable<APIResponse> {
    const url = `${this.environment.apiUrl}InvoiceRule/PostEditInvoiceRule`;
    return this.http.post<APIResponse>(url, invoiceRuleEdit);
  }

}

