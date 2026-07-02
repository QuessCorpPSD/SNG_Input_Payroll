import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPartialSalaryReleaseStatus {

    Search(
        companyId: any,
        payPeriodId: any,
        fromDate: any,
        toDate: any,
        employeeIdNo: any
    ): Observable<APIResponse>;

    ExportToExcel(payload: any): Observable<APIResponse>;

    UploadSalaryReleaseStatus(payload: any): Observable<APIResponse>;



}