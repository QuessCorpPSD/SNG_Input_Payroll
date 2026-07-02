import { Injectable, signal } from '@angular/core';
import { Company, CompanyGSTInvoice, Payperiodclass } from './Models/Common';

@Injectable({ providedIn: 'root' })
export class OnboardingStateService {

  // signals holding the data
  private companyUI = signal<Company | null>(null);
  private payperiodUI = signal<Payperiodclass | null>(null);
  private companyGSTUI = signal<CompanyGSTInvoice | null>(null);


getCompanyGST(): CompanyGSTInvoice | null {
    return this.companyGSTUI();  // read current value
  }

  setCompanyGST(company: CompanyGSTInvoice | null) {
    this.companyGSTUI.set(company);
  }


  // -------- Company --------
  getCompany(): Company | null {
    return this.companyUI();  // read current value
  }

  setCompany(company: Company | null) {
    this.companyUI.set(company);  // update value
  }

  // optional: effect for listening changes
  companySignal() {
    return this.companyUI;  // return the signal itself if needed
  }

  // -------- Pay Period --------
  getPayperiod(): Payperiodclass | null {
    return this.payperiodUI();
  }

  setPayperiod(payperiod: Payperiodclass | null) {
    this.payperiodUI.set(payperiod);
  }

  payperiodSignal() {
    return this.payperiodUI;
  }

  // -------- Clear all --------
  clear() {
    this.companyUI.set(null);
    this.payperiodUI.set(null);
  }
}

