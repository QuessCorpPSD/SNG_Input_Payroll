import { Injectable, signal } from '@angular/core';
import { Company, Payperiodclass } from '../../Models/Common';

@Injectable({
  providedIn: 'root'
})
export class BankinvoiceService {

  private companyUI = signal<Company | null>(null);
  private payperiodUI = signal<Payperiodclass | null>(null);



  // -------- Company --------
  getCompany(): Company | null {
    return this.companyUI();  
  }

  setCompany(company: Company | null) {
    this.companyUI.set(company);  
  }

  companySignal() {
    return this.companyUI;
  }

  getPayperiod(): Payperiodclass | null {
    return this.payperiodUI();
  }

  setPayperiod(payperiod: Payperiodclass | null) {
    this.payperiodUI.set(payperiod);
  }

  payperiodSignal() {
    return this.payperiodUI;
  }

  clear() {
    this.companyUI.set(null);
    this.payperiodUI.set(null);
  }


}
