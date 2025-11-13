import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";


export interface IArrearAttendanceProcessRepository {
    SearchDetails(payload): Observable<APIResponse>;
    ExporttoExcel(payload: any): Observable<APIResponse>;
    ImportArrearAttendnace(formData: FormData): Observable<APIResponse>;
}