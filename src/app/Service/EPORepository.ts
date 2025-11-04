import { Injectable } from "@angular/core";
import { IEPORepository } from "../Repository/IEPORepository";
import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
    providedIn: 'root'
})
export class EPoRespository implements IEPORepository {
    env = environment;
    httpClient: any;
    constructor(private http: HttpClient) {

    }
    GetEPODownloadTemplate(userId: string): Observable<APIResponse> {
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
    PODetailView(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'PurchaseOrder/EmployeePoViewEmpdtls',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
    GetInvoiceDescription(groupName: string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/GetBillingType/' + groupName);
    }

    GetPOQuantyValues(val): Observable<APIResponse> {
        const url = `${this.env.apiUrl}PurchaseOrder/POQuantityValue`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    GetPOvalue(val): Observable<APIResponse> {
        const url = `${this.env.apiUrl}PurchaseOrder/GetPOValue`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

    ImportFileUpload(formData: FormData): Observable<APIResponse> {
        return this
            .http.post<APIResponse>(
                this.env.apiUrl + 'PurchaseOrder/FileUploadEmployeePo',
                formData
            );
    }

    SaveEmployeePO(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'PurchaseOrder/EmployeePoNewCreation',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    GetPoEmpDuration(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'EmployeePOApprove/GetPoEmpDuration',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    GetPoEmpCalculation(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'EmployeePOApprove/GetPoEmpCalculation',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

    GetPoEmpValue(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'EmployeePOApprove/GetPoEmpValue',
            payload,
            {
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }

}