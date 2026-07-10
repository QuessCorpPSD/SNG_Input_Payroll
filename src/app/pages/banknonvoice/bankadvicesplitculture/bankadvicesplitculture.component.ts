import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { MatCardModule } from '@angular/material/card';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { debounceTime, distinctUntilChanged, finalize } from 'rxjs/operators';
import * as XLSX from 'xlsx';
import { BankAdviseSplitCultureService } from '../../../Service/banknonvoice/Bankadvisesplitculture.service';
@Component({
  selector: 'app-bankadvicesplitculture',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatAutocompleteModule, MatInputModule, MatFormFieldModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule, ReactiveFormsModule, CompanyallComponent, MatCardModule, MatCheckboxModule],
  templateUrl: './bankadvicesplitculture.component.html',
  styleUrl: './bankadvicesplitculture.component.css'
})
export class BankadvicesplitcultureComponent {
  Bank_Culture_Detail_id = '';
  Bank_Culture_id = '';
  vendorControl = new FormControl();
  filteredVendors: any[] = [];
  selectedVendor: any;
  isLoading: boolean = false;
  selectedCompanyId: any;
  Vendor: any;
  isAddClicked: boolean = false;
  iseditClicked: boolean = false;
  addBankAdviceSplitForm!: FormGroup;
  selectedRowSlNo: number | null = null;

  uploadDisplayedColumns: string[] = [
    'action', 'companycode', 'vendorname', 'groupname', 'splittype'];

  uploadedData: any[] = []; // No mock data

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);
  displayedColumns: string[] = ['select', 'groupName'];

  uploadedDataSource1 = new MatTableDataSource<any>([]);


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  userdetail: any;
  CompanyId: any;
  vendorList: any;

  constructor(private _decrypt: EncryptionService, private _sessionStoreage: SessionStorageService, public service: BankAdviseSplitCultureService) { }

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
  }

  handleCompany(company: any) {
    this.CompanyId = company.companyId;
    console.log(this.CompanyId)

  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    if (this.isAddClicked) {
      this.getgroupname();
    }
  }

  ngOnInit(): void {
    this.addBankAdviceSplitForm = new FormGroup({
      CompanyCode: new FormControl('', Validators.required),
      SplitType: new FormControl('', Validators.required),
    });

    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.vendorControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(value => {

        if (typeof value !== 'string') {
          return;
        }

        if (value.length < 3) {
          this.filteredVendors = [];
          return;
        }

        this.searchVendor(value);

      });
  }

  AddOpen() {
    //input.value = '';
    this.vendorControl.setValue('');
    this.filteredVendors = [];
    this.isAddClicked = true;
    this.selectedVendor = null;
    this.selectedCompanyId = '';
  }

  getgroupname(): void {

    if (!this.selectedCompanyId) {
      //alert('Please select Company.');
      return;
    }

    if (!this.selectedVendor?.Vendor_Id) {
      //alert('Please select Vendor.');
      return;
    }

    this.isLoading = true;

    this.service.getgroupname(
      this.selectedCompanyId,
      this.selectedVendor.Vendor_Id
    )
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (res: any) => {
          const tableData = (res?.Data?.data?.Table0 ?? []).map((item: any) => ({
            ...item,
            select: false
          }));

          this.uploadedDataSource1.data = tableData;
          if (!tableData.length) {
            alert('No group found.');
          }
        },
        error: (err: any) => {
          console.error(err);
          this.uploadedDataSource1.data = [];
          alert('Failed to fetch group names.');
        }
      });
  }


  closeclick() {
    this.addBankAdviceSplitForm.reset();
    this.uploadedDataSource1.data = [];
    this.filteredVendors = [];
    //this.selectedVendor = null;
    this.isAddClicked = false;
    this.iseditClicked = false;
    //this.selectedCompanyId = '';
    this.Bank_Culture_Detail_id = '';
    this.Bank_Culture_id = '';
    this.addBankAdviceSplitForm.get('CompanyCode')?.enable();
  }

  onEdit(row: any) {
    this.isAddClicked = true;
    this.iseditClicked = true;
    this.selectedRowSlNo = row.Sl_No;
    console.log(row);
    this.Bank_Culture_id = row.Bank_Culture_Id;
    this.Bank_Culture_Detail_id = row.Bank_Culture_Detail_id;
    this.selectedCompanyId = row.Company_Id;
    this.selectedVendor = {
      Vendor_Id: row.Vendor_Id,
      Vendor_Name: row.Vendor_Name
    };

    this.addBankAdviceSplitForm.get('CompanyCode')?.disable();
    this.addBankAdviceSplitForm.patchValue({
      CompanyCode: row.Company_Code,
      SplitType: row.Culture_Type
    });

    this.uploadedDataSource1.data = [
      {
        Group_Name: row.Group_Name,
        select: true,
        Group_Detail_Id: row.Group_Detail_Id
      }
    ];

  }

  onDelete(row: any) {
    if (!confirm('Are you sure you want to delete this record?')) {
      return;
    }

    console.log(row);
    const payload = {
      Company_Id: row.Company_Id,
      vendor_id: row.Vendor_Id,
      culture_type: row.Culture_Type,
      created_by: this.userdetail.user_Id,
      Bank_Culture_id: row.Bank_Culture_Id,
      Bank_Culture_Detail_id: row.Bank_Culture_Detail_id,
      mode: 'Delete'
    };
    console.log(payload);
    this.saveaction(payload);

  }

  onsearch(): void {

    if (!this.selectedCompanyId) {
      alert('Please select Company.');
      return;
    }

    if (!this.selectedVendor?.Vendor_Id) {
      alert('Please select Vendor.');
      return;
    }

    this.isLoading = true;

    const payload = {
      Company_Id: this.selectedCompanyId,
      vendor_id: this.selectedVendor.Vendor_Id,
      bankcultureid: 0,
      mode: 'Search'
    };

    this.service.getsearcheditdata(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 ?? [];

          this.uploadedData = tableData;
          this.uploadedDataSource.data = tableData;

          if (!tableData.length) {
            alert('No records found.');
          }

        },
        error: (err: any) => {

          console.error(err);

          this.uploadedData = [];
          this.uploadedDataSource.data = [];

          alert('Failed to fetch data.');

        }
      });
  }


  onexport(): void {

    if (!this.selectedCompanyId) {
      alert('Please select Company.');
      return;
    }

    if (!this.selectedVendor?.Vendor_Id) {
      alert('Please select Vendor.');
      return;
    }

    this.isLoading = true;

    const payload = {
      Company_Id: this.selectedCompanyId,
      vendor_id: this.selectedVendor.Vendor_Id,
      bankcultureid: 0,
    };

    this.service.getsearcheditdataExport(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {

          const tableData = res?.Data?.data?.Table0 ?? [];

          if (!tableData.length) {
            alert('No records found.');
            return;
          }

          this.exportDataToExcel(tableData, 'bank_split_culture');
        },
        error: (err: any) => {

          console.error(err);

          alert('Failed to fetch data.');

        }
      });
  }

  onSave(): void {

    console.log(this.addBankAdviceSplitForm.value);

    if (this.addBankAdviceSplitForm.invalid) {
      this.addBankAdviceSplitForm.markAllAsTouched();
      return;
    }

    if (!this.selectedVendor?.Vendor_Id) {
      alert('Please select Vendor.');
      return;
    }

    console.log(this.uploadedDataSource1.data)
    const selectedGroups = this.uploadedDataSource1.data
      .filter((x: any) => x.select)
      .map((x: any) => x.Group_Detail_Id);

    if (selectedGroups.length === 0) {
      alert('Please select at least one Group.');
      return;
    }

    var formdata = this.addBankAdviceSplitForm.value;

    // const groupdetail = selectedGroups.map((id: any) => ({
    //   Group_Detail_Id: id
    // }));
    const groupdetail = selectedGroups.join(',');

    if (this.iseditClicked) {
      const payload = {
        Company_Id: this.selectedCompanyId,
        vendor_id: this.selectedVendor.Vendor_Id,
        culture_type: formdata.SplitType,
        created_by: this.userdetail.user_Id,
        Bank_Culture_id:this.Bank_Culture_id,
        Bank_Culture_Detail_id:this.Bank_Culture_Detail_id,
        mode: this.iseditClicked ? 'Edit' : 'Add'
      };

      this.saveaction(payload);
    } else {
      const payload = {
        Company_Id: this.selectedCompanyId,
        vendor_id: this.selectedVendor.Vendor_Id,
        culture_type: formdata.SplitType,
        created_by: this.userdetail.user_Id,
        Bank_Culture_id:0,
        Bank_Culture_Detail_id:0,
        mode: this.iseditClicked ? 'Edit' : 'Add'
      };

      payload['groupdetail'] = groupdetail;

      this.saveaction(payload);
    }

  }


  saveaction(payload: any): void {
    this.isLoading = true;

    this.service.createbankadvisesplitculture(payload)
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (res: any) => {
          alert(res?.Data.data.Table0[0]['Error_Message'] || 'Saved successfully.');
          
          this.closeclick();
          this.onsearch();

        },
        error: (err: any) => {
          this.closeclick();
          console.error(err);
          alert('Failed to save.');

        }
      });
  }

  searchVendor(value: string): void {
    if (value.length < 3) {
      this.filteredVendors = [];
      return;
    }

    this.service.getvendor(value, this.selectedCompanyId).subscribe({
      next: (res: any) => {
        this.filteredVendors = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        this.filteredVendors = [];
      }
    });

  }

  onVendorSelected(vendor: any): void {
    this.selectedVendor = vendor;
    if (this.isAddClicked) {
      this.getgroupname();
    }
  }

  displayVendor(vendor: any): string {
    return vendor ? vendor.Vendor_Name : '';
  }

  clearVendor(input: HTMLInputElement): void {

    input.value = '';

    this.vendorControl.setValue('');

    this.filteredVendors = [];

    this.selectedVendor = null;

  }

  ImportClick(fileInput: HTMLInputElement): void {
    fileInput.value = '';
    fileInput.click();
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) {
      alert('Please select a file.');
      return;
    }

    const file = input.files[0];

    const allowedExtensions = ['xlsx', 'xls'];
    const extension = file.name.split('.').pop()?.toLowerCase();

    if (!allowedExtensions.includes(extension || '')) {
      alert('Only Excel files (.xls/.xlsx) are allowed.');
      input.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('created_by', this.userdetail.user_Id);

    this.isLoading = true;

    this.service.uploadbankadvisesplitculture(formData)
      .pipe(finalize(() => {
        this.isLoading = false;
        input.value = '';
      }))
      .subscribe({

        next: (res) => {

          if (!res?.Data) {
            alert('Server returned no data.');
            return;
          }

          const response = res.Data.vaildation ?? '';

          if (response.includes('Row(s) Uploaded Successfully.')) {
            alert('Rows Uploaded Successfully.');
            return;
          }

          if (response.includes('Failed to import.')) {

            alert('Failed to Import.');

            const rawErr = res.Data.errors?.[0];

            let errorArray: any[] = [];

            try {

              if (typeof rawErr === 'string') {

                const parsed = JSON.parse(rawErr);

                errorArray = Array.isArray(parsed)
                  ? parsed
                  : [parsed];

              } else {

                errorArray = Array.isArray(rawErr)
                  ? rawErr
                  : rawErr
                    ? [rawErr]
                    : [];

              }

            } catch {

              errorArray = rawErr
                ? [{ Error_Message: String(rawErr) }]
                : [];

            }

            const exportData = errorArray.map((x: any) => ({
              Error_Message: x.Error_Message || x.Validation || ''
            }));

            const worksheet = XLSX.utils.json_to_sheet(exportData);

            const workbook = {
              Sheets: {
                ErrorMessages: worksheet
              },
              SheetNames: ['ErrorMessages']
            };

            XLSX.writeFile(workbook, 'ErrorMessages.xlsx');

          }

        },
        error: (err) => {
          console.error(err);
          alert('Upload failed.');
        }

      });
  }

  exportDataToExcel(data: any[], filename) {
    import('xlsx').then(xlsx => {
      const worksheet = xlsx.utils.json_to_sheet(data);
      const workbook = { Sheets: { 'Users': worksheet }, SheetNames: ['Users'] };

      // const excelBuffer = xlsx.write(workbook, {
      //   bookType: 'xlsx',
      //   type: 'array'
      // });

      xlsx.writeFile(workbook, `${filename}_${new Date().getTime()}.xlsx`);
      alert('Exported Successfully.');

      // this.saveFile(excelBuffer, filename);
    });
  }

  saveFile(buffer: any, filename: any) {
    import('file-saver').then(FileSaver => {
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
      });

      // FileSaver.saveAs(blob, `${filename}${new Date().getTime()}.xlsx`);
    });
  }

}
