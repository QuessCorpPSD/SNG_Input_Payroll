

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { IBankAdviseSplitCulture } from '../../Repository/banknonvoice/IBankadvisesplitculture';


@Injectable({
    providedIn: 'root'
})
export class BankAdviseSplitCultureService implements IBankAdviseSplitCulture {

    env = environment;

    constructor(private http: HttpClient) {

    }

    getvendor(filter: any, Company_id: any): Observable<APIResponse> {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'Bankadvisesplitculture/getvendor/' + filter+'/'+Company_id
        );
    };

    getgroupname(Company_id: any, client_id: any) {
        return this.http.get<APIResponse>(
            this.env.apiUrl +
            'Bankadvisesplitculture/getgroupname/' + Company_id+'/'+client_id
        );
    };

    createbankadvisesplitculture(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            `${this.env.apiUrl}Bankadvisesplitculture/createbankadvisesplitculture`,
            payload
        );
    };
    getsearcheditdata(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            `${this.env.apiUrl}Bankadvisesplitculture/getsearcheditdata`,
            payload
        );
    };

     getsearcheditdataExport(payload: any): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            `${this.env.apiUrl}Bankadvisesplitculture/getsearcheditdataExport`,
            payload
        );
    };
    uploadbankadvisesplitculture(formdata: FormData): Observable<APIResponse> {
        return this.http.post<APIResponse>(
            this.env.apiUrl + 'Bankadvisesplitculture/uploadbankadvisesplitculture',
            formdata
        );
    };
}