import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";

export interface IInvoiceRepository {

    Search(val): Observable<APIResponse>;
    InvoiceInitiate(val): Observable<APIResponse>;
    ExportToExcel(val): Observable<APIResponse>;
    GetAllInvoiceDetails(companyId: number, payPeriodId: number, userId: string): Observable<APIResponse>;
    BillableSearch(val): Observable<APIResponse>;
    UploadBillable(formData: FormData): Observable<APIResponse>;
    BillableDaysSearchExport(val): Observable<APIResponse>;
    BillableTemplateDownload(importtype): Observable<APIResponse>;
    Search(val): Observable<APIResponse>;
    ExportToExcel(val): Observable<APIResponse>;
    InitialSearch(val): Observable<APIResponse>;
    InitiationSearchExport(val): Observable<APIResponse>;
    UploadCancel(formData): Observable<string>;
    GetGSTInvoice(userId: number): Observable<APIResponse>;
    DownloadInvoice(invoiceId: number): Observable<HttpResponse<Blob>>;
    BulkDownloadInvoice(BulkInvoices: any): Observable<HttpResponse<Blob>>;
    getGSTInvoiceType(): Observable<APIResponse>;
    getCTCDeductionType(): Observable<APIResponse>;
    getBillingType(): Observable<APIResponse>;
    getNetDeductionType(): Observable<APIResponse>;
    addGstInvoice(payload: any): Observable<string>;
    POSearch(companyId: number, payPeriodId: number): Observable<APIResponse>;
    POInvoiceInitiate(payload: any): Observable<APIResponse>;
    ExportPOInvoice(companyId: number, payPeriodId: number): Observable<any>;
    RequestPOInvoice(companyId: number, payPeriodId: number): Observable<any>;
    POInvoiceUpload(payload: FormData): Observable<APIResponse>;
    GetGSTPercentage(): Observable<APIResponse>;

    //attribute code
    UploadAttributesGST(formData: FormData): Observable<APIResponse>;
    GetAllAttribute(val): Observable<APIResponse>
}