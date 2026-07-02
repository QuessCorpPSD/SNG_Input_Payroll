import { Injectable } from "@angular/core";
import { environment } from "../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";
import { IPORespository } from "../Repository/IPORepository";


@Injectable({
    providedIn: 'root'
})
export class PoRespository implements IPORespository {
    env = environment;
    httpClient: any;
    constructor(private http: HttpClient) {

    }
    GetPOCategory(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/GetCategory')
    }
    GetInvoiceDescription(groupName): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/GetBillingType/' + groupName);
    }
    GetInvoiceType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/GetInvoiceType')
    }
    POSearch(companyId): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/PoSearchByCompanyId/' + companyId)
    }

    Mainposearch(companyId : string,pricingType:string,Ponumber:string): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/MainPoSearch/' + companyId+'/'+pricingType+'/'+Ponumber)
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
    // BulkPOUpload(val): Observable<APIResponse> {
    //     const url = `${this.env.apiUrl}PurchaseOrder/POBulkUpload`;
    //     const headers = new HttpHeaders({
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json'
    //     });

    //     const config = new HttpHeaders().set('Content-Type', 'application/json')
    //         .set('Accept', 'application/json')
    //     return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    // }
    BulkPOUpload(formData: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'PurchaseOrder/BulkPOCreate',
            formData 
        );
    } 
    POSearchCompanyAndPoNumber(val): Observable<APIResponse> {
        const url = `${this.env.apiUrl}PurchaseOrder/POSearchCompanyAndPoNumber`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });

        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

    ImportFileUpload(formData: FormData): Observable<APIResponse> {
        return this
            .http.post<APIResponse>(
                this.env.apiUrl + 'PurchaseOrder/FileUploadMainPo',
                formData
            );
    }

    PONumberSearch(companyId: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/PoSearchByCompanyId/' + companyId)
    }

    GetPricingType(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/GetInvoiceType')

    }
    AddPOSave(payload: any): Observable<APIResponse> {
        //console.log('Sending PO save payload:', payload);
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'PurchaseOrder/CreateMainPo',
            payload
        );
    }
    GetPOCreateDownloadTemplate(userId:any): Observable<any> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'PurchaseOrder/GetPoCreateTemplate/DownloadTemplate/' + userId)
    }

       GetEmployeePOSerach(payload: any): Observable<APIResponse> {
        //console.log('Sending PO save payload:', payload);
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'PurchaseOrder/EmployeePoView',
            payload
        );
    }

}