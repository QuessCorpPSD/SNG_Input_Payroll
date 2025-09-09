import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";

export interface IPayrollInputService {
GetPayrollInputMenu():Observable<APIResponse>;
}