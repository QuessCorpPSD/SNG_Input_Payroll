import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PayrollinputComponent } from "../../PayrollInput/payrollinput.component";
import { InputaggregatoronboardingComponent } from "../inputaggregatoronboarding/inputaggregatoronboarding.component";

@Component({
  selector: 'app-inputaggregatorattendance',
  standalone: true,
  imports: [CommonModule, FormsModule, PayrollinputComponent, InputaggregatoronboardingComponent],
  templateUrl: './inputaggregatorattendance.component.html',
  styleUrl: './inputaggregatorattendance.component.css'
})
export class InputaggregatorattendanceComponent {
  searchText: any;
  isLoading = false;
  payperiodUI: any;
  companyUI: any;
  siteNameUI: any;
  payPeriodTypefromParent: any;
  ngOnInit(): void {
    this.payPeriodTypefromParent = "All";
  }

  applyFilter() {

  }
  handleCompanyEvent(company: any) {
    this.companyUI = company;
    // if (!this.companyUI) {
    //   alert("Select Company Code");
    //   return;
    // }

  }
  handlePayperiodEvent(payperiod: any) {
    this.payperiodUI = payperiod;
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    // if (!this.payperiodUI) {
    //   alert("Select Pay Period");
    //   return;
    // }
    if (this.companyUI && this.payperiodUI) {
      //this.BindDashBoard(this.companyUI.companyCode, this.payperiodUI.payPeriod)
    }

  }

  handleSiteNameEvent(site: any) {
    if (!this.companyUI) {
      alert("Select Company Code");
      return;
    }
    this.siteNameUI = site;
    //console.log('Site', this.siteNameUI);
  }

  Finalsubmissionclick() {

  }
  handleSearchattendance(){
    
  }
}
