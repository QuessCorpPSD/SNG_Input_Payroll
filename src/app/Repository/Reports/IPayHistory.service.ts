import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPayHistoryService {
    downloadPayHistory(entityId: number, employeeCode: string, year: string): Observable<APIResponse>;
}