import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IPayHistoryService } from '../../Repository/Reports/IPayHistory.service';


@Injectable({
    providedIn: 'root'
})
export class PayHistoryService implements IPayHistoryService {
    env = environment;
    constructor(private http: HttpClient) { }

    downloadPayHistory(CompanyId: string, year: string): Observable<APIResponse> {
        const url =
            `${this.env.apiUrl}PayHistory/DownloadPayHistory` +
            `/${CompanyId}` +
            `/${year}`;
        return this.http.get<APIResponse>(
            url
        );
    }

    GetEntity(): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl + 'InvoiceLegalEntity/Search',
        );
    }

    bindYear(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'IR/GetLastThreeYear/');
    }

    downloadPayHistoryPDF(companyId: string, year: string): Observable<HttpResponse<Blob>> {
        return this.http.post(
            `${this.env.apiUrl}PayHistory/DownloadPayHistoryPDF/${companyId}/${year}`,
            null,
            {
                observe: 'response',
                responseType: 'blob'
            }
        );
    }

    downloadPayVarience(CompanyId: string): Observable<APIResponse> {
        const url =
            `${this.env.apiUrl}PayHistory/DownloadPayVarience` +
            `/${CompanyId}`;
        return this.http.get<APIResponse>(
            url
        );
    }
}