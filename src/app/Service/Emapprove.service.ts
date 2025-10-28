import { Injectable } from "@angular/core";
import { IEPORepository } from "../Repository/IEPORepository";
import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";
import { IEmApproveRepository } from "../Repository/IEmApprove.service";

@Injectable({
    providedIn: 'root'
})
export class EmApproveService implements IEmApproveRepository {
    env = environment;
    httpClient: any;
    constructor(private http: HttpClient) { }
    GetEmployeePOSerach(payload: any): Observable<APIResponse> {
        //console.log('Sending PO save payload:', payload);
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'EmployeePOApprove/EmployeePOApproveSearch',
            payload
        );
    }
    downloadExcel(payload:any):Observable<Blob> {
        return this.http.post<any>(`${this.env.apiUrl}EmployeePOApprove/EmployeePOExporttoexcel`, payload, {
            responseType:'blob'as'json'
        });
    }

    BulkApproveReject(payload:any):Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl+'EmployeePOApprove/EmployeePOApproveReject',
            payload
        );
    }


}
