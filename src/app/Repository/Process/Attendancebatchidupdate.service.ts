import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IAttendanceBatchidupdate{
  Upload(formData: FormData): Observable<APIResponse> ;

}