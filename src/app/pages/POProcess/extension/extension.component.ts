import { Component, forwardRef, Inject, InjectionToken, OnInit } from '@angular/core';
import { CompanyComponent } from '../../../common/company/company.component';
import { MatCard } from "@angular/material/card";
import { MatCardModule } from '@angular/material/card';
import { MatFormField, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { FormBuilder, FormControl, FormGroup, NG_VALUE_ACCESSOR, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { IPORespository } from '../../../Repository/IPORepository';
import { PoRespository } from '../../../Service/PoRespository';
import { CommonModule, DatePipe, formatDate } from '@angular/common';
import { ICommonService } from '../../../Repository/ICommonService';
import { CommonService } from '../../../Service/CommonService';
import { distinctUntilChanged, filter } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';

export  const PO_TOKEN=new InjectionToken<IPORespository>('PO_TOKEN');
export  const Common_TOKEN=new InjectionToken<ICommonService>('Common_TOKEN');

@Component({
  selector: 'app-extension',
  standalone: true,
  imports: [CommonModule,CompanyComponent, MatCard, MatCardModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule],
  templateUrl: './extension.component.html',
  styleUrl: './extension.component.css',
  providers:[{provide: PO_TOKEN,
              useClass: PoRespository,
            },
            {
        provide: Common_TOKEN,
              useClass: CommonService,
            }]
})
export class ExtensionComponent implements OnInit {
  Category:any;
  InvoiceType:any;
  BillingType:any;
  Priceing:any;
  currency:any;
  POAddForm!:FormGroup;
  State:any;
  City:any
  ShippingCity:any;
    isdisable=true;
     today = new Date();
   // date=this.datePipe.transform(this.today, 'dd-MM-yyyy');
    date: string = formatDate(new Date(), 'dd-MM-yyyy', 'en-US');
  constructor(@Inject(PO_TOKEN) private poService: IPORespository,private dialogRef: MatDialogRef<ExtensionComponent>,
  @Inject(Common_TOKEN) private commonService: ICommonService,private fb: FormBuilder){
   

  }
BindState(){
  this.commonService.GetAllState().subscribe({
    next:res=>{this.State=res.Data}
  })
}
BindBillingCity(StateId){
  this.commonService.GetCityByStateId(StateId).subscribe({
    next:res=>{this.City=res.Data}
  })
}
BindShippingCity(StateId){
  this.commonService.GetCityByStateId(StateId).subscribe({
    next:res=>{this.ShippingCity=res.Data}
  })
}
onBillingCityChange(event) {
 this.POAddForm.get('BillingAddress.State')?.valueChanges.subscribe(cityId => {
  console.log("StateId " + cityId)
  //const selectedCity = this.City.find(c => c.city_Id == cityId);
  this.BindBillingCity(cityId);
 })

  // if you want to get the full object
  
}
onShippingCityChange(event: Event) {
  const selectedCityId = (event.target as HTMLSelectElement).value;

  console.log("Selected CityId:", selectedCityId);
this.BindShippingCity(selectedCityId);
  // if you want to get the full object
  
}
  ValidatedSubmit(){
     if (this.POAddForm.invalid) {
    this.POAddForm.markAllAsTouched(); // highlight all errors
    return;
  }
  }
  onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (file) {
    this.POAddForm.patchValue({ Document: file });
    this.POAddForm.get('Document')?.updateValueAndValidity();
  }
}

  ngOnInit(): void {
    this.BindCategory();
    this.BindInvoiceType();
    this.BindBillingType('Currency');
    this.BindBillingType('BILLING TYPE');
    this.BindState();
    this.POAddForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      POCategory: ['', Validators.required],
      PONo: ['', Validators.required],
      PODate: [this.date, Validators.required],
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      POQuantity: ['', [Validators.required, Validators.min(1)]],
      BillingType: ['', Validators.required],
      POQuantityValue: [''],
      PricingType: ['', Validators.required],
      CurrencyType: [''],
      POValue: ['', [Validators.required, Validators.min(1)]],
      Internal_External: [''],
      Document: [null, Validators.required],

      BillingAddress: this.fb.group({
        Address: [''],
        State: [''],
        City: [''],
        PinCode: ['', Validators.pattern('^[0-9]{6}$')],
        Phone: ['', Validators.pattern('^[0-9]{10}$')],
        EmailID: ['', Validators.email],
        GSTNO: ['', Validators.pattern('^[0-9A-Z]{15}$')]
      }),

      ShippingAddress: this.fb.group({
        Address: [''],
        State: [''],
        City: [''],
        PinCode: ['', Validators.pattern('^[0-9]{6}$')],
        Phone: ['', Validators.pattern('^[0-9]{10}$')],
        EmailID: ['', Validators.email],
        GSTNO: ['', Validators.pattern('^[0-9A-Z]{15}$')]
      })
    });
  
    // this.POAddForm.get('BillingAddress.State')?.valueChanges
    // .pipe(
    //   filter(v => !!v),
    //   distinctUntilChanged()
    // )
    // .subscribe((stateId: string) => {
    //   console.log("State " + stateId);
    //   this.BindBillingCity(stateId);
    //   this.POAddForm.get('BillingAddress.City')?.reset('');
    // });
    this.POAddForm.get('PODate')?.disable();
  }

  BindCategory() {
    this.poService.GetPOCategory().subscribe({
      next: res => { console.log(this.Category);this.Category = res.Data },
      error: err => { console.log(err) }
    })
  }
   BindBillingType(BillingType:string) {
    if(BillingType=='Currency')
    {
 this.poService.GetInvoiceDescription(BillingType).subscribe({
      next: res => { console.log(res.Data);this.currency = res.Data; },
      error: err => { console.log(err) }
    })
    }
    else{
    this.poService.GetInvoiceDescription(BillingType).subscribe({
      next: res => { console.log(res.Data);this.BillingType = res.Data;this.Priceing=res.Data },
      error: err => { console.log(err) }
    })
  }
  }
  BindInvoiceType() {
    this.poService.GetInvoiceType().subscribe({
      next: res => { console.log(res.Data);this.InvoiceType = res.Data },
      error: err => { console.log(err) }
    })
  }
  onClose(){
    this.dialogRef.close();
  }
handleCompanyEvent(event)
{

}

}
