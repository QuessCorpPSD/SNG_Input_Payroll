import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GroupnameComponent } from '../../../common/groupname/groupname.component';
import { InputTypeComponent } from '../../../common/input-type/input-type.component';
import { MapnameComponent } from '../../../common/Mapname/mapname/mapname.component';
import { PayPeriodComponent } from '../../../common/payperiod/payperiod.component';
import { Company, Payperiodclass, Mapnameclass, InputTypeclass, Groupnameclass, Cityclass } from '../../../Models/Common';
import { OnboardingStateService } from '../../../onboarding-state.service';
import { CompanyComponent } from "../../../common/company/company.component";

@Component({
  selector: 'inputaggregatoronboarding',
  standalone: true,
  imports: [CommonModule, RouterModule, PayPeriodComponent,
    GroupnameComponent, MapnameComponent, InputTypeComponent,
    FormsModule, CompanyComponent],
  templateUrl: './inputaggregatoronboarding.component.html',
  styleUrl: './inputaggregatoronboarding.component.css'
})
export class InputaggregatoronboardingComponent {
  constructor(public stateService: OnboardingStateService) { }
  @Input() visibleDropdowns: number[] = [];
  @Input() showSearchButton: boolean = false;
  @Input() payPeriodTypefromParent: string = "";
  @Input() showDateRange: boolean = false;
  @Input() showfinalsubmisionButton: boolean = false;

  @Output() companyUI = new EventEmitter<Company>();
  @Output() payperiodUI = new EventEmitter<Payperiodclass>();
  @Output() mapnameUI = new EventEmitter<Mapnameclass>();
  @Output() inputTypeUI = new EventEmitter<InputTypeclass>();
  @Output() searchClicked = new EventEmitter<any>();
  @Output() sitenameUI = new EventEmitter<Groupnameclass>();
  @Output() citynameUI = new EventEmitter<Cityclass>();
  @Output() payPeriodType = new EventEmitter<string>();
  @Output() dateRangeChanged = new EventEmitter<{ fromDate: string; toDate: string }>();
  @Output() Finalsubmitted = new EventEmitter<void>();


  selectedCC?: number;
  selectedCN?: string;
  selectedPP?: string;
  selectedMN?: string;
  selectedIT?: string;
  selectedGN?: string;
  selectedCT?: string;
  payPeriodTypetoChild?: string;

  //companyUI: any;
  //payperiodUI: any;

  selectedTemplate: string = '';
  selectedImport: string = '';
  companyCode: any;
  payPeriod: any;
  mapName: any;
  sitename: any;
  fromDate!: string;
  toDate!: string;

  ngOnInit(): void {
    this.payPeriodTypetoChild = this.payPeriodTypefromParent;
  }

  handleCompanyEvent(company: any) {
    this.selectedCC = company.companyId;
    this.selectedCN = company.companyCode;
    this.stateService.setCompany(company);
    this.companyUI.emit(company);
  }
  handlePayperiodEvent(payperiod: Payperiodclass) {
    this.selectedPP = payperiod.payPeriod;
    this.stateService.setPayperiod(payperiod);
    this.payperiodUI.emit(payperiod);
  }

  handleMapNameEvent(mapname: any) {
    this.selectedMN = mapname.mapName;
    this.mapnameUI.emit(mapname);
    //console.log(mapname);
  }
  handleInputTypeEvent(InputType: any) {
    this.selectedIT = InputType.inputType;
    this.inputTypeUI.emit(InputType);
    //console.log(InputType);
  }

  handleGroupNameEvent(sitename: any) {
    this.selectedGN = sitename.siteCode;
    this.sitenameUI.emit(sitename);
    //console.log(mapname);
  }

  handleCityEvent(cityname: any) {
    this.selectedCT = cityname.city_Name;
    this.citynameUI.emit(cityname);
    //console.log(mapname);
  }
  searchClick() {
    this.searchClicked.emit({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  onDateChange() {
    this.dateRangeChanged.emit({
      fromDate: this.fromDate,
      toDate: this.toDate
    });
  }

  FinalsubmissionClick() {
    this.Finalsubmitted.emit();
  }
}