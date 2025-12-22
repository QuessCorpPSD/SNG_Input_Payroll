import { Component, forwardRef, Inject, InjectionToken, input, OnInit } from '@angular/core';
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
import { debounceTime, distinctUntilChanged, filter } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { combineLatest } from 'rxjs';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
// import {  distinctUntilChanged, filter } from 'rxjs/operators';
// import { formatDate as angularFormatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { json } from 'stream/consumers';



export const PO_TOKEN = new InjectionToken<IPORespository>('PO_TOKEN');
export const Common_TOKEN = new InjectionToken<ICommonService>('Common_TOKEN');

@Component({
  selector: 'app-add-po',
  standalone: true,
  imports: [
    CommonModule,
    CompanyComponent,
    MatCard,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    AlertpopupComponent
  ],
  templateUrl: './add-po.component.html',
  styleUrls: ['./add-po.component.css'],
  providers: [
    {
      provide: PO_TOKEN,
      useClass: PoRespository,
    },
    {
      provide: Common_TOKEN,
      useClass: CommonService,
    }
  ]
})
export class AddPOComponent implements OnInit {
  selectedPOQuantityCode: string = '';

  Category: any;
  InvoiceType: any;
  BillingType: any;
  POQuantitytype: any;
  Priceing: any;
  currency: any;
  POAddForm!: FormGroup;
  State: any;
  City: any;
  ShippingCity: any;
  isdisable = true;
  today = new Date();
  date: string = formatDate(this.today, 'yyyy-MM-dd', 'en-US');
  companyId: any;
  selectedCompanyCode: any;
  userdetail: any;
  isLoading = false;
  File_Name: any;
  File_Path: string = '';
  popupMessage: string = '';
  popupSubMessage: string = '';
  showPopup = false;
  PONo: any;
  UploadedResponse: any;
  // PONumber: any;
  selectedFile: File | null = null;
  poId: any;
  form: any;
  POform: string = '';
  // poid: any;


  constructor(
    @Inject(PO_TOKEN) private poService: IPORespository,
    private dialogRef: MatDialogRef<AddPOComponent>,
    @Inject(Common_TOKEN) private commonService: ICommonService,
    private fb: FormBuilder,
    private _sessionStoreage: SessionStorageService, private decry: EncryptionService

  ) { }

  BindState() {
    this.commonService.GetAllState().subscribe({
      next: res => { this.State = res.Data }
    });
  }

  BindBillingCity(StateId: any) {
    this.commonService.GetCityByStateId(StateId).subscribe({
      next: res => { this.City = res.Data }
    });
  }

  BindShippingCity(StateId: any) {
    this.commonService.GetCityByStateId(StateId).subscribe({
      next: res => { this.ShippingCity = res.Data }
    });
  }

  onBillingCityChange(event: any) {
    this.POAddForm.get('BillingAddress.State')?.valueChanges.subscribe(cityId => {
      this.BindBillingCity(cityId);
    });
  }

  onShippingCityChange(event: Event) {
    const selectedCityId = (event.target as HTMLSelectElement).value;
    this.BindShippingCity(selectedCityId);
  }
  resetForm() {
    this.POAddForm.reset();
  }


  ValidatedSubmit(): Promise<void> {
    this.isLoading = true;
    return new Promise((resolve, reject) => {
      if (this.POAddForm.invalid) {

        const controls = this.POAddForm.controls;
        for (const name in controls) {
          if (controls[name].invalid) {

          }
        }
        reject('Form validation failed');
        this.isLoading = false;
        return;
      }

      const formValue = this.POAddForm.getRawValue();

      const payload = {
        company_ID: this.companyId || 0,
        po_ID: this.poId || 0,
        poDate: formValue.PODate || this.date || '',
        startDate: formValue.StartDate || '',
        expDate: formValue.EndDate || '',
        poNumber: formValue.POform || '',
        pricingType: parseInt(formValue.PricingType) || 0,
        poValue: formValue.POValue.toString() || '',
        currencyType: parseInt(formValue.CurrencyType) || 0,
        poQuantutyType: parseInt(formValue.POQuantitytype) || 0,
        poQuantuty: formValue.POQuantity || '',
        inteExternal: parseInt(formValue.Internal_External) || 0,
        docPath: formValue.docPath || '',
        extention: formValue.extention || 0,
        extendedStartDate: formValue.extendedStartDate || '',
        extendedEndDate: formValue.extendedEndDate || '',
        createdBy: this.userdetail.user_Id.toString() || '',
        billingType: parseInt(formValue.BillingType).toString() || '',
        action: formValue.action || 1,
        po_CategoryID: parseInt(formValue.POCategory) || 0
      };

      this.poService.AddPOSave(payload).subscribe({
        next: poSaveResponse => {
          if (poSaveResponse.Data?.response.includes("SuccessFully Updated")) {

            if (this.selectedFile) {
              const formData = new FormData();
              formData.append('file', this.selectedFile);
              formData.append('File_Name', this.selectedFile.name);
              formData.append('File_Path', "File Path");
              formData.append('PONumber', payload.poNumber);
              formData.append('CreatedBy', this.userdetail.user_Id.toString());

              this.poService.ImportFileUpload(formData).subscribe({
                next: fileUploadResponse => {

                  if (fileUploadResponse?.Data?.response.includes("Record(s) Inserted Successfully!")) {
                    this.showPopup = true;

                    this.popupMessage = fileUploadResponse?.Data?.response;
                    this.isLoading = false;
                    return;
                  }
                  else {
                    alert(fileUploadResponse?.Data?.response)
                    this.isLoading = false;
                    return;
                  }
                  resolve();
                },
                error: uploadErr => {
                  console.error('File upload error:', uploadErr);
                  reject(uploadErr);
                }
              });
            } else {
              resolve();
            }
          }
          else {
            alert(poSaveResponse?.Data?.response);
            this.isLoading = false;
            return;
          }

        },
        error: saveErr => {
          console.error('PO save error:', saveErr);
          reject(saveErr);
        }
      });
    });
  }

  handleImportErrors(rawErr: any) {
    let errorArray: any[] = [];

    try {
      if (typeof rawErr === 'string') {
        const parsed = JSON.parse(rawErr);
        errorArray = Array.isArray(parsed) ? parsed : [parsed];
      } else if (Array.isArray(rawErr)) {
        errorArray = rawErr;
      } else if (rawErr) {
        errorArray = [rawErr];
      }
    } catch {
      errorArray = rawErr ? [{ MESSAGE: String(rawErr) }] : [];
    }

    const exportData = errorArray.map((item: any) => ({
      MESSAGE: item?.MESSAGE || item?.Message || item?.message || 'Unknown error'
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(exportData);
    const workbook: XLSX.WorkBook = {
      Sheets: { ErrorMessages: worksheet },
      SheetNames: ['ErrorMessages']
    };
    XLSX.writeFile(workbook, 'Import_Errors.xlsx');
  }

  tryParseResponse(r: any): { parsed: any; msg: string } {
    if (r == null) return { parsed: null, msg: '' };
    if (Array.isArray(r)) return { parsed: r, msg: '' };
    if (typeof r === 'object') {
      const msg = r.Message || r.message || r.error || r.errorMessage || '';
      return { parsed: r, msg };
    }
    if (typeof r === 'string') {
      try {
        const p = JSON.parse(r);
        const msg = p.Message || p.message || p.error || p.errorMessage || '';
        return { parsed: p, msg };
      } catch {
        return { parsed: null, msg: r };
      }
    }
    return { parsed: null, msg: String(r) };
  }


  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.POAddForm.get('Document')?.setValue(file); //  For form validation
    }
  }


  ngOnInit(): void {
    this.BindCategory();
    this.BindInvoiceType();
    this.BindBillingType('Currency');
    this.BindBillingType('BILLING TYPE');
    this.BindPOQuantitytype('BILLING TYPE');
    this.BindState();
    // this.BindPONumber();

    this.POAddForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      POCategory: ['', Validators.required],
      POform: ['', Validators.required],
      POQuantitytype: ['', Validators.required],
      PODate: new FormControl({ value: this.date, disabled: true }, Validators.required),
      StartDate: ['', Validators.required],
      EndDate: ['', Validators.required],
      POQuantity: ['', [Validators.required, Validators.min(1)]],
      BillingType: ['', Validators.required],
      POQuantityValue: ['', Validators.required],
      PricingType: ['1', Validators.required],
      CurrencyType: ['30.0', Validators.required],
      POValue: ['', [Validators.required, Validators.min(1)]],
      Internal_External: ['0', Validators.required],
      Document: [null, Validators.required],

    });
    this.POAddForm.patchValue({
      POQuantity: '10',
      POQuantityValue: '1000',
    });

    combineLatest([
      this.POAddForm.get('StartDate')!.valueChanges.pipe(distinctUntilChanged()),
      this.POAddForm.get('EndDate')!.valueChanges.pipe(distinctUntilChanged()),
      this.POAddForm.get('POQuantitytype')!.valueChanges.pipe(distinctUntilChanged()),
      this.POAddForm.get('CompanyCode')!.valueChanges.pipe(distinctUntilChanged())
    ]).pipe(
      debounceTime(300),
      filter(([startDate, endDate, quantityRowId, companyId]) =>
        !!startDate && !!endDate && !!quantityRowId && !!companyId
      )
    ).subscribe(([startDate, endDate, quantityRowId, companyId]) => {
      const val = {
        startDate: this.formatDateString(startDate),
        endDate: this.formatDateString(endDate),
        quantitytype: parseInt(quantityRowId, 10),  // convert "36.0" to 36 integer
        companyId: this.companyId
      };

      this.poService.GetPOQuantyValues(val).subscribe({
        next: res => {
          if (res && res.Data) {
            this.selectedPOQuantityCode = res.Data.poquantity || '';
          } else {
            this.selectedPOQuantityCode = '';
          }
        },
        error: err => {
          console.error('Error fetching PO quantity values:', err);
          this.selectedPOQuantityCode = '';
        }
      });
    });
    // this.companyId = 0;

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.user_Id,
      "userName": this.userdetail.userName
    }

  }

  formatDateString(date: any): string {
    return formatDate(date, 'yyyy-MM-dd', 'en-US');
  }

  BindCategory() {
    this.poService.GetPOCategory().subscribe({
      next: res => {
        this.Category = res.Data;
      },
      error: err => {
      }
    });
  }

  BindPOQuantitytype(POQuantitytype: string) {
    if (POQuantitytype == 'Currency') {
      this.poService.GetInvoiceDescription(POQuantitytype).subscribe({
        next: res => { this.currency = res.Data; },

      });
    } else {
      this.poService.GetInvoiceDescription(POQuantitytype).subscribe({
        next: res => { this.POQuantitytype = res.Data; this.Priceing = res.Data },
      });
    }
  }

  onPOQuantityTypeChange(event: Event) {
    const selectedRowId = (event.target as HTMLSelectElement).value;

    const selected = this.POQuantitytype.find(item => item.rowid == selectedRowId);

    this.selectedPOQuantityCode = selected ? selected.code : '';
  }

  BindBillingType(BillingType: string) {
    if (BillingType == 'Currency') {
      this.poService.GetInvoiceDescription(BillingType).subscribe({
        next: res => { this.currency = res.Data; },
      });
    } else {
      this.poService.GetInvoiceDescription(BillingType).subscribe({
        next: res => { this.BillingType = res.Data; this.Priceing = res.Data },
      });
    }
  }

  BindInvoiceType() {
    this.poService.GetInvoiceType().subscribe({
      next: res => { this.InvoiceType = res.Data },
    });
  }

  onClose() {
    this.dialogRef.close();
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.POAddForm.get('CompanyCode')?.setValue(this.companyId);
    // this.BindPONumber();
  }


}
