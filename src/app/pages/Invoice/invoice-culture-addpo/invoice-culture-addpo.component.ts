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
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { Router } from '@angular/router';


interface ChildDetail {
  InvoiceCulture_id: number;
  Company_Id: number;
  Paycode_Id: number;
  Paycode_Code: string;
  HasAccess: boolean;
}


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
  datatable: Array<{ [key: string]: any }> = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  // TypeOfInvoiceList: { id: number, code: string }[] = [
  //   { id: 27, code: "LEAEN" },
  //   { id: 35, code: "INCET" },
  //   { id: 51, code: "OTPAY" },
  //   { id: 95, code: "LWFR" },
  //   { id: 105, code: "SERCG" },
  //   { id: 121, code: "BONUS" },
  //   { id: 129, code: "WMCOC" },
  //   { id: 343, code: "SADIN" },
  //   { id: 1003, code: "ARREAR" },
  //   { id: 1000, code: "SALARY" },
  //   { id: 1005, code: "OTHER" }
  // ];

  userdetail: any;
  selectedFile: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  mapnameUI: any;
  typeInvoiceList: any;
  isPaycodesLoaded = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InvoiceCultureAddpoComponent>,
    @Inject(MAT_DIALOG_DATA) public Data: any,
    private poService: InvoiceCultureService, private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService, private router: Router
  ) { }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.initializeForm();
    this.loadServiceCharges();
    this.loadInvoiceTypes();
    this.loadInvoiceCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  handleMapNameEvent(mapname: any) {
    console.log('MapName selected:', mapname);
    this.mapnameUI = mapname;
    this.selectedMN = mapname.mapName;

    this.InvoiceCultureForm.patchValue({
      MapName: mapname.mapName || '',
      CostCenterMapping: mapname['costCenterMappingId'] || 1
    });

    this.InvoiceCultureForm.get('MapName')?.markAsTouched();
    this.InvoiceCultureForm.get('CostCenterMapping')?.markAsTouched();
  }

  initializeForm(): void {
    this.InvoiceCultureForm = this.fb.group({
      CompanyCode: ['', Validators.required],
      ServiceCharge: ['', Validators.required],
      MapName: ['', Validators.required],
      InvoiceType: ['', Validators.required],
      InvoiceCategory: ['', Validators.required],
      State: [{ value: '', disabled: true }],
      CityName: [''],
      Description: [''],
      CostCenterMapping: [1, Validators.required],
      StateName: [''],
      InvoiceTypeName: ['Standard', Validators.required],
      InvoiceCategoryName: ['Standard', Validators.required]
    });

    // this.InvoiceCultureForm = this.fb.group({});

    this.typeInvoiceList?.forEach(item => {
      this.InvoiceCultureForm.addControl(item.Paycode_Id.toString(), this.fb.control(false));
    });

    this.InvoiceCultureForm?.get('InvoiceType')?.valueChanges.subscribe((invoiceType: any) => {
      // run only after user selects
      if (!invoiceType) return;

      if (invoiceType.invoiceType_Id == 2) {
        // SPLIT → enable checkboxes
        this.enablePaycodeCheckboxes();
      } else if (invoiceType.invoiceType_Id == 1) {
        // REGULAR → disable checkboxes
        this.disablePaycodeCheckboxes();
      }
    });

    this.setupFormListeners();
  }

  loadPaycodes(): void {
    this.poService.getAllPaycode(this.selectedCC).subscribe({
      next: (res) => {
        this.typeInvoiceList = res?.Data || [];

        // Create checkbox controls dynamically
        this.typeInvoiceList.forEach(t => {
          const controlName = t.Paycode_Id.toString();
          if (!this.InvoiceCultureForm.contains(controlName)) {
            this.InvoiceCultureForm.addControl(controlName, new FormControl(false));
          }
        });
        this.isPaycodesLoaded = true;
      },
      error: (err) => {
        console.error('Error loading invoice types', err);
      }
    });
  }

  enablePaycodeCheckboxes() {
    this.typeInvoiceList.forEach(t => {
      this.InvoiceCultureForm.get(t.Paycode_Id.toString())?.enable();
    });
  }

  disablePaycodeCheckboxes() {
    this.typeInvoiceList.forEach(t => {
      const control = this.InvoiceCultureForm.get(t.Paycode_Id.toString());
      control?.disable();
      control?.setValue(false); // clear selection
    });
  }


  getSelectedInvoiceTypes() {
    return this.typeInvoiceList
      .filter(x => this.InvoiceCultureForm.get(x.code)?.value === true)
      .map(x => ({
        id: x.id,
        code: x.code
      }));
  }
  SaveData() {
    this.isLoading = true;
    console.log("Selva" + JSON.stringify(this.InvoiceCultureForm.value));
    console.log()
    if (this.InvoiceCultureForm.invalid) {
      this.InvoiceCultureForm.markAllAsTouched();
      return;
    }
    const formValue = this.InvoiceCultureForm.value;

    const parentDetail = {
      InvoiceCulture_id: 0,
      Company_Id: this.companyUI.companyId,
      Company_Code: this.companyUI.companyCode,
      Company_Name: this.companyUI.companyName,
      InvoiceCul_Ref_No: "",
      InvoiceType: this.InvoiceCultureForm.get('InvoiceTypeName')?.value,
      InvoiceType_Id: this.InvoiceCultureForm.get('InvoiceType')?.value,
      Cost_Center_Mapping_Id: this.mapnameUI.mapNameId,
      Service_Charge_Master_Id: this.InvoiceCultureForm.get('ServiceCharge')?.value,
      Service_Charge_Type_Id: 0,
      Service_Charge_Slab_Item_Id: 0,
      Service_Charge_Slab_Inner_Item_Id: 0,
      Map_Name_Id: this.mapnameUI.mapNameId,
      Map_Name: this.mapnameUI.mapName,
      Invoice_Category_Id: this.InvoiceCultureForm.get('InvoiceCategory')?.value,
      Error_Message: ""
    }
    const childDetail: ChildDetail[] = [];

    const selectedItems = this.getSelectedInvoiceTypes();

    selectedItems.forEach(item => {
      childDetail.push({
        InvoiceCulture_id: 0,
        Company_Id: this.companyUI.companyId,
        Paycode_Id: item.id,
        Paycode_Code: item.code,
        HasAccess: true
      });
    });

    const InvoiceCultureAdd = {
      createdBy: this.userdetail.user_Id,
      mode: 'Add',
      parentDetail: parentDetail,
      childDetail: childDetail
    }
    console.log(InvoiceCultureAdd);
    this.poService.postInvoiceCulture(InvoiceCultureAdd).subscribe({
      next: (res) => {
        console.log(res);
        if (res.Data.message == "Invoice Culture/Structure Already Exists") {
          this.isLoading = false;
          alert(res.Data.message);
          return;
        }
        else if (res.Data.data.Table0) {
          this.datatable = res.Data.data.Table0;
          this.downloadExcel(this.datatable, "InvoiceCulture_Validations");
          this.router.navigate(['Master/invoicenavigation/app-invoice-culture']);
          this.isLoading = false;
        }
        else {
          alert("No validations returned");
          this.isLoading = false;
        }
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }
  downloadExcel(data: any[], templateId: string): void {
    //console.log("export");
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Sheet1': worksheet },
      SheetNames: ['Sheet1']
    };
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    const fileName = `${templateId}.xlsx`;
    FileSaver.saveAs(blob, fileName);
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

    // Listen to checkbox changes
    this.InvoiceCultureForm.valueChanges.subscribe(() => {
      this.checkInvoiceTypeSelection();
    });
  }

  onCheckboxChange() {
    const selectedCount = this.typeInvoiceList.filter(t =>
      this.InvoiceCultureForm.get(t.Paycode_Id.toString())?.value
    ).length;

    this.showInvoiceTypeError = selectedCount === 0;
  }

  checkInvoiceTypeSelection() {
    const selectedCount = this.typeInvoiceList.filter(t =>
      this.InvoiceCultureForm.get(t.Paycode_Id.toString())?.value
    ).length;
    this.showInvoiceTypeError = selectedCount === 0;
  }

  onInvoiceCategoryChange(categoryId: string): void {
    if (!categoryId) {
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
    this.loadPaycodes();

    this.InvoiceCultureForm.patchValue({
      CompanyCode: this.selectedCC
    })
    this.InvoiceCultureForm.get('CompanyCode')?.markAsTouched();
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
    this.typeInvoiceList.forEach(t => this.InvoiceCultureForm.get(t.Paycode_Code)?.setValue(false));
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

      const selectedTypeOfInvoice = this.typeInvoiceList
        .filter(t => this.InvoiceCultureForm.get(t.Paycode_Code)?.value);

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
          state_Id: 4,
          Date: currentDate,
          City_Name: this.InvoiceCultureForm.get('CityName')?.value || "Singapore",
          State_Name: this.InvoiceCultureForm.get('StateName')?.value || "Singapore",
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
        UserId: this.userdetail?.userId?.toString() || 'U12345'
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
