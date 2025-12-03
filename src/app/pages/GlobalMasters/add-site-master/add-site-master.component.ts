import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EncryptionService } from '../../../Shared/encryption.service';
import { VendorMasterService } from '../../../Service/GlobalMasters/vendor-master.service';
import { SiteMasterService } from '../../../Service/GlobalMasters/site-master.service';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { IsiteMaster } from '../../../Repository/GlobalMasters/IsiteMaster';

export const SiteMaster_TOKEN = new InjectionToken<IsiteMaster>('SiteMaster_TOKEN');

@Component({
  selector: 'app-add-site-master',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatTooltipModule,
    MatTableModule,
    MatCardModule,
    CompanyallComponent,
    ReactiveFormsModule,
    FormsModule,
    AlertpopupComponent
  ],
  templateUrl: './add-site-master.component.html',
  styleUrl: './add-site-master.component.css',
})
export class AddSiteMasterComponent {

  siteForm!: FormGroup;
  SiteEditForm!: FormGroup;

  selectedCompanyId!: number;
  selectedCompanyCode: any;
  userdetail: any;

  vendorList: any[] = [];
  payslipFormatList: any[] = [];

  showPopup = false;
  popupMessage = '';
  popupSubMessage = '';
  isLoading = false;

  Edit = false;

  constructor(
    private dialogRef: MatDialogRef<AddSiteMasterComponent>,
    @Inject(MAT_DIALOG_DATA) public editSiteData: any,

    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    private vendorService: VendorMasterService,
    private siteService: SiteMasterService
  ) { }
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


  ngOnInit(): void {

    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }



    this.siteForm = new FormGroup({
      CompanyCode: new FormControl("", Validators.required),
      VendorName: new FormControl("", Validators.required),
      GroupName: new FormControl("", Validators.required),
      WBS: new FormControl("", Validators.required),
      SAPCustomerCode: new FormControl("", Validators.required),
      SAPCustomerName: new FormControl("", Validators.required),
      WBS2: new FormControl("", Validators.required),
      WBSName: new FormControl("", Validators.required),
      EstablishmentName: new FormControl("", Validators.required),
      EstablishmentAddress1: new FormControl("", Validators.required),
      PrincipalEmployerName: new FormControl("", Validators.required),
      PrincipalEmployeAddress1: new FormControl("", Validators.required),
      ContractorName: new FormControl("", Validators.required),
      ContractorAddress1: new FormControl("", Validators.required),
      PayslipFormat: new FormControl("", Validators.required),
      IsLeaveApplicable: new FormControl("", Validators.required),
      Active: new FormControl("", Validators.required),
      IsBonusPayThroughFFDisplay: new FormControl("", Validators.required),
      StartDate: new FormControl("", Validators.required),
      SalaryDate: new FormControl("", Validators.required),
      PortalPayslipFormat: new FormControl("", Validators.required),
      Value: new FormControl("", Validators.required),
    });


    this.SiteEditForm = new FormGroup({
      CompanyCode: new FormControl("", Validators.required),
      VendorName: new FormControl("", Validators.required),
      GroupName: new FormControl("", Validators.required),
      WBS: new FormControl("", Validators.required),
      SAPCustomerCode: new FormControl("", Validators.required),
      SAPCustomerName: new FormControl("", Validators.required),
      WBS2: new FormControl("", Validators.required),
      WBSName: new FormControl("", Validators.required),
      EstablishmentName: new FormControl("", Validators.required),
      EstablishmentAddress1: new FormControl("", Validators.required),
      PrincipalEmployerName: new FormControl("", Validators.required),
      PrincipalEmployeAddress1: new FormControl("", Validators.required),
      ContractorName: new FormControl("", Validators.required),
      ContractorAddress1: new FormControl("", Validators.required),
      PayslipFormat: new FormControl("", Validators.required),
      IsLeaveApplicable: new FormControl("", Validators.required),
      Active: new FormControl("", Validators.required),
      IsBonusPayThroughFFDisplay: new FormControl("", Validators.required),
      StartDate: new FormControl("", Validators.required),
      SalaryDate: new FormControl("", Validators.required),
      PortalPayslipFormat: new FormControl("", Validators.required),
      Value: new FormControl("", Validators.required)
    });



    if (this.editSiteData?.mode?.toLowerCase() === "edit") {
      this.Edit = true;

      const row = this.editSiteData.row;



      this.SiteEditForm.patchValue({
        CompanyCode: row.Company_Code,
        VendorName: row.Client_Id,
        GroupName: row.Group_Name,
        WBS: row.CostCenter_Id,
        SAPCustomerCode: row.SAP_Cust_Code,
        SAPCustomerName: row.SAP_Cust_Name,
        WBS2: row.WBS2,
        WBSName: row.WBS_Name,
        EstablishmentName: row.Establishment_Name,
        EstablishmentAddress1: row.Establishment_Adress1,
        PrincipalEmployerName: row.Principal_Employer_Name,
        PrincipalEmployeAddress1: row.Principal_Employe_Address1,
        ContractorName: row.Contractor_Name,
        ContractorAddress1: row.Contractor_Address1,
        PayslipFormat: row.PAYSLIP_FORMAT_Id,
        IsLeaveApplicable: row.LeaveApplicable === "Yes" || row.Isleave_Applicable === true ? "1" : "0",
        Active: row.Value ? "1" : "0",
        IsBonusPayThroughFFDisplay: row.IsBonusPayThroughFF === 1 ? "1" : "0",
        StartDate: row.StartDate ? row.StartDate.substring(0, 10) : "",
        SalaryDate: row.SalaryDate,
        PortalPayslipFormat: row.Portal_Payslip_Format,
        Value: row.Active === "Yes" || row.Active === true ? "1" : "0",
      });

      console.log(this.editSiteData);
    }

    this.loadVendorList();
    this.loadPayslipFormats();
  }


  loadVendorList() {
    this.vendorService.VendorSearch().subscribe((res: any) => {
      this.vendorList = res?.Data?.data?.Table0 || [];
    });
  }

  loadPayslipFormats() {
    this.siteService.GetPortalPayslipFormat().subscribe({
      next: (res: any) => {
        this.payslipFormatList = res?.Data || [];
      }
    });
  }


  onSave() {
    if (this.siteForm.invalid) {
      this.siteForm.markAllAsTouched();
      return;
    }

    const f = this.siteForm.value;

    const payload = {
      Action: "Add",
      UserId: this.userdetail.user_Id?.toString(),
      Group_Id: 0,
      Group_Detail_Id: 0,
      Company_Id: this.selectedCompanyId || 0,
      Group_Name: f.GroupName,
      Client_Id: String(f.VendorName),
      CostCenter_Id: f.WBS,
      Establishment_Name: f.EstablishmentName,
      Establishment_Adress1: f.EstablishmentAddress1,
      Principal_Employer_Name: f.PrincipalEmployerName,
      Principal_Employe_Address1: f.PrincipalEmployeAddress1,
      Contractor_Name: f.ContractorName,
      Contractor_Address1: f.ContractorAddress1,
      PAYSLIP_FORMAT_Id: Number(f.PayslipFormat),
      PAYSLIP_FORMAT: Number(f.PayslipFormat),
      IsBonusPayThroughFF: Number(f.IsBonusPayThroughFFDisplay),
      LeaveApplicable: Number(f.IsLeaveApplicable),
      StartDate: f.StartDate,
      SAP_Cust_Code: f.SAPCustomerCode,
      SAP_Cust_Name: f.SAPCustomerName,
      WBSCostCenter: f.WBS,
      WBS2: f.WBS2,
      WBS_Name: f.WBSName,
      Active: Number(f.Active),
      SalaryDate: f.SalaryDate,
      Portal_Payslip_Format: f.PortalPayslipFormat,
      Value: Number(f.Active)
    };

    console.log("FINAL PAYLOAD:", JSON.stringify(payload));

    this.siteService.CreateSiteMaster(payload).subscribe({
      next: (res: any) => {

        console.log("API Response:", res);

        if (res?.StatusCode === 200) {


          if (res.Data?.response) {
            alert(res.Data.response);
          }

          else {
            alert(JSON.stringify(res, null, 2));
          }

          this.dialogRef.close(true);
        }
      }
    });

  }
  onUpdate() {

    const row = this.editSiteData.row;
    const formvalue = this.SiteEditForm.getRawValue();

    console.log('formvalue',formvalue);

    const payload = {
      
        Action: "Edit",
        UserId: String(this.userdetail.user_Id),        
        Company_Id: row.Company_Id,
        Group_Id: row.Group_Id,                       
        Group_Detail_Id: row.Group_Detail_Id,         
        Group_Name: formvalue.GroupName,              
        Client_Id: row.Client_Id, 
        CostCenter_Id: row.CostCenter_Id,
        Establishment_Name: formvalue.EstablishmentName,
        Establishment_Adress1: formvalue.EstablishmentAddress1,
        Principal_Employer_Name: formvalue.PrincipalEmployerName,
        Principal_Employe_Address1: formvalue.PrincipalEmployeAddress1,
        Contractor_Name: formvalue.ContractorName,
        Contractor_Address1: formvalue.ContractorAddress1, 
        PAYSLIP_FORMAT_Id: Number(formvalue.PayslipFormat),
        PAYSLIP_FORMAT: Number(formvalue.PayslipFormat),
        IsBonusPayThroughFF: Number(formvalue.IsBonusPayThroughFFDisplay),
        LeaveApplicable: Number(formvalue.IsLeaveApplicable),        
        SAP_Cust_Code: formvalue.SAPCustomerCode,
        SAP_Cust_Name: formvalue.SAPCustomerName,
        WBS2: formvalue.WBS2,
        WBS_Name: formvalue.WBSName,   
        StartDate: formvalue.StartDate,
        SalaryDate: formvalue.SalaryDate,
        Portal_Payslip_Format: formvalue.PortalPayslipFormat,
        Value: Number(formvalue.Active),
      
    };

    console.log("FINAL EDIT PAYLOAD:", JSON.stringify(payload));

    this.siteService.CreateSiteMaster(payload).subscribe({
      next: (res: any) => {
        if (res?.StatusCode === 200) {
          alert(res.Data?.response || "Updated successfully");
          this.dialogRef.close('updated');
        }
      }
    });
  }


  handleCompanyEvent(company) {
    console.log("Selected company:", company);

    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

    this.siteForm.patchValue({
      CompanyCode: company.companyCode
    });
  }



  onClose() {
    this.dialogRef.close('updated');
  }
  onCancel() {
    this.siteForm.reset();
    this.showPopup = false;
    this.dialogRef.close(false);
  }

}
