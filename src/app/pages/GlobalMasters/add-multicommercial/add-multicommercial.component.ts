import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";

import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { IFormulaRepository } from '../../../Repository/GlobalMasters/IFormulaRepository';
import { FormualService } from '../../../Service/GlobalMasters/formula.service';

export const Formula_TOKEN = new InjectionToken<IFormulaRepository>('Formula_TOKEN');

@Component({
  selector: 'app-add-multicommercial',
  standalone: true,
  imports: [CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    CompanyallComponent,
    ReactiveFormsModule,
    FormsModule,
    AlertpopupComponent],
  templateUrl: './add-multicommercial.component.html',
  styleUrl: './add-multicommercial.component.css',
  providers: [{
    provide: Formula_TOKEN,
    useClass: FormualService,
  }]
})
export class AddMulticommercialComponent {

  constructor(
    private dialogRef: MatDialogRef<AddMulticommercialComponent>,
    @Inject(Formula_TOKEN) private formula: IFormulaRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(MAT_DIALOG_DATA) public editData: any,
  ) { }

  // VARIABLES
  isUploadGridVisible = false;
  uploadedData: any[] = [];
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  addformula!: FormGroup;
  editFormula!: FormGroup;
  selectedCompanyId: number = 0;
  companyUI: any;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';
  isLoading: boolean = false;


  payrollType: any[] = [];
  selectedPayCategory: any = null;

  payCode: any[] = [];
  selectedPayCode: any = null;

  Description: string = "";
  Formula: string = "";
  userdetail: any;


  val_company = false;
  val_category = false;
  val_paycode = false;
  val_formula = false;

  Edit = false;
  showAlertPopup(message: string, subMessage: string = '') {
    this.popupMessage = message;
    this.popupSubMessage = subMessage;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
    this.popupMessage = '';
    this.popupSubMessage = '';
  }

  ngOnInit() {

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.LoadpayrollType();
    this.addformula = new FormGroup({
      CompanyId: new FormControl("", Validators.required),
      PayCategory: new FormControl("All", Validators.required),
      PayrollType: new FormControl("", Validators.required),
      PayrollTypeName: new FormControl("", Validators.required),
      //PayCategory_Name: new FormControl("", Validators.required),
      PayCode: new FormControl("", Validators.required),
      PayCode_Code: new FormControl("", Validators.required),
      Description: new FormControl(""),
      Formula: new FormControl("", Validators.required)
    });

    this.addformula.get('PayCategory')?.disable();

    this.editFormula = new FormGroup({
      CompanyId: new FormControl(""),
      PayCategory: new FormControl(""),
      PayrollTypeName: new FormControl(""),
      PayCode: new FormControl(""),
      Description: new FormControl(""),
      Formula: new FormControl("", Validators.required)
    });

    this.editFormula.get('CompanyId')?.disable();
    this.editFormula.get('PayCategory')?.disable();
    this.editFormula.get('PayrollTypeName')?.disable();
    this.editFormula.get('PayCode')?.disable();
    this.editFormula.get('Description')?.disable();

    if (this.editData?.mode?.toLowerCase() === "edit") {
      this.Edit = true;

      const row = this.editData.row;

      this.editFormula.patchValue({
        CompanyId: row.Company_Code,
        PayCategory: row.Paycateory,
        PayCode: row.Paycode_Code,
        PayrollTypeName: row.PayrollType,
        Description: row.Formula_Name,
        Formula: row.Formula,
      });

      this.selectedCompanyId = row.Company_id;

      this.selectedPayCategory = {
        Band_Id: row.PayCategory_Id,
        Band_Name: row.Paycateory
      };
      this.selectedPayCode = row.Paycode_Id;
      this.Description = row.Formula_Name;
      this.Formula = row.Formula;
    }
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.companyUI = company;

    this.val_company = false;
    this.LoadpayCode();
  }



  LoadpayrollType() {
    this.formula.PayrollType().subscribe({
      next: (res: any) => {
        //console.log('PayCategory', res);
        if (res?.Data?.data?.Table0) {
          this.payrollType = res.Data.data.Table0;
        }
      },
      error: err => console.error(" PayrollType API Error:", err)
    });
  }

  ChangepayrollType(event: Event) {
    const selectElement = event.target as HTMLSelectElement;

    const value = selectElement.value;
    const text = selectElement.options[selectElement.selectedIndex].text;

    this.addformula.patchValue({
      PayrollType: value,
      PayrollTypeName: text
    });

    this.addformula.get('PayrollType')?.markAsTouched();
  }


  LoadpayCode() {
    this.formula.MultiCommercialPaycodes().subscribe({
      next: (res: any) => {
        if (res?.Data) {
          this.payCode = res.Data;
        }
      },
      error: err => console.error(" Pay Code API Error:", err)
    });
  }

  ChangepayCode(event: Event) {
    const selectElement = event.target as HTMLSelectElement;

    const value = selectElement.value;
    const text = selectElement.options[selectElement.selectedIndex].text;

    this.addformula.patchValue({
      PayCode: value,
      PayCode_Code: text
    });

    this.addformula.get('PayCode')?.markAsTouched();
  }

  SaveClick() {

    if (this.addformula.invalid) {
      this.addformula.markAllAsTouched();
      alert("please fill all required fields")
      return;
    }
    this.isLoading = true;
    const raw = this.addformula.getRawValue();
    //console.log('Form values', raw);
    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Add",
      detail: {
        Formula_Id: 0,
        PayrollTypeId: raw.PayrollType,
        PayrollType: raw.PayrollTypeName,
        Paycode_Id: raw.PayCode,
        Paycode_Code: raw.PayCode_Code || "",
        Formula_Name: raw.Description.trim() || "Formula",
        Formula: raw.Formula?.trim() || "",
        Company_Id: raw.CompanyId.companyId,
        Company_Code: raw.CompanyId.companyCode || "",
        PayCategory_Id: 0,
        Paycateory: "All",
        Error_Message: "",
        SNo: 0
      }
    };
    this.formula.CreateMCFormula(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        //console.log('response', res);
        if (res?.Data?.message == 'Formula created successfully') {
          alert(res?.Data?.message);
          this.dialogRef.close('updated');
          this.isLoading = false;
        } else if (res?.Data?.message) {
          alert(res?.Data?.message);
          this.isLoading = false;
        }
        else {
          alert('Save Failed');
          this.isLoading = false;
        }
      },
      error: () => {
        alert("API Error")
        this.isLoading = false;
      }
    });
  }

  Save() {
    this.isLoading = true;
    const row = this.editData.row;
    //console.log('edit', row);
    const formvalue = this.editFormula.getRawValue();

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Edit",
      detail: {
        Formula_Id: row.Formula_Id,
        Paycode_Id: row.Paycode_Id,
        Paycode_Code: row.Paycode_Code,
        Formula_Name: row.Formula_Name,
        Formula: formvalue.Formula,
        Company_Id: row.Company_id,
        Company_Code: row.Company_Code,
        PayCategory_Id: row.PayCategory_Id,
        PayrollTypeId: row.PayrollTypeId,
        PayrollType: row.PayrollType,
        Paycateory: row.Paycateory,
        Error_Message: "",
        SNo: row.SNo
      }
    };
    //console.log('Edit', payload);
    this.formula.CreateMCFormula(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Formula saved successfully");
          this.dialogRef.close('updated');
          return;
        } else {
          alert("Save failed");
          this.isLoading = false;
        }

      },
      error: () => {
        alert("API Error");
        this.isLoading = false;
      }
    });
  }

  onClose() {
    this.dialogRef.close('updated');
  }


}
