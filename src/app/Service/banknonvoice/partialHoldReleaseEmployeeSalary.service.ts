

import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { APIResponse } from '../../Models/apiresponse';
import { HttpClient } from '@angular/common/http';
import { IpartialHoldReleaseEmployeeSalary } from '../../Repository/banknonvoice/IpartialHoldReleaseEmployeeSalary';

@Injectable({
  providedIn: 'root'
})
export class partialHoldReleaseEmployeeSalaryService implements IpartialHoldReleaseEmployeeSalary {

  env = environment;

  constructor(private http: HttpClient) { }
}