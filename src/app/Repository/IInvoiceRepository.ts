import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IInvoiceRepository {

    Search(val): Observable<APIResponse>;
    InvoiceInitiate(val): Observable<APIResponse>;
    ExportToExcel(val): Observable<APIResponse>;
    GetAllInvoiceDetails(companyId: number, payPeriodId: number, userId: string): Observable<APIResponse>;
    BillableSearch(val): Observable<APIResponse>;
    BillableUpload(val): Observable<APIResponse>;
    BillableDaysSearchExport(val): Observable<APIResponse>;
    BillableTemplateDownload(importtype): Observable<APIResponse>;
    Search(val): Observable<APIResponse>;
    ExportToExcel(val): Observable<APIResponse>;
    InitialSearch(val): Observable<APIResponse>;
    InitiationSearchExport(val): Observable<APIResponse>;
    UploadReject(formData): Observable<APIResponse>;
    GetGSTInvoice(userId: number): Observable<APIResponse>;
    DownloadInvoice(invoiceId: number): Observable<HttpResponse<Blob>>;
    BulkDownloadInvoice(BulkInvoices: any): Observable<HttpResponse<Blob>>;
}