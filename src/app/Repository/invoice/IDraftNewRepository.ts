import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";
import { HttpResponse } from "@angular/common/http";
import { format } from "echarts/core";

export interface IDraftNewRepository {

    GetPerformaInvoice(CompanyId: string, PayPriod: string, userId: string): Observable<APIResponse>;
    PerformaInvoiceSplit(formData: FormData): Observable<APIResponse>;
    PerformaInvoiceMerge(payload: any): Observable<APIResponse>;
    PerformaInvoiceInitiate(payload: any): Observable<APIResponse>;
    UpdateMapName(formData: FormData): Observable<APIResponse>;
    UploadAttributes(formData: FormData): Observable<APIResponse>;
    GetAllAttribute(val): Observable<APIResponse>;
    GetAllAttributeAddAndUpdate(val): Observable<APIResponse>;
    PerformaInvoiceMergeNew(payload: any): Observable<APIResponse>;
    InvoiceBackDated(companyId,payfrequencyid):Observable<APIResponse>;
    GetSplitTemplate(payload: any): Observable<APIResponse>;
    PostPushData(payload: any): Observable<APIResponse>;
    GetDraftInformation(CompanyId: string, PayPriod: string, userId: string): Observable<APIResponse>;
    PerformaInvoiceSkip(payload: any): Observable<APIResponse>;
}