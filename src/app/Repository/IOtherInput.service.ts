import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IOtherInputServices {

    GetGratuityTemplate (formData:FormData):Observable<APIResponse>;
    GetGratuityReview (formData:FormData):Observable<APIResponse>;
    PostGratuityAttendanceData (formData:FormData):Observable<APIResponse>;
    GetNCPPayregisterTemplate (formData:FormData):Observable<APIResponse>;
    PostNCPPayregisterUpload (formData:FormData):Observable<APIResponse>;
    GetAllInvoiceRule(companyId:number, siteId:string):Observable<APIResponse>;
}