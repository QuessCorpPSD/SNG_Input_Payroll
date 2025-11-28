import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { InvoiceCultureService } from '../../../Service/invoice-culture.service';
import { Mapnameclass } from '../../../Models/Common';
import { MapnameComponent } from '../../../common/Mapname/mapname/mapname.component';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-invoice-culture-addpo',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, FormsModule, MatIconModule,
    MatCheckboxModule, MatTableModule, MatPaginatorModule, MatSortModule,
    CompanyallComponent, MapnameComponent, MatCardModule
  ],
  templateUrl: './invoice-culture-addpo.component.html',
  styleUrls: ['./invoice-culture-addpo.component.css']
})
export class InvoiceCultureAddpoComponent implements AfterViewInit {
  InvoiceCultureForm!: FormGroup;
  showTypeOfInvoice = false;
  companyUI: any;
  selectedCC: number = 0;
  selectedMN: string = '';
  States: any[] = [];
  ServiceChargeOptions: any[] = [];
  InvoiceTypeList: any[] = [];
  InvoiceCategoryList: any[] = [];
  isLoading = false;
  isLoadingCategories = false;
  isStateWiseCategory = false;
  showInvoiceTypeError = false;
  dataSource = new MatTableDataSource<any>([]);
  displayedColumns: string[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  TypeOfInvoiceList = [
    { code: 'SERCG', name: 'Service Charge' },
    { code: 'ARREAR', name: 'Arrear' },
    { code: 'SALARY', name: 'Salary' },
    { code: 'BONUS', name: 'Bonus' },
    { code: 'OTHER', name: 'Other (example)' }
  ];

  @Output() mapnameUI = new EventEmitter<Mapnameclass>();
  userdetail: any;
  selectedFile: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InvoiceCultureAddpoComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private poService: InvoiceCultureService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadServiceCharges();
    this.BindStates();
    this.loadInvoiceTypes();
    this.loadInvoiceCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  initializeForm(): void {
    this.InvoiceCultureForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      ServiceCharge: ['', Validators.required],
      MapName: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      InvoiceCategory: ['', Validators.required],
      State: [{ value: '', disabled: true }],
      CityName: ['', Validators.required],
      Description: ['', Validators.required],
      CostCenterMapping: [1, Validators.required],
      StateName: ['', Validators.required],
      InvoiceTypeName: ['Standard', Validators.required],
      InvoiceCategoryName: ['Standard', Validators.required]
    });

    this.TypeOfInvoiceList.forEach(t => {
      this.InvoiceCultureForm.addControl(t.code, new FormControl(false));
    });

    this.setupFormListeners();
  }

  setupFormListeners(): void {
    this.InvoiceCultureForm.get('InvoiceCategory')?.valueChanges.subscribe(value => {
      this.onInvoiceCategoryChange(value);
    });

    this.InvoiceCultureForm.get('InvoiceType')?.valueChanges.subscribe(value => {
      if (value) {
        const selectedType = this.InvoiceTypeList.find(type => type.invoiceType_Id?.toString() === value);
        if (selectedType) {
          this.InvoiceCultureForm.patchValue({
            InvoiceTypeName: selectedType.invoiceType_Name || selectedType.invoiceType || 'Standard'
          });
        }
      }
    });

    this.InvoiceCultureForm.get('InvoiceCategory')?.valueChanges.subscribe(value => {
      if (value) {
        const selectedCategory = this.InvoiceCategoryList.find(cat =>
          cat.geN_iID?.toString() === value
        );
        if (selectedCategory) {
          this.InvoiceCultureForm.patchValue({
            InvoiceCategoryName: selectedCategory.geN_vDescription || 'Standard'
          });
        }
      }
    });

    this.InvoiceCultureForm.get('State')?.valueChanges.subscribe(value => {
      if (value) {
        const selectedState = this.States.find(state => state.rowid?.toString() === value);
        if (selectedState) {
          this.InvoiceCultureForm.patchValue({
            StateName: selectedState.name || selectedState.stateName || value
          });
        } else {
          this.InvoiceCultureForm.patchValue({
            StateName: value
          });
        }
      }
    });

    // Listen to checkbox changes
    this.InvoiceCultureForm.valueChanges.subscribe(() => {
      this.checkInvoiceTypeSelection();
    });
  }

  onCheckboxChange() {
    this.checkInvoiceTypeSelection();
  }

  checkInvoiceTypeSelection() {
    const selectedCount = this.TypeOfInvoiceList.filter(t =>
      this.InvoiceCultureForm.get(t.code)?.value
    ).length;
    this.showInvoiceTypeError = selectedCount === 0;
  }

  onInvoiceCategoryChange(categoryId: string): void {
    if (!categoryId) {
      this.isStateWiseCategory = false;
      this.InvoiceCultureForm.get('State')?.disable();
      this.InvoiceCultureForm.get('StateName')?.disable();
      return;
    }

    const selectedCategory = this.InvoiceCategoryList.find(cat =>
      cat.geN_iID?.toString() === categoryId
    );

    this.isStateWiseCategory = selectedCategory?.geN_vDescription?.toLowerCase().includes('state') ||
      selectedCategory?.geN_vDescription?.toLowerCase().includes('state wise');

    if (this.isStateWiseCategory) {
      this.InvoiceCultureForm.get('State')?.enable();
      this.InvoiceCultureForm.get('StateName')?.enable();
    } else {
      this.InvoiceCultureForm.get('State')?.disable();
      this.InvoiceCultureForm.get('StateName')?.disable();
      this.InvoiceCultureForm.patchValue({
        State: '',
        StateName: ''
      });
    }
  }

  handleCompanyEvent(company: any) {
    console.log('Company selected:', company);
    this.companyUI = company;
    this.selectedCC = Number(company.companyId) || 0;

    const stateValue = company.stateName || company.state || 'Karnataka';
    const cityValue = company.city || 'Bangalore';

    this.InvoiceCultureForm.patchValue({
      CompanyCode: company.companyCode || '',
      State: stateValue,
      StateName: stateValue,
      CityName: cityValue
    });

    if (this.isStateWiseCategory) {
      this.InvoiceCultureForm.get('State')?.enable();
      this.InvoiceCultureForm.get('StateName')?.enable();
    }

    this.InvoiceCultureForm.get('CompanyCode')?.markAsTouched();
  }

  handleMapNameEvent(mapname: Mapnameclass) {
    console.log('MapName selected:', mapname);
    this.selectedMN = mapname.mapName;

    this.InvoiceCultureForm.patchValue({
      MapName: mapname.mapName || '',
      CostCenterMapping: mapname['costCenterMappingId'] || 1
    });

    this.InvoiceCultureForm.get('MapName')?.markAsTouched();
    this.InvoiceCultureForm.get('CostCenterMapping')?.markAsTouched();

    this.mapnameUI.emit(mapname);
  }

  BindStates(): void {
    this.poService.GetStates('STATE').subscribe({
      next: (res: any) => {
        console.log('States', res);
        this.States = Array.isArray(res?.Data) ? res.Data : [];
      },
      error: err => console.error('STATES API ERROR:', err)
    });
  }

  loadServiceCharges(): void {
    this.isLoading = true;
    this.poService.ServiceChargeMaster().subscribe({
      next: (res: any) => {
        console.log('ServiceCharges', res);
        this.ServiceChargeOptions = Array.isArray(res.Data) ? res.Data : [];
        this.isLoading = false;
      },
      error: err => {
        console.error('SERVICE CHARGES API ERROR:', err);
        this.ServiceChargeOptions = [];
        this.isLoading = false;
      }
    });
  }

  loadInvoiceTypes(): void {
    this.isLoading = true;
    this.poService.InvoiceType().subscribe({
      next: (res: any) => {
        console.log('InvoiceTypes', res);
        this.InvoiceTypeList = Array.isArray(res.Data) ? res.Data : [];
        this.isLoading = false;
      },
      error: err => {
        console.error('InvoiceTypes:', err);
        this.InvoiceTypeList = [];
        this.isLoading = false;
      }
    });
  }

  loadInvoiceCategories(): void {
    this.isLoadingCategories = true;
    this.poService.InvoiceCategory().subscribe({
      next: (res: any) => {
        console.log('InvoiceCategories', res);
        this.InvoiceCategoryList = Array.isArray(res.Data) ? res.Data : [];
        this.isLoadingCategories = false;
      },
      error: err => {
        console.error('INVOICE CATEGORIES API ERROR:', err);
        this.InvoiceCategoryList = [];
        this.isLoadingCategories = false;
      }
    });
  }

  resetForm() {
    this.InvoiceCultureForm.reset({
      CostCenterMapping: 1,
      InvoiceTypeName: 'Standard',
      InvoiceCategoryName: 'Standard'
    });
    this.TypeOfInvoiceList.forEach(t => this.InvoiceCultureForm.get(t.code)?.setValue(false));
    this.showTypeOfInvoice = false;
    this.selectedCC = 0;
    this.selectedMN = '';
    this.isStateWiseCategory = false;
    this.showInvoiceTypeError = false;
    this.InvoiceCultureForm.get('State')?.disable();
    this.InvoiceCultureForm.get('StateName')?.disable();
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.InvoiceCultureForm.get(fieldName);
    return !!(control && control.invalid && control.touched);
  }

  getFieldError(fieldName: string): string {
    const control = this.InvoiceCultureForm.get(fieldName);
    if (control && control.errors && control.touched) {
      if (control.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} is required`;
      }
    }
    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const fieldNames: { [key: string]: string } = {
      CompanyCode: 'Company Code',
      ServiceCharge: 'Service Charge',
      MapName: 'Map Name',
      InvoiceType: 'Invoice Type',
      InvoiceCategory: 'Invoice Category',
      CityName: 'City Name',
      Description: 'Description',
      CostCenterMapping: 'Cost Center Mapping',
      StateName: 'State Name',
      InvoiceTypeName: 'Invoice Type Name',
      InvoiceCategoryName: 'Invoice Category Name'
    };
    return fieldNames[fieldName] || fieldName;
  }

  ValidatedSubmit(): Promise<void> {
    this.isLoading = true;

    return new Promise((resolve, reject) => {
      // Mark all fields as touched to trigger validation displays
      this.InvoiceCultureForm.markAllAsTouched();
      this.checkInvoiceTypeSelection();

      if (this.InvoiceCultureForm.invalid || this.showInvoiceTypeError) {
        this.isLoading = false;
        this.showPopup = true;
        this.popupMessage = 'Please fill all required fields before saving.';
        // validation failure - stop without rejecting to avoid unhandled rejection logs
        return;
      }

      const selectedTypeOfInvoice = this.TypeOfInvoiceList
        .filter(t => this.InvoiceCultureForm.get(t.code)?.value);

      if (selectedTypeOfInvoice.length === 0) {
        this.isLoading = false;
        this.showPopup = true;
        this.popupMessage = 'Please select at least one invoice type.';
        // stop without rejecting
        return;
      }

      // Prepare payload
      const currentDate = new Date().toISOString().split('T')[0];

      const paycodeMap: { [key: string]: number } = {
        SALARY: 1000,
        SERCG: 1002,
        ARREAR: 1003,
        BONUS: 1004,
        OTHER: 1005
      };

      const typeOfInvoicePayload = selectedTypeOfInvoice.map(t => ({
        invoiceCulture_id: 0,
        company_Id: this.selectedCC || this.companyUI?.companyId || 1,
        paycode_Id: paycodeMap[t.code] || 1005,
        paycode_Code: t.code,
        hasAccess: true
      }));

      const paycodeCodes = typeOfInvoicePayload.map(t => t.paycode_Code).join(',') || '';

      const payload = {
        InvoiceStructure: {
          invoiceCulture_id: 0,
          client_Id: 0,
          client_Code: this.companyUI?.clientCode || "101",
          company_Name: this.companyUI?.companyName || "QUESS SINGAPORE",
          company_Id: this.selectedCC || this.companyUI?.companyId || 1,
          invoiceType_Id: Number(this.InvoiceCultureForm.get('InvoiceType')?.value) || 2,
          cost_Center_Mapping_Id: Number(this.InvoiceCultureForm.get('CostCenterMapping')?.value) || 1,
          service_Charge_Master_Id: Number(this.InvoiceCultureForm.get('ServiceCharge')?.value) || 1,
          service_Charge_Type_Id: 0,
          service_Charge_Slab_Item_Id: 0,
          service_Charge_Slab_Inner_Item_Id: 0,
          type_Of_Invoice: 0,
          type_Of_Invoice_Name: "Regular",
          service_Charge_Type_Name: "Standard",
          company_Code: this.companyUI?.companyCode || "SG000001",
          map_Name: this.InvoiceCultureForm.get('MapName')?.value || "Singapore",
          map_Name_Id: 1,
          paycode_Id: 0,
          invoiceCul_Ref_No: "",
          serial_No: 0,
          gen_iID: 0,
          invoice_Category_Id: Number(this.InvoiceCultureForm.get('InvoiceCategory')?.value) || 0,
          state_Id: 1,
          Date: currentDate,
          City_Name: this.InvoiceCultureForm.get('CityName')?.value || "Orchard",
          State_Name: this.InvoiceCultureForm.get('StateName')?.value || "Central",
          InvoiceType: this.InvoiceCultureForm.get('InvoiceTypeName')?.value || "Standard",
          Paycode_Code: paycodeCodes,
          Error_Message: '',
          GEN_vDescription: this.InvoiceCultureForm.get('Description')?.value || `Invoice for ${this.companyUI?.companyName || 'QUESS SINGAPORE'}`,
          InvoiceType_Id_Name: this.InvoiceCultureForm.get('InvoiceTypeName')?.value || "Standard",
          Invoice_Category_Name: this.InvoiceCultureForm.get('InvoiceCategoryName')?.value || "Standard"
        },
        TypeOfInvoiceForInvoiceStructure: typeOfInvoicePayload,
        Mode: "Add",
        InvoiceType: "Standard",
        UserId: this.userdetail?.userId?.toString()
      };

      console.log('Final Payload:', JSON.stringify(payload, null, 2));

      // Send API Request
      this.poService.postInvoiceCulture(payload).subscribe({
        next: (res: any) => {
          this.isLoading = false;
          console.log('API Response:', res);

          if (res.StatusCode === 200 || res.success) {
            this.showPopup = true;
            this.popupMessage = 'Invoice saved successfully!';
            setTimeout(() => {
              this.dialogRef.close(true);
            }, 2000);
            resolve();
          } else {
            this.showPopup = true;
            this.popupMessage = res.Message || 'Failed to save invoice.';
            reject(res.Message);
          }
        },
        error: (err: any) => {
          this.isLoading = false;
          console.error('API Error:', err);

          const errorData = err.error?.Data;
          if (errorData && errorData.errors) {
            const errorMessages = Object.entries(errorData.errors)
              .map(([field, messages]) => {
                const combinedMessages = Array.isArray(messages) ? messages.join(', ') : messages;
                return `${field}: ${combinedMessages}`;
              })
              .join('\n');

            this.showPopup = true;
            this.popupMessage = `Validation Errors:\n${errorMessages}`;
            reject(errorMessages);
          } else {
            this.showPopup = true;
            this.popupMessage = err.error?.Message || 'Failed to save invoice. Please try again.';
            reject(err);
          }
        }
      });
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
