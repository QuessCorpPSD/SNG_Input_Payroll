import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IPOReportService {
    GetAllPOEmployeeReport(employeeId: string, emlpoyeeType: string): Observable<APIResponse>;
    GetPOYears (): Observable<APIResponse>;
    GetVerticals (userId: string, potype: string): Observable<APIResponse>;
    GetAllActiveInactivePO(POActiveReportParams: any): Observable<APIResponse>;
    GetAllMonthWisePOReport(txtFromDate: Date, txtToDate: Date): Observable<APIResponse>;
}