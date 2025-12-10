import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IinvoiceRuleService {
    GetAllInvoiceRule(companyId: number, siteId: string): Observable<APIResponse>;
    PostAddInvoiceRule(InvoiceRuleAdd: any): Observable<APIResponse>;
    PostDeleteInvoiceRule(invoicingRulesID: number): Observable<APIResponse>;
    GetInvoiceRuleTemplate(formData: FormData): Observable<APIResponse>;
    PostInvoiceRuleUpload(formData: FormData): Observable<APIResponse>;
    InvoiceRuleExport(formData: FormData): Observable<APIResponse>;
    PostUpdateInvoiceRule(invoiceRuleEdit: any): Observable<APIResponse>;
}