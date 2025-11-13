import { Observable } from "rxjs";
import { APIResponse } from "../../Models/apiresponse";

export interface ISHGService {
    SearchShg(date: Date): Observable<APIResponse>
    getCategory(): Observable<APIResponse>

}