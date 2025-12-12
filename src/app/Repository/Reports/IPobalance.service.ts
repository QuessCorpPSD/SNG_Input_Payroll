import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPobalancereport {
    Exporttoexcel(selectedCompanyId: any): Observable<APIResponse>
}