import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface Iinvoiceculture {
    GetStates(companyId: string): Observable<APIResponse>
    InvoicecultureSearch(companyId: number): Observable<APIResponse>
    ServiceChargeMaster(payload: any): Observable<APIResponse>
    CreateNewPO(payload: any): Observable<APIResponse>
    InvoiceType(): Observable<APIResponse>
    postInvoiceCulture(payload: any): Observable<APIResponse>
    InvoiceCategory(): Observable<APIResponse>
    InvoiceCategory(): Observable<APIResponse>
    UploadInvoiceCulture(formData: FormData): Observable<APIResponse>
    ExportToExcel(userId: number): Observable<APIResponse>
    getAllPaycode(companyId: number): Observable<APIResponse>
}

