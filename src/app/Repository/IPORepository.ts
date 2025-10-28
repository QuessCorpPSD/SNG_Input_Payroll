import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IPORespository {
    GetPOCategory(): Observable<APIResponse>
    GetInvoiceDescription(groupName): Observable<APIResponse>;
    GetInvoiceType(): Observable<APIResponse>;
    GetPOQuantyValues(val): Observable<APIResponse>
    BulkPOUpload(formData: FormData): Observable<APIResponse>
    POSearch(companyId): Observable<APIResponse>
    Mainposearch(companyId:string,pricingType:string,Ponumber:string): Observable<APIResponse>
    POSearchCompanyAndPoNumber(val): Observable<APIResponse>
    ImportFileUpload(formData: FormData): Observable<APIResponse>;
    PONumberSearch(companyId): Observable<APIResponse>
    GetPricingType(): Observable<APIResponse>
    AddPOSave(payload: any): Observable<APIResponse>
    GetPOCreateDownloadTemplate(userId:string): Observable<APIResponse> 
    GetEmployeePOSerach(payload:any):Observable<APIResponse>;
}
