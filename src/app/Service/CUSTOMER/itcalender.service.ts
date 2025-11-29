import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { ICorporatebabk } from '../../Repository/customer/Icorporatebank';
import { IItcalender } from '../../Repository/customer/Iitcalender';

@Injectable({
    providedIn: 'root'
})
export class ItcalenderService implements IItcalender {
    env = environment
    constructor(private http: HttpClient) {
    }
    Search(val1: any, val2: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'ITCalender/Search/' + val1 + '/' + val2)
    }
    GetFinancialYear(): Observable<APIResponse> {
        return this.http.get<APIResponse>(this.env.apiUrl + 'ITCalender/GetFinancialYear')
    }
    Create(formData: FormData): Observable<APIResponse> {
        return this
            .http.post<APIResponse>(
                this.env.apiUrl + 'ITCalender/Create',
                formData
            );
    }
}