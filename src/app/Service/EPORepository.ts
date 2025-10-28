import { Injectable } from "@angular/core";
import { IEPORepository } from "../Repository/IEPORepository";
import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { environment } from "../../environments/environment.development";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class EPoRespository implements IEPORepository {
    env = environment;
    httpClient: any;
    constructor(private http: HttpClient) {

    }
    GetEPODownloadTemplate(userId: string): Observable<APIResponse> {
        console.log(userId);
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/EmployeePoCreateTemplate/DownloadTemplate/' + userId)
    }

    BulkPOUpload(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'PurchaseOrder/BulkEmployeePOCreate',
            formData
        );
    }
    SearchEmployeePO(CompanyId: string, PONumber: string, clientEmployeeId: string, EActive: string, pricingtype_Id: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/EmployeePoView/' + CompanyId + '/' + PONumber + '/' + clientEmployeeId + '/' + EActive + '/' + pricingtype_Id);
    }

}