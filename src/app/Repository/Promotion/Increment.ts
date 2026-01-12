import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface Iincrement {
    GetPayperiod(companyId: any): Observable<APIResponse>;
    GetEmployeeCode(companyId: any): Observable<APIResponse>;
    Search(companyId: any, employeeId: any, payPeriodId: any): Observable<APIResponse>;
    BulkPOUpload(formData: FormData): Observable<APIResponse>;
    IncrementSearch(incrementId: any,): Observable<APIResponse>;


}