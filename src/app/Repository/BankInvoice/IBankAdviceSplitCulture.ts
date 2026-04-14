import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IBankAdvoceSplitCulture {
    search(payload: any): Observable<APIResponse>;
    GetMapName(companyId: any): Observable<APIResponse>;
    Save(payload: any): Observable<APIResponse>;
    UploadBankInvoiceSplit(formData: FormData): Observable<APIResponse>
}