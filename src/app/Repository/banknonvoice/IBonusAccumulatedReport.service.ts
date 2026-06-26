import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IBonusAccumulatedReport {
  ExportToExcel(Company_Id: any, From_Date: any, To_Date: any): Observable<APIResponse>;
}