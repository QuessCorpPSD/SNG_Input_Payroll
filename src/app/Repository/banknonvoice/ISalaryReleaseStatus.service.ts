import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ISalaryReleaseStatus {
    search(CompanyId: any, PayPeriod_Id: any, fromdate: any, todate: any, EmployeeIdNo:any): Observable<APIResponse>
}