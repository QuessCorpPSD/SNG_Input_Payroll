import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";


export interface IAttendanceProcessRepository {
    SearchDetails(payload): Observable<APIResponse>;
    ExporttoExcel(payload: any): Observable<APIResponse>;
    ImportAttendnace(formData: FormData): Observable<APIResponse>;
}