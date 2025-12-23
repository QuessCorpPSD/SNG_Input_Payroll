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
  selector: 'app-add-formulas',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatIconModule,
    MatCardModule,
    CompanyallComponent,
    ReactiveFormsModule,
    FormsModule,
    AlertpopupComponent
  ],
  templateUrl: './add-formulas.component.html',
  styleUrl: './add-formulas.component.css',
  providers: [{
    provide: Formula_TOKEN,
    useClass: FormualService,
  }]
})
export class AddFormulasComponent {

  constructor(
    private dialogRef: MatDialogRef<AddFormulasComponent>,
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


  payCategory: any[] = [];
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

    this.addformula = new FormGroup({
      CompanyId: new FormControl("", Validators.required),
      PayCategory: new FormControl("", Validators.required),
      PayCode: new FormControl("", Validators.required),
      Description: new FormControl(""),
      Formula: new FormControl("", Validators.required)
    });

    this.editFormula = new FormGroup({
      CompanyId: new FormControl("", Validators.required),
      PayCategory: new FormControl("", Validators.required),
      PayCode: new FormControl("", Validators.required),
      Description: new FormControl(""),
      Formula: new FormControl("", Validators.required)
    });


    if (this.editData?.mode?.toLowerCase() === "edit") {
      this.Edit = true;

      const row = this.editData.row;

      this.editFormula.patchValue({
        CompanyId: row.Company_Code,
        PayCategory: row.Paycateory,
        PayCode: row.Paycode_Code,
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

    this.LoadpayCategory(this.selectedCompanyId);
    this.LoadpayCode();
  }



  LoadpayCategory(companyId: number) {
    this.formula.payCategory(companyId).subscribe({
      next: (res: any) => {

        if (res?.Data?.data?.Table0) {
          this.payCategory = res.Data.data.Table0;
        }
      },
      error: err => console.error(" Pay Category API Error:", err)
    });
  }

  ChangepayCategory(selected: any) {
    this.selectedPayCategory = selected;
    this.val_category = false;
  }


  LoadpayCode() {
    this.formula.payCode().subscribe({
      next: (res: any) => {
        if (res?.Data) {
          this.payCode = res.Data;
        }
      },
      error: err => console.error(" Pay Code API Error:", err)
    });
  }

  ChangepayCode(paycodeId: number) {
    this.selectedPayCode = paycodeId;
    this.val_paycode = false;
  }



  SaveClick() {

    if (!this.selectedCompanyId ||
      !this.selectedPayCategory ||
      !this.selectedPayCode ||
      !this.Formula?.trim()) {
      alert("Please fill all required fields.");
      return;
    }
    this.isLoading = true;
    const pc = this.payCode.find(x => x.paycode_Id == this.selectedPayCode);

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Add",
      detail: {
        Formula_Id: 0,
        Paycode_Id: Number(this.selectedPayCode),
        Paycode_Code: pc?.paycode_Code || "",
        Formula_Name: this.Description?.trim() || "Formula",
        Formula: this.Formula?.trim() || "",
        Company_Id: this.selectedCompanyId,
        Company_Code: this.companyUI?.companyCode || "",
        PayCategory_Id: this.selectedPayCategory?.Band_Id || 0,
        Paycateory: this.selectedPayCategory?.Band_Name || "",
        Error_Message: "",
        SNo: 0
      }
    };
    this.formula.CreateFormula(payload).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        if (res?.StatusCode === 200) {
          alert(res?.Data?.message || "Formula saved successfully");
          this.dialogRef.close(true);
        } else {
          alert("Save failed");
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
        Paycateory: row.Paycateory,
        Error_Message: "",
        SNo: row.SNo
      }
    };
    this.formula.CreateFormula(payload).subscribe({
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
