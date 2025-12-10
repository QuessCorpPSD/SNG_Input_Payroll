import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";
import { format } from "echarts/core";

export interface ICreditNoteRepository {
    GetCreditNotePurpose(companyId: number): Observable<APIResponse>;
    CreditNoteSearch(payload: any): Observable<APIResponse>;
    UploadCreditNoteRequest(formData: FormData): Observable<APIResponse>;
    ExportCreditNoteRequest(payload: any): Observable<APIResponse>;
    CreditNoteApproveSearch(payload: any): Observable<APIResponse>;
    UploadCreditNoteApprove(formData: FormData): Observable<APIResponse>;
    CreditNoteUpdateSearch(payload: any): Observable<APIResponse>;
    UploadCreditNoteCancel(formData: FormData): Observable<APIResponse>;
    DownloadInvoice(CreditNoteid: number, CompanyId: number, InvoiceNumber: number, InvoiceID: number): Observable<HttpResponse<Blob>>;
}