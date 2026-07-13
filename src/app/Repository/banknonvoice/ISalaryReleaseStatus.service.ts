import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ISalaryReleaseStatus {
    search(CompanyId: any, PayPeriod_Id: any, fromdate: any, todate: any, EmployeeIdNo:any): Observable<APIResponse>
    GetTemplate(userid: any, Flag: any): Observable<APIResponse> 
    GetBatchTypeList(userid:any): Observable<APIResponse>
    GetSalaryReleaseStatusdata(BatchType,FromDate,Todate,EmployeeCode,userid): Observable<APIResponse>
    GetSalaryReleaseStatusdataExport(BatchType,FromDate,Todate,EmployeeCode,userid): Observable<APIResponse>
    UtrUpload(formData: FormData): Observable<APIResponse>
}