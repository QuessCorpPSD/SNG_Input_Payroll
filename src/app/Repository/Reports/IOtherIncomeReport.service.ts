import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IOtherIncomeReport {
    Exporttoexcel(CompanyId: any, paySequenceNo: any, payCodeId: any, inputNo: any): Observable<APIResponse>
    getInputNo(CompanyId: any, payPeriodId: any);
}