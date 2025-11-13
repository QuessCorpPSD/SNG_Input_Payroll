import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ISalaryadvancereport {

    Search(companyId: any, payperiod: any): Observable<APIResponse>;
}