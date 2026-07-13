import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IpartialHoldReleaseEmployeeSalary {

    GetTemplate(userid: any, Flag: any): Observable<APIResponse>;
    UploadReleaseHoldSalary(formData: FormData,flag:any): Observable<APIResponse>
}