import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IpayregisterunprocessedService {
  GetExporttoExcel(CompanyId: string, PayperiodId: string): Observable<APIResponse>;
}
