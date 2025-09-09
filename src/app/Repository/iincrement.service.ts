import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";


export interface IIncrementService {
  GetEmployeeIncrement(companyId: string, InputType: string,MapNameId:string): Observable<APIResponse>;
  UploadIncrementData(formData:FormData): Observable<APIResponse>;
}
