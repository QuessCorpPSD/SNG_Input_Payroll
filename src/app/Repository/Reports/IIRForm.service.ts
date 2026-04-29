import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IIRformService {
  GetEmployee(CompanyId: string): Observable<APIResponse>;
  DownloadForm(EmployeeId: string): Observable<APIResponse>;
}

