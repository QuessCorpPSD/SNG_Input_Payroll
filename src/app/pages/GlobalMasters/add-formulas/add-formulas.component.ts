import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from "../../../common/CompanyAll/companyall.component";
import { IFormulaRepository } from '../../../Repository/GlobalMasters/IFormulaRepository';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { FormsModule } from '@angular/forms';
import { FormualService } from '../../../Service/GlobalMasters/formula.service';

export const Formula_TOKEN = new InjectionToken<IFormulaRepository>('Formula_TOKEN');

@Component({
  selector: 'app-add-formulas',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatIconModule, MatCardModule, CompanyallComponent, FormsModule],
  templateUrl: './add-formulas.component.html',
  styleUrl: './add-formulas.component.css',
  providers:[{
    provide: Formula_TOKEN,
    useClass: FormualService,
  }]
})
export class AddFormulasComponent {
  constructor(private dialogRef: MatDialogRef<AddFormulasComponent>,
        @Inject(Formula_TOKEN) private formula: IFormulaRepository,
        private decry: EncryptionService,
        private _sessionStoreage: SessionStorageService
  ) { }
  isUploadGridVisible = false;
  uploadedData: any[] = []; // your uploaded Excel data
  uploadedDataSource = new MatTableDataSource(this.uploadedData);
  selectedCompanyId: number = 0;
  companyUI: any;
  payCategory: any;
  selectedPayCategory: number = 0;
  payCode: any;
  selectedPayCode: number=0;
  Description: string ="";
  Formula: string = "";
  userdetail: any;

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.companyUI = company;
    console.log(this.companyUI);
    this.LoadpayCategory(this.selectedCompanyId);
    this.LoadpayCode();

  }

  LoadpayCategory(selectedCompanyId: number) {
    this.formula.payCategory(selectedCompanyId).subscribe({
      next: (res: any) => {
        if (res?.Data?.data?.Table0) {
          this.payCategory = res.Data.data.Table0;
        }
      },
      error: (err) => {
        console.error("Pick From API Error", err);
      }
    });
  }

  ChangepayCategory(paycategoryId: number){
    alert("Hi");
    console.log(this.selectedPayCategory);
      console.log(paycategoryId);
  }

  LoadpayCode() {
    this.formula.payCode().subscribe({
      next: (res: any) => {
        console.log(res);
        if (res?.Data) {
        this.payCode = res.Data;
        }
      },
      error: (err) => {
        console.error("Pick From API Error", err);
      }
    });
  }

  ChangepayCode(paycode_Id: number){
    console.log(this.selectedPayCode);
      console.log(paycode_Id);
  }
  

  /** Example close method */
  onClose(): void {
    this.dialogRef.close();
  }

  SaveClick(){
    // const detail = {
    //     "Paycode_Id": this.selectedPayCode,
    //     "Paycode_Code":
    //     "Formula_Name":
    //     "Formula":
    //     "Company_Id":
    //     "Company_Code":
    //     "PayCategory_Id":
    //     "Paycateory":
    // }

    const Payload = {
      "createdBy": this.userdetail.user_Id,
      "mode": "Add",
      //"detail": detail
    }
  }

}







