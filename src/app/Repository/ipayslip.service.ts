import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IpayslipService {
  GetEmployee(CompanyId: string, PayperiodId: string): Observable<APIResponse>;
  DownloadPayslip(EmployeeId: string, Payperiod: string): Observable<APIResponse>;
}

