
import { Component, EventEmitter, Inject, InjectionToken, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { PricingType } from '../../Models/Common';
import { map, Observable, startWith } from 'rxjs';
import { CommonService } from '../../Service/CommonService';
import { ICommonService } from '../../Repository/ICommonService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { IPORespository } from '../../Repository/IPORepository';
import { PoRespository } from '../../Service/PoRespository';
export const COMM_TOKEN = new InjectionToken<ICommonService>('COMM_TOKEN');

export const PO_TOKEN = new InjectionToken<IPORespository>('PO_TOKEN');

@Component({
  selector: 'potype',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    MatFormFieldModule],
  templateUrl: './potype.component.html',
  styleUrl: './potype.component.css',
  providers: [{

    provide: COMM_TOKEN,
    useClass: CommonService,

  },
  {
    provide: PO_TOKEN,
    useClass: PoRespository,
  },]
})
export class PotypeComponent implements OnInit {
  searchText: string = '';
  myControl = new FormControl<string | PricingType>('');
  //ponumber: PricingType[] = [{ "company_Id": 1, "companyName": "REGULAR", "companyCode": "", "displayName": "Regular", "invoice_Billing_Type": 0 }, { "company_Id": 4, "companyName": "THIRDPARTY", "companyCode": "THIRDPARTY", "displayName": "ThirdParty", "invoice_Billing_Type": 0 }];
  ponumber: PricingType[] = [];
  //$!: Observable<Company[]>; 
  selectedOption?: PricingType;
  userdetail!: any;
  @Output() potypeEmit = new EventEmitter<any>();

  constructor(
    @Inject(PO_TOKEN) private poService: IPORespository,
  ) { }


  ngOnInit(): void {
    this.BindInvoiceType();
  }

  BindInvoiceType() {
    this.poService.GetInvoiceType().subscribe({
      next: res => {
        this.ponumber = res.Data
        this.myControl.setValue(this.myControl.value || '');
      },
    });
  }

  displayFn = (option: any): string => option?.invoiceType ?? option.invoiceType;

  private _filter(value: string): PricingType[] {
    const filterValue = value.toLowerCase();
    return this.ponumber.filter(option =>
      option.invoiceType.toLowerCase().includes(filterValue)
    );
  }

  filteredOptions$ = this.myControl.valueChanges.pipe(
    startWith(''),
    map(value => {
      let searchText = '';

      if (typeof value === 'string') {
        searchText = value;
      } else if (value && typeof value === 'object' && 'invoiceType' in value) {
        searchText = value?.invoiceType;
      }

      return this._filter(searchText);
    })
  );

  onOptionSelected(option: any) {
    this.selectedOption = option;
    this.potypeEmit.emit(this.selectedOption);
  }
}
