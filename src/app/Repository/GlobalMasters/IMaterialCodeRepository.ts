import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface IMaterialCodeRepository {
    Search(): Observable<APIResponse>;
    Create(payload: any) : Observable<APIResponse>;
}