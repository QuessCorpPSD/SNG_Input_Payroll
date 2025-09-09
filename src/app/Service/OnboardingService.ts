import { Injectable } from "@angular/core";
import { IOnboardingServices } from "../Repository/IOnboardingService";
import { environment } from "../../environments/environment.development";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { APIResponse } from "../Models/apiresponse";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})
export class OnboardingServices implements IOnboardingServices {
    environment = environment;
    constructor(private http: HttpClient) {

    }

    GetOnboardingData(companyCode: string, payPeriod: string): Observable<APIResponse> {
        //console.log(this.environment.apiUrl + 'Onboarding/GetAllOnboardingDetails/' + companyCode + '/' + payPeriod);
        return this.http.get<APIResponse>(this.environment.apiUrl + 'Onboarding/GetAllOnboardingDetails/' + companyCode + '/' + payPeriod);
    }

    // GetNewJoineeTemplate(companyId: number, payPeriodId: number): Observable<APIResponse> {
    //     console.log(this.environment.apiUrl + 'Onboarding/GetNewJoineeTemplate/' + companyId + '/' + payPeriodId);
    //     return this.http.get<APIResponse>(this.environment.apiUrl + 'Onboarding/GetNewJoineeTemplate/' + companyId + '/' + payPeriodId);
    // }
    GetNewJoineeTemplate(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/GetNewJoineeTemplate`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }

    MovetoQpay(offerIdJson: string, companyId: number, payPeriod: string, payPeriodId: number, userId: string): Observable<APIResponse> {
        //const payload = JSON.stringify(offerIdJson);
        //const encodedPayload = encodeURIComponent(payload);

        const url = `${this.environment.apiUrl}Onboarding/MoveToQpay/${offerIdJson}/${companyId}/${payPeriod}/${payPeriodId}/${userId}`;

        //console.log('Request URL:', url);

        return this.http.get<APIResponse>(url);
    }

    PostValidateOfferId(offerIds: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/PostValidateOfferId/${offerIds}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    PostRollbackOfferId(offerIds: string, userId: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/PostRollbackOfferId/${offerIds}/${userId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    PostNewJoineeData(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/PostNewJoineeData`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }

    PostAttendanceData(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Timesheet/PostAttendanceData`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }
    VerifyAttendanceHeaders(formData2: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Timesheet/VerifyAttendanceHeaders`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData2);
    }
    PostOneTimeInputData(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/PostOneTimeInputData`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }
    GetCurrentPayperiod(companyId: any): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/GetCurrentPayperiod/${companyId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }
    GetFinalSubmitData(companyId: number, payPeriodId: number, inputId: number, userId: string): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/GetAllFinalSubmitDetails/${companyId}/${payPeriodId}/${inputId}/${userId}`;
        //console.log(url);
        return this.http.get<APIResponse>(url);
    }

    GetPayRegister(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/GetPayRegister`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }

    PostFinalSubmission(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/PostFinalSubmission`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }
    GetNewJoineeEmployeeId(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/GetNewJoineeEmployeeId`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }
    GetConsolidatedPayRegister(formData: FormData): Observable<APIResponse> {
        const url = `${this.environment.apiUrl}Onboarding/GetConsolidatePayRegister`;
        //console.log(url);
        return this.http.post<APIResponse>(url, formData);
    }
}