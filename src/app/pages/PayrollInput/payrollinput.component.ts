import { Component, EventEmitter, Inject, InjectionToken, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionStorageService } from '../../Shared/SessionStorageService';
import { RouterModule,RouterLink, RouterOutlet, RouterLinkActive, Router } from '@angular/router';
import { CompanyComponent } from '../../common/company/company.component';
import { PayPeriodComponent } from '../../common/payperiod/payperiod.component';
import { GroupnameComponent } from '../../common/groupname/groupname.component';
import { MapnameComponent } from '../../common/Mapname/mapname/mapname.component';
import { InputTypeComponent } from '../../common/input-type/input-type.component';
import { CityComponent } from '../../common/city/city.component';
import { Cityclass, Company, Groupnameclass, InputTypeclass, Mapnameclass, Payperiodclass } from '../../Models/Common';
import { OnboardingStateService } from '../../onboarding-state.service';

@Component({
  selector: 'payrollinput',
  standalone: true,
  imports: [CommonModule, RouterModule, CompanyComponent, PayPeriodComponent, GroupnameComponent, MapnameComponent, InputTypeComponent, CityComponent  ],
  templateUrl: './payrollinput.component.html',
  styleUrl: './payrollinput.component.css'
})
export class PayrollinputComponent implements OnInit {
  constructor(public stateService: OnboardingStateService) { }
  @Input() visibleDropdowns: number[] = [];
  @Input() showSearchButton: boolean = false;
  @Input() payPeriodTypefromParent: string = "";

  @Output() companyUI = new EventEmitter<Company>();
  @Output() payperiodUI = new EventEmitter<Payperiodclass>();
  @Output() mapnameUI = new EventEmitter<Mapnameclass>();
  @Output() inputTypeUI = new EventEmitter<InputTypeclass>();
  @Output() searchClicked = new EventEmitter<void>();
  @Output() sitenameUI = new EventEmitter<Groupnameclass>();
  @Output() citynameUI = new EventEmitter<Cityclass>();
  @Output() payPeriodType = new EventEmitter<string>();

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
    this.searchClicked.emit();
  }
}