import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { CompanyComponent } from '../../../common/company/company.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { POItemtypeComponent } from "../../../common/poitemtype/poitemtype.component";
import { PonumbersearchComponent } from "../../../common/ponumbersearch/ponumbersearch.component";
import { EPoRespository } from '../../../Service/EPORepository';
import { APIResponse } from '../../../Models/apiresponse';
import { debounceTime, distinctUntilChanged, filter } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { EncryptionService } from '../../../Shared/encryption.service';
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";


@Component({
  selector: 'app-add-epo',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCard, MatCardModule, ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    PonumbersearchComponent, AlertpopupComponent, POItemtypeComponent],
  templateUrl: './add-epo.component.html',
  styleUrls: ['./add-epo.component.css'],

})

export class AddEpoComponent implements OnInit {
  @ViewChild('poItemType') poItemType!: POItemtypeComponent;
  POAddForm!: FormGroup;
  poNumber: any;
  postartdate: any;
  selectedItemType: any;
  showExtensionInput = false;
  extensionEndDate: string = '';
  statusId: any;
  StatusID: any;
  selectedOption: any;
  selectedPoId: any;
  selectedEmpId: any;
  comapnyId: number = 0;
  POQuantitytype: any[] = [];
  currency: any[] = [];
  Priceing: any;
  selectedPOQuantityCode: string = '';
  showRevisedInput: boolean = false;
  isExtensionClicked: boolean = false;
  isRevisedClicked: boolean = false;
  POrate: any;
  calculatedDuration: number = 0;
  originalDuration: number = 0;
  originalEndDate: string = '';
  originalQuantity: string = '';
  originalStartDate: string = '';
  originalQuantityType: string = '';
  selectedFile: File | null = null;
  isLoading: boolean = false;
  userdetail: any;
  showPopup: any;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddEpoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private poService: EPoRespository, private _sessionStorage: SessionStorageService, private decry: EncryptionService) { }

  companyId: number = 0;
  siteId = '';
  selectedCompanyCode: any;
  selectedSiteName: any;
  isdisable = true;

  onClose() {
    this.dialogRef.close();
  }

  handleCompanyEvent(event: any) {
    this.companyId = event.companyId;
    this.selectedCompanyCode = event.companyCode;
    this.comapnyId = this.companyId;
  }

  groupnameEvent(event: any) {
    this.siteId = event.siteCode;
    this.selectedSiteName = event.siteName;
  }

  ItemTypeEvent(item: any): void {
    this.selectedItemType = item;
  }

  ngOnInit(): void {

    const json = this._sessionStorage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));

    } else {
      console.warn('UserProfile not found in session storage');
    }

    const userInfo = {
      "userId": this.userdetail.userId,
      "userName": this.userdetail.userName
    }

    this.POAddForm = this.fb.group({

      CompanyCode: ['', Validators.required],
      PO_ID: [''],
      PONo: ['', Validators.required],
      POStartDate: [{ value: '', disabled: true }, Validators.required],
      POEndDate: [{ value: '', disabled: true }, Validators.required],
      POtotalvalue: ['', Validators.required],
      StartDate: [{ value: '', disabled: false }, Validators.required],
      EndDate: [{ value: '', disabled: false }, Validators.required],
      Duration: ['', Validators.required],
      ItemType: [''],
      EmployeeID: ['', Validators.required],
      EmployeeName: ['', Validators.required],
      ClientEmpNo: ['', Validators.required],
      OfferPOValue: [''],
      Quantitytype: ['', Validators.required],
      Quantity: ['', Validators.required],
      CTC: [''],
      ServiceCharge: [''],
      PORate: ['', Validators.required],
      BalanceAmount: [''],
      MonthlyRate: [''],
      ResourceValue: [''],
      ExtensionEndDate: [''],
    });

    this.BindPOQuantitytype('Billing Type');

    this.statusId = this.data?.row?.StatusID;
    this.companyId = this.data?.row?.COMPANY_ID;


    if (this.data?.row) {

      const row = this.data.row;
      this.bindDataForStatus3(row);
      if (this.statusId != 0 && this.statusId != 2) {
        this.POAddForm.get('StartDate')?.disable();
        this.POAddForm.get('EndDate')?.disable();
      } else {
      }
    }

    // Disable fields based on certain conditions
    this.POAddForm.get('CompanyCode')?.disable();
    this.POAddForm.get('POStartDate')?.disable();
    this.POAddForm.get('POEndDate')?.disable();
    this.POAddForm.get('POtotalvalue')?.disable();

    if (this.data?.row?.StatusID != 0) {
      this.POAddForm.get('PONo')?.disable();
    }

    this.POAddForm.get('Duration')?.disable();
    this.POAddForm.get('EmployeeID')?.disable();
    this.POAddForm.get('EmployeeName')?.disable();
    this.POAddForm.get('ClientEmpNo')?.disable();
    this.POAddForm.get('OfferPOValue')?.disable();
    this.POAddForm.get('CTC')?.disable();
    this.POAddForm.get('BalanceAmount')?.disable();
    this.POAddForm.get('MonthlyRate')?.disable();
    this.POAddForm.get('ExtensionEndDate')?.disable();
    this.POAddForm.get('ResourceValue')?.disable();

    // For statusId 3, disable EndDate initially (it gets enabled when Revised is clicked)
    if (this.data?.row?.StatusID === 3) {
      this.POAddForm.get('EndDate')?.disable();
    }

    // For statusId 3, keep Quantity disabled initially
    if (this.data?.row?.StatusID === 3) {
      this.POAddForm.get('Quantity')?.disable();
    }

    // Setup quantity calculation for both statuses
    this.setupQuantityCalculation();
    //this.setupDurationCalculation();

  }


  private setupQuantityCalculation(): void {
    // For statusId 0 - calculate quantity when any field changes
    if (this.statusId === 0) {
      combineLatest([
        this.POAddForm.get('StartDate')!.valueChanges.pipe(distinctUntilChanged()),
        this.POAddForm.get('EndDate')!.valueChanges.pipe(distinctUntilChanged()),
        this.POAddForm.get('Quantitytype')!.valueChanges.pipe(distinctUntilChanged())
      ]).pipe(
        debounceTime(300),
        filter(([startDate, endDate, quantityType]) =>
          !!startDate && !!endDate && !!quantityType && this.statusId === 0)
      ).subscribe(([startDate, endDate, quantityType]) => {

        this.calculateQuantity(startDate, endDate, quantityType);
      });
    }

    // For statusId 3 - setup individual field listeners for quantity calculation
    if (this.statusId === 3) {
      // Listen to EndDate changes specifically for statusId 3 in Revised mode
      this.POAddForm.get('EndDate')!.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(endDate => !!endDate && this.statusId === 3 && this.isRevisedClicked)
      ).subscribe(endDate => {
        const startDate = this.POAddForm.get('StartDate')?.value;
        const quantityType = this.POAddForm.get('Quantitytype')?.value;

        if (startDate && quantityType) {
          this.calculateQuantity(startDate, endDate, quantityType);
        }
      });

      // Also listen to Quantitytype changes for statusId 3 in Revised mode
      this.POAddForm.get('Quantitytype')!.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(quantityType => !!quantityType && this.statusId === 3 && this.isRevisedClicked)
      ).subscribe(quantityType => {
        const startDate = this.POAddForm.get('StartDate')?.value;
        const endDate = this.POAddForm.get('EndDate')?.value;

        if (startDate && endDate) {
          this.calculateQuantity(startDate, endDate, quantityType);
        }
      });

      // Also listen to StartDate changes for statusId 3 in Revised mode
      this.POAddForm.get('StartDate')!.valueChanges.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter(startDate => !!startDate && this.statusId === 3 && this.isRevisedClicked)
      ).subscribe(startDate => {
        const endDate = this.POAddForm.get('EndDate')?.value;
        const quantityType = this.POAddForm.get('Quantitytype')?.value;

        if (endDate && quantityType) {
          this.calculateQuantity(startDate, endDate, quantityType);
        }
      });
    }
  }



  private calculateQuantity(startDate: string, endDate: string, quantityType: string): void {
    const val = {
      PO_ID: this.selectedPoId,
      CLIENTEMPID: this.selectedEmpId,
      PRICINGTYPE: "0",
      Startdate: this.formatDateString(startDate),
      ENDDATE: this.formatDateString(endDate),
      QUANTITYTYPE: +quantityType
    };


    this.poService.GetPoEmpCalculation(val).subscribe({
      next: res => {
        const newQuantity = res?.Data?.poquantity || '';

        // Update the Quantity field
        this.POAddForm.get('POQUANTITY')?.setValue(newQuantity);
      },
      error: err => {
        console.error('Error fetching PO quantity values:', err);
        // Don't clear the field on error, keep current value
      }
    });
  }

  private setupDurationCalculation(): void {
    // For statusId 0 - always calculate duration
    if (this.statusId === 0) {
      this.POAddForm.get('StartDate')?.valueChanges.subscribe(() => {
        this.validateAndCalculateDurationForStatus0();
      });

      this.POAddForm.get('EndDate')?.valueChanges.subscribe(() => {
        this.validateAndCalculateDurationForStatus0();
      });
    }

    // For statusId 3 - calculate duration when end date changes (only in Revised mode)
    if (this.statusId === 3) {
      this.POAddForm.get('EndDate')?.valueChanges.subscribe((newEndDate) => {
        if (this.isRevisedClicked) {
          this.validateAndCalculateDurationForStatus3(newEndDate);
        }
      });
    }
  }


  private validateAndCalculateDurationForStatus0(): void {
    const startDate = this.POAddForm.get('StartDate')?.value;
    const endDate = this.POAddForm.get('EndDate')?.value;
    const poStartDate = this.POAddForm.get('POStartDate')?.value;
    const poEndDate = this.POAddForm.get('POEndDate')?.value;

    if (startDate && endDate) {
      if (poStartDate && poEndDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const poStart = new Date(poStartDate);
        const poEnd = new Date(poEndDate);

        if (start < poStart || start > poEnd) {
          this.showAlert('Start Date is out of range of PO start and end dates!');
          this.POAddForm.get('StartDate')?.setValue('');
          this.POAddForm.get('EndDate')?.setValue('');
          this.POAddForm.get('Duration')?.setValue('');
          return;
        }

        if (end < poStart || end > poEnd) {
          this.showAlert('End Date is out of range of PO start and end dates!');
          this.POAddForm.get('StartDate')?.setValue('');
          this.POAddForm.get('EndDate')?.setValue('');
          this.POAddForm.get('Duration')?.setValue('');
          return;
        }
      }

      this.calculateDuration(startDate, endDate);
    }
  }

  private validateAndCalculateDurationForStatus3(newEndDate: string): void {
    const startDate = this.POAddForm.get('StartDate')?.value;
    const endDate = newEndDate;
    const poStartDate = this.POAddForm.get('POStartDate')?.value;
    const poEndDate = this.POAddForm.get('POEndDate')?.value;

    if (startDate && endDate) {
      // Validate date range
      if (poStartDate && poEndDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const poStart = new Date(poStartDate);
        const poEnd = new Date(poEndDate);

        if (end < poStart || end > poEnd) {
          this.showAlert('End Date is out of range of PO start and end dates!');
          // Reset to original end date
          this.POAddForm.get('EndDate')?.setValue(this.originalEndDate);
          this.POAddForm.get('Duration')?.setValue(this.originalDuration);
          return;
        }
      }

      // Calculate duration only if end date is different from original
      if (endDate !== this.originalEndDate) {
        this.calculateDuration(startDate, endDate);
      } else {
        // If end date is same as original, keep original duration
        this.POAddForm.get('Duration')?.setValue(this.originalDuration);
      }
    }
  }

  private bindDataForStatus3(row: any): void {

    const formValues: any = {};

    if (row['COMPANY CODE']) {
      formValues.CompanyCode = row['COMPANY CODE'];
      this.selectedCompanyCode = row['COMPANY CODE'];
    }

    if (row['PO_ID']) {
      this.selectedPoId = row['PO_ID'];
    }

    if (row?.PoNumber) {
      formValues.PONo = row.PoNumber;
      this.poNumber = row.PoNumber;
    }

    if (row['PO START DATE']) {
      formValues.POStartDate = this.formatDateForInput(row['PO START DATE']);
    }

    if (row['PO END DATE']) {
      formValues.POEndDate = this.formatDateForInput(row['PO END DATE']);
    }

    if (row['FixedRate']) {
      formValues.POtotalvalue = row['FixedRate'];
    }

    if (row['EMPLOYEE ID']) {
      formValues.EmployeeID = row['EMPLOYEE ID'];
      this.selectedEmpId = row['EMPLOYEE ID'];
    }

    if (row['EMPLOYEE NAME']) {
      formValues.EmployeeName = row['EMPLOYEE NAME'];
    }

    if (row['MonthlyRate']) {
      formValues.MonthlyRate = row['MonthlyRate'];
    }

    if (row['Quantity']) {
      formValues.Quantity = row['Quantity'];
      this.originalQuantity = row['Quantity']; // Store original quantity
    }

    if (row['CTC']) {
      formValues.CTC = row['CTC'];
    }

    if (row['OfferPOValue']) {
      formValues.OfferPOValue = row['OfferPOValue'];
    }

    if (row['Totalresourcevalue']) {
      formValues.ResourceValue = row['Totalresourcevalue'];
    }

    if (row['PO_BALANCE']) {
      formValues.BalanceAmount = row['PO_BALANCE'];
    }

    if (row['ItemType']) {
      formValues.ItemType = row['ItemType'];
    }

    if (row['ClientEmpNo']) {
      formValues.ClientEmpNo = row['ClientEmpNo'];
    }

    if (row['UnitPrice']) {
      formValues.PORate = row['UnitPrice'];
    }

    if (row['Duration']) {
      formValues.Duration = row['Duration'];
      this.originalDuration = row['Duration']; // Store original duration
    }

    if (row['ServiceCharge']) {
      formValues.ServiceCharge = row['ServiceCharge'];
    }

    if (row['companyId']) {
      this.companyId = row['companyId'];
    } else if (row['COMPANY_ID']) {
      this.companyId = row['COMPANY_ID'];
    }

    if (row['EMP_PO_START_DATE']) {
      const startDate = row['EMP_PO_START_DATE'];
      formValues.StartDate = this.formatDateForInput(startDate);
      this.originalStartDate = this.formatDateForInput(startDate) || ''; // Store original start date
    }

    if (row['EMP_PO_END_DATE']) {
      const endDate = row['EMP_PO_END_DATE'];
      formValues.EndDate = this.formatDateForInput(endDate);
      this.originalEndDate = this.formatDateForInput(endDate) || ''; // Store original end date
    }

    if (row['ItemType']) {
      setTimeout(() => {
        this.poItemType.selectByDescription(row['ItemType']);
      }, 500);
    }

    if (row['Quantitytype']) {
      setTimeout(() => {
        const match = this.POQuantitytype.find(qty => qty.rowid === row['Quantitytype']);
        if (match) {
          this.POAddForm.patchValue({
            Quantitytype: match.rowid
          });
        }
      }, 500);

    }

    this.POAddForm.patchValue(formValues);

  }

  private bindDataForOtherStatuses(row: any): void {

    const formValues: any = {};

    if (row['COMPANY CODE']) {
      formValues.CompanyCode = row['COMPANY CODE'];
      this.selectedCompanyCode = row['COMPANY CODE'];
    }

    if (row?.PoNumber) {
      formValues.PONo = row.PoNumber;
      this.poNumber = row.PoNumber;
    }

    if (row['PO START DATE']) {
      formValues.POStartDate = this.formatDateForInput(row['PO START DATE']);
    }

    if (row['PO END DATE']) {
      formValues.POEndDate = this.formatDateForInput(row['PO END DATE']);
    }

    if (row['FixedRate']) {
      formValues.POtotalvalue = row['FixedRate'];
    }

    if (row['EMPLOYEE ID']) {
      formValues.EmployeeID = row['EMPLOYEE ID'];
    }

    if (row['EMPLOYEE NAME']) {
      formValues.EmployeeName = row['EMPLOYEE NAME'];
    }
    if (row['companyId']) {
      this.companyId = row['companyId'];
    } else if (row['COMPANY_ID']) {
      this.companyId = row['COMPANY_ID'];
    }

    if (row['EMP_PO_START_DATE']) {
      const startDate = row['EMP_PO_START_DATE'];
      formValues.StartDate = this.formatDateForInput(startDate);
      this.originalStartDate = this.formatDateForInput(startDate) || ''; // Store original start date
    }

    if (row['EMP_PO_END_DATE']) {
      const endDate = row['EMP_PO_END_DATE'];
      formValues.EndDate = this.formatDateForInput(endDate);
      this.originalEndDate = this.formatDateForInput(endDate) || ''; // Store original end date
    }

    this.POAddForm.patchValue(formValues);

  }

  showAlert(message: string) {
    alert(message);
  }

  formatDateString(date: any): string {
    if (!date) return '';
    const d = new Date(date);
    const month = ('0' + (d.getMonth() + 1)).slice(-2);
    const day = ('0' + d.getDate()).slice(-2);
    return `${d.getFullYear()}-${month}-${day}`;
  }

  BindPOQuantitytype(groupName: string) {
    this.poService.GetInvoiceDescription(groupName).subscribe({
      next: (res: APIResponse) => {
        if (res.StatusCode === 200 && res.Data) {
          this.POQuantitytype = res.Data;
          if (this.POQuantitytype.length > 0) {
            this.POAddForm.patchValue({
              Quantitytype: this.POQuantitytype[0].rowid
            });
          }
        } else {
          this.POQuantitytype = [];
        }
      },
      error: (err) => {
        console.error('Error loading Quantity types', err);
        this.POQuantitytype = [];
      }
    });
  }



  saveEmployeePO(): Promise<void> {
    // if (this.POAddForm.invalid) {
    //   this.showAlert('Please fill all required fields');
    //   return;
    // }
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
      let flag = 0;
      if (this.statusId === 0) {
        flag = 1; // New creation
      }
      else if (this.statusId === 2) {
        flag = 2;
      }
      else if (this.statusId === 3) {
        if (this.isRevisedClicked) {
          flag = 3; // Revised
        } else if (this.isExtensionClicked) {
          flag = 4; // Extension
        }
      }

      const formValue = this.POAddForm.getRawValue();
      const payload = {
        POID: (this.selectedPoId).toString(),
        Company_ID: this.companyId.toString(),
        Group_Detail_Id: "0", // You may need to get this from somewhere
        PoNumber: formValue.PONo.toString(),
        EmployeeListID: (this.data?.row?.EMployeeListID ?? 0).toString(),
        ResourceType: "0", // You may need to get this from somewhere
        StartDate: this.formatDateString(formValue.StartDate),
        ExpDate: this.formatDateString(formValue.EndDate),
        Duration: (formValue.Duration ?? 0).toString(),
        ItemType: (this.selectedItemType?.rowid ?? 0).toString(),
        Balanceamount: (formValue.BalanceAmount ?? 0).toString(),
        EmployeeID: formValue.EmployeeID.toString(),
        EmployeeName: formValue.EmployeeName.toString(),
        ClientEmpNo: (formValue.ClientEmpNo ?? "").toString(),
        OfferPOValue: (formValue.OfferPOValue ?? 0).toString(),
        QuantityType: (formValue.Quantitytype ?? 0).toString(),
        Quantity: (formValue.Quantity ?? 0).toString(),
        CTC: (formValue.CTC ?? 0).toString(),
        ServiceCharge: (formValue.ServiceCharge ?? 0).toString(),
        FixedRate: (formValue.POtotalvalue ?? 0).toString(),
        UnitPrice: (formValue.PORate ?? 0).toString(),
        MonthlyRate: (formValue.MonthlyRate ?? 0).toString(),
        Totalresourcevalue: (formValue.ResourceValue ?? 0).toString(),
        EmployeePOAttachment: this.selectedFile ? this.selectedFile.name : "",
        CreatedBy: this.userdetail.userId.toString(),
        Flag: flag.toString(),
        PricingType: (this.data?.row?.PricingType ?? "").toString(),
        ChkFlag: "0",
        ExtStartDate: this.isExtensionClicked ? this.formatDateString(formValue.StartDate).toString() : "",
        ExtEndDate: this.isExtensionClicked ? this.formatDateString(formValue.ExtensionEndDate).toString() : "",
        ExtDuration: this.isExtensionClicked ? this.calculateExtensionDuration().toString() : ""
      };


      // this.isLoading = false;
      // return;
      this.poService.SaveEmployeePO(payload).subscribe({
        next: poSaveResponse => {
          if (poSaveResponse.Data?.response.includes("SuccessFully Updated")) {

            if (this.selectedFile && (this.statusId === 0 || this.statusId === 2)) {
              const formData = new FormData();
              formData.append('file', this.selectedFile);
              formData.append('File_Name', this.selectedFile.name);
              formData.append('File_Path', "File Path");
              formData.append('PONumber', payload.PoNumber);
              formData.append('CreatedBy', this.userdetail.userId.toString());

              this.poService.ImportFileUpload(formData).subscribe({
                next: fileUploadResponse => {

                  if (fileUploadResponse?.Data?.response.includes("Record(s) Inserted Successfully!")) {
                    this.showPopup = true;
                    this.popupMessage = fileUploadResponse?.Data?.response;
                    this.isLoading = false;
                    return;
                  }
                  else {
                    this.showPopup = true;
                    this.popupMessage = fileUploadResponse?.Data?.response;
                    this.isLoading = false;
                    resolve();
                    return;
                  }
                },
                error: uploadErr => {
                  console.error('File upload error:', uploadErr);
                  this.isLoading = false;
                  reject(uploadErr);
                }
              });
            } else {
              this.showPopup = true;
              this.popupMessage = poSaveResponse.Data?.response;
              this.isLoading = false;
              return;
              resolve();
            }
          }
          else {
            this.showPopup = true;
            this.popupMessage = poSaveResponse?.Data?.response;
            this.isLoading = false;
            return;
          }

        },
        error: saveErr => {
          console.error('PO save error:', saveErr);
          this.isLoading = false;
          reject(saveErr);
        }
      });
    });
  }


  calculateDuration(startDate: string, endDate: string): void {
    if (!startDate || !endDate) {
      this.POAddForm.get('Duration')?.setValue('');
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    // Check if dates are valid
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      this.POAddForm.get('Duration')?.setValue('');
      return;
    }

    // Calculate difference in days
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1; // +1 to include both start and end dates

    // Update the Duration field
    this.POAddForm.get('Duration')?.setValue(daysDiff);
    this.calculatedDuration = daysDiff;

  }

  private calculateExtensionDuration(): string {
    if (!this.isExtensionClicked) return "";

    const startDate = this.POAddForm.get('StartDate')?.value;
    const extensionEndDate = this.POAddForm.get('ExtensionEndDate')?.value;

    if (!startDate || !extensionEndDate) return "";

    const start = new Date(startDate);
    const end = new Date(extensionEndDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;

    return daysDiff.toString();
  }

  toggleExtensionInput() {
    this.showExtensionInput = true;
    this.showRevisedInput = false;
    this.isExtensionClicked = true;
    this.isRevisedClicked = false;
    this.POAddForm.get('ExtensionEndDate')?.enable();
    this.POAddForm.get('EndDate')?.disable();
    // Also disable quantity calculation in Extension mode
    this.POAddForm.get('Quantity')?.disable();
  }

  onRevised(): void {
    this.showRevisedInput = true;
    this.showExtensionInput = false;
    this.isRevisedClicked = true;
    this.isExtensionClicked = false;
    this.POAddForm.get('EndDate')?.enable();
    this.POAddForm.get('Quantity')?.disable();


    const startDate = this.POAddForm.get('StartDate')?.value;
    const endDate = this.POAddForm.get('EndDate')?.value;
    const quantityType = this.POAddForm.get('Quantitytype')?.value;

    if (startDate && endDate && quantityType) {
      this.calculateQuantity(startDate, endDate, quantityType);
    }
  }

  handleponumbersearchEvent(event: any): void {
    this.selectedOption = event.ponumber;
    this.selectedPoId = event.poid;
    if (this.statusId === 0) {
      const companyIdStr = this.companyId ? this.companyId.toString() : '';
      const poNumberStr = this.selectedOption.toString();
      const employeeIdStr = this.data?.employeeId
        ? this.data.employeeId.toString()
        : (this.POAddForm.get('EmployeeID')?.value || '').toString();
      const pricingTypeIdStr = this.data?.pricingtype_Id
        ? this.data.pricingtype_Id.toString()
        : '';

      const payload = {
        companyId: companyIdStr,
        poNumber: poNumberStr,
        employeeId: employeeIdStr,
        PricingTypeId: pricingTypeIdStr
      };

      this.poService.PODetailView(payload).subscribe({
        next: (response) => {
          const tableData = response?.Data?.data?.Table0 ?? [];

          if (tableData.length > 0) {
            const poDetails = tableData[0];

            this.POAddForm.patchValue({
              PONo: poNumberStr,
              CompanyCode: poDetails['COMPANY CODE'] || '',
              POStartDate: this.formatDateForInput(poDetails['PO START DATE']),
              POEndDate: this.formatDateForInput(poDetails['PO END DATE']),
              POtotalvalue: poDetails['POValue'] || '',
              EmployeeID: poDetails['EMPLOYEE ID'] || '',
              EmployeeName: poDetails['EMPLOYEE NAME'] || '',
              ClientEmpNo: poDetails['Employee_Code'] || '',
              // StartDate: this.formatDateForInput(poDetails['DateOfJoining']),
              // EndDate: this.formatDateForInput(poDetails['PO END DATE']),
              OfferPOValue: poDetails['OFFER_PO_VALUE'],
              CTC: poDetails['CTC'] || '',
            });

            // Calculate duration after setting the dates
            // const startDate = this.POAddForm.get('StartDate')?.value;
            // const endDate = this.POAddForm.get('EndDate')?.value;
            // if (startDate && endDate) {
            //   this.calculateDuration(startDate, endDate);
            // }

            // const quantityType = this.POAddForm.get('Quantitytype')?.value;
            // if (startDate && endDate && quantityType) {
            //   this.calculateQuantity(startDate, endDate, quantityType);
            // }
          }
        },
        error: (err) => {
          console.error('Error fetching PO details:', err);
        }
      });
    }
  }
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      this.POAddForm.get('Document')?.setValue(file); // ✅ For form validation
    }
  }


  handleporatesearchEvent(event: any): void {
    const value = event.target.value;

    if (this.statusId === 0 && value?.trim()) {
      const companyIdStr = this.companyId ? this.companyId.toString() : '';
      const siteIdStr = '0';
      const QuantitytypeStr = this.POAddForm.get('Quantitytype')?.value?.toString() || '';
      // const QuantityStr = (parseInt(this.selectedPOQuantityCode))?.toString() || '';
      const QuantityStr = (this.POAddForm.get('Quantity')?.value || '').toString();
      const Poratestr = value.toString();


      const payload = {
        QUANTITYTYPE: QuantitytypeStr,
        QUANTITY: QuantityStr,
        FIXEDRATE: Poratestr
      };

      this.poService.GetPoEmpValue(payload).subscribe({
        next: (response) => {

          const poDetails = response?.Data;

          if (poDetails) {
            this.POAddForm.patchValue({
              MonthlyRate: poDetails['MONTHLYRATE'],
              ResourceValue: poDetails['TOTAL']
            });
          } else {
            console.warn('PO details not found in response');
          }
        },
        error: (err) => {
          console.error('Error fetching PO details:', err);
        }
      });
    }
  }

  handlestartdatesearchEvent(event: any): void {
    this.POAddForm.get('EndDate')?.setValue('');
  }

  handleenddatesearchEvent(event: any): void {
    this.isLoading = true;
    const ENDDATE = event.target.value;
    const Startdate = (this.POAddForm.get('StartDate')?.value || '').toString();
    const PO_ID = this.selectedPoId;
    const CLIENTEMPID = this.selectedEmpId;
    const QUANTITYTYPE = (this.POAddForm.get('Quantitytype')?.value || '').toString();
    const QUANTITY = (this.POAddForm.get('Quantity')?.value || '').toString();
    const PORate = (this.POAddForm.get('PORate')?.value || '').toString();


    if (Startdate === '') {
      alert('Please select Start date');
      this.POAddForm.get('EndDate')?.setValue('');
      this.isLoading = false;
      return;
    }

    if (Startdate && ENDDATE) {

      if (Startdate > ENDDATE) {
        alert('End date should not be less than Start date');
        this.POAddForm.get('EndDate')?.setValue('');
        this.isLoading = false;
        return;
      }

      const payload = {
        PO_ID: String(this.selectedPoId),
        Startdate: this.formatDateForInput1(Startdate),
        ENDDATE: this.formatDateForInput1(ENDDATE)
      };

      this.poService.GetPoEmpDuration(payload).subscribe({
        next: res => {

          const result = res?.Data?.result || '';
          const newduration = res?.Data?.duration || '';

          if (result != '') {
            alert(result);
            this.isLoading = false;
            return;
          }
          this.POAddForm.get('Duration')?.setValue(newduration);
          
          if (QUANTITYTYPE != '') {
            const payloadqty = {
              PO_ID: String(this.selectedPoId),
              CLIENTEMPID: String(this.selectedEmpId),
              PRICINGTYPE: "",
              Startdate: this.formatDateForInput1(Startdate),
              ENDDATE: this.formatDateForInput1(ENDDATE),
              QUANTITYTYPE: QUANTITYTYPE
            };

            
            this.poService.GetPoEmpCalculation(payloadqty).subscribe({
              next: res => {
                const poquantity = res?.Data?.poquantity || '';
                this.POAddForm.get('Quantity')?.setValue(poquantity);

              },
              error: err => {
                console.error('Error fetching PO quantity values:', err);
                this.isLoading = false;
                // Don't clear the field on error, keep current value
              }
            });

            setTimeout(() => {
              
            }, 500);

            if (PORate != '') {
              const payloadcal = {

                QUANTITYTYPE: String(QUANTITYTYPE),
                QUANTITY: String(QUANTITY),
                FIXEDRATE: String(PORate),
              };

              this.poService.GetPoEmpValue(payloadcal).subscribe({
                next: res => {
                  const monthlyrate = res?.Data?.monthlyrate || '';
                  const totalvalue = res?.Data?.total || '';
                  this.POAddForm.get('MonthlyRate')?.setValue(monthlyrate);
                  this.POAddForm.get('ResourceValue')?.setValue(totalvalue);

                },
                error: err => {
                  console.error('Error fetching PO quantity values:', err);
                  this.isLoading = false;
                  // Don't clear the field on error, keep current value
                }
              });
            }
          }

          this.isLoading = false;
        },
        error: err => {
          console.error('Error fetching PO quantity values:', err);
          this.isLoading = false;
          // Don't clear the field on error, keep current value
        }
      });
    }
  }

  formatDateForInput(dateStr: string): string | null {
    if (!dateStr) return null;

    const months: any = {
      Jan: '01', Feb: '02', Mar: '03', Apr: '04',
      May: '05', Jun: '06', Jul: '07', Aug: '08',
      Sep: '09', Oct: '10', Nov: '11', Dec: '12'
    };

    const [day, mon, year] = dateStr.split('-');
    const month = months[mon];
    return `${year}-${month}-${day.padStart(2, '0')}`;
  }

  formatDateForInput1(dateStr: string): string | null {
    if (!dateStr) return null;

    const months: any = {
      '01': 'Jan', '02': 'Feb', '03': 'Mar', '04': 'Apr',
      '05': 'May', '06': 'Jun', '07': 'Jul', '08': 'Aug',
      '09': 'Sep', '10': 'Oct', '11': 'Nov', '12': 'Dec'
    };

    const [day, mon, year] = dateStr.split('-');
    const month = months[mon];
    return `${year}-${month}-${day.padStart(2, '0')}`;
  }
}