import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { env } from 'process';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';
import { APIResponse } from '../../Models/apiresponse';
import { IBankRepository } from '../../Repository/GlobalMasters/IBankrepository';



@Injectable({
    providedIn: 'root'
})
export class BankService implements IBankRepository {
    env = environment
    constructor(private http: HttpClient) {
    }
    Search(): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl + 'Bank/Search');
    }
    PostAddBank(BankRequest: any): Observable<APIResponse> {
        const url = `${this.env.apiUrl}Bank/Create`;
        return this.http.post<APIResponse>(url, BankRequest);
    }

}