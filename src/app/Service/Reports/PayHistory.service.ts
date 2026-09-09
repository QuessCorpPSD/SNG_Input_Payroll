import { HttpClient } from '@angular/common/http';
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

    downloadPayHistory(entityId: number, employeeCode: string, year: string): Observable<APIResponse> {
        const url =
            `${this.env.apiUrl}PayHistory/DownloadPayHistory` +
            `?entityId=${entityId}` +
            `&employeeCode=${employeeCode || ''}` +
            `&Year=${year}`;
        return this.http.get<APIResponse>(
            url
        );
    }
}