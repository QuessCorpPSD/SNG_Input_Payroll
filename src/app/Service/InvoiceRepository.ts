import { Injectable } from "@angular/core";
import { IInvoiceRepository } from "../Repository/IInvoiceRepository";
import { Observable } from "rxjs";
import { APIResponse } from "../Models/apiresponse";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class InvoiceRepository implements IInvoiceRepository {
     environment=environment;
        constructor(private http:HttpClient)
        {
    
        }
    Search(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/Search`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    InvoiceInitiate(val): Observable<APIResponse> {

        const url = `${this.environment.apiUrl}InvoiceInitiation/InvoiceInitiate`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }
    ExportToExcel(val): Observable<APIResponse> {
        

        const url = `${this.environment.apiUrl}InvoiceInitiation/ExportToExcel`;
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        });
        const config = new HttpHeaders().set('Content-Type', 'application/json')
            .set('Accept', 'application/json')
        return this.http.post<APIResponse>(url, JSON.stringify(val), { headers });
    }

}