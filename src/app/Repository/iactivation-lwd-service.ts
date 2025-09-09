import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IActivationLwdService {
    GetEmployeeActivationLwd(companyCode: string, flag: string): Observable<APIResponse>;
    UploadEmployeeActivation(formData:FormData): Observable<APIResponse>;
    UploadEmployeeLWD(formData:FormData): Observable<APIResponse>;
}
