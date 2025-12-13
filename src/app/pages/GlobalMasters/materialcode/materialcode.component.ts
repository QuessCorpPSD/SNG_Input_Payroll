import { Component, resolveForwardRef, ViewChild } from '@angular/core';
import { CompanyComponent } from "../../../common/company/company.component";
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { MatHeaderCell, MatTableDataSource, MatTableModule } from "@angular/material/table";
import { MatPaginator, MatPaginatorModule } from "@angular/material/paginator";
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CreditNoteService } from '../../../Service/invoice/creditnote.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { MatCardModule } from "@angular/material/card";
import { GroupnameComponent } from "../../../common/groupname/groupname.component";
import { MaterialCodeService } from '../../../Service/GlobalMasters/MaterialCodeRepository.service';

@Component({
  selector: 'materialcode',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatButtonModule,
    //CompanyComponent,
    MatTooltipModule,
    MatCheckboxModule, MatCardModule],
  templateUrl: './materialcode.component.html',
  styleUrl: './materialcode.component.css'
})
export class MaterialcodeComponent {
  isLoading: boolean = false;
  userdetail: any;
  datatable: any;
  isAddclicked = false;
  iseditclicked = false;
  editData?: any;
  form!: FormGroup;
  Editform!: FormGroup;
  searchText: string = "";

  displayedColumns: string[] = [
    "delete",
    "edit",
    "Serial_No",
    "Code",
    "Description",
    "Is_Salary"
  ];

  dataSource = new MatTableDataSource<any>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private materialService: MaterialCodeService,
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService
  ) { }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter() {
    this.dataSource.filter = this.searchText.trim().toLowerCase();
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));
    this.form = this.fb.group({
      materialcode: ['', Validators.required],
      description: ['', Validators.required],
      issalary: [false]
    });

    this.Editform = this.fb.group({
      id:[''],
      materialcode: ['', Validators.required],
      description: ['', Validators.required],
      issalary: [false]
    });
    this.SearchClick();
  }

  SearchClick() {

    this.materialService.Search().subscribe({
      next: (res: any) => {
        console.log(res.Data);
        this.isLoading = false;

        if (res.StatusCode === 200 && Array.isArray(res.Data.data.Table0) && res.Data.data.Table0.length > 0) {
          this.dataSource.data = res.Data.data.Table0;

          setTimeout(() => {
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          });
          this.isLoading = false;

        } else {
          this.dataSource.data = [];
          this.isLoading = false;
          alert("No Records Found");

        }
      },

      error: (err) => {
        this.isLoading = false;
        console.error("API Error:", err);
        this.dataSource.data = [];
      }
    });
  }

  Addclicked(): void {
    this.isAddclicked = true;
  }
  closeclick() {
    this.isAddclicked = false;
    this.iseditclicked = false;
  }


  EditClick(rowData: any) {
    this.iseditclicked = true;
    this.editData = { ...rowData };
    this.Editform.patchValue({
      id: rowData.ID,
      materialcode: rowData.Code,
      description: rowData.Description,
      issalary: !!rowData.Is_Salary
    });
  }

  DeleteClick(rowData: any) {
    if (confirm("Are you sure you want to delete this?")) {
      const formValue = this.form.value;
      const MaterialCodeAdd = {
        SNo: 0,
        Id: rowData.ID,
        Code: 0,
        Description: "",
        IsSalary: "0"
      };

      const payload = {
        createdBy: this.userdetail.user_Id,
        mode: "Delete",
        detail: MaterialCodeAdd
      }
      console.log('PALOAD', payload);

      this.materialService.Create(payload).subscribe({
        next: (res) => {
          console.log(res);
          const errormsg = res.Data.data.Table0[0].Error_Message;

          if (errormsg.includes("Successfully")) {
            alert("Material Code Deleted Successfully");
            this.SearchClick();
          }
          else {
            alert(errormsg);
            this.form.reset({
              materialcode: '',
              description: '',
              issalary: false
            });
            this.isLoading = false;

          }
          error: (err) => {
            console.error("Error saving:", err);
          }
        }
      });
    }
  }


  SaveClick() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const formValue = this.form.value;
    const MaterialCodeAdd = {
      SNo: 0,
      Id: 0,
      Code: formValue.materialcode,
      Description: formValue.description,
      IsSalary: formValue.issalary ? "1" : "0"
    };

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Add",
      detail: MaterialCodeAdd
    }
    console.log('PALOAD', payload);


    this.materialService.Create(payload).subscribe({
      next: (res) => {
        console.log(res);
        const errormsg = res.Data.data.Table0[0].Error_Message;

        if (errormsg.includes("Successfully")) {
          this.isAddclicked = false;
          alert("Material Code Added Successfully");
          this.SearchClick();
        }
        else {
          alert(errormsg);
          this.form.reset({
            materialcode: '',
            description: '',
            issalary: false
          });
          this.isLoading = false;

        }
        error: (err) => {
          console.error("Error saving:", err);
        }
      }
    });
  }


  EditSaveClick() {
    if (this.Editform.invalid) {
      this.Editform.markAllAsTouched();
      return;
    }
    const formValue = this.Editform.value;
    const MaterialCodeAdd = {
      SNo: 0,
      Id: formValue.id,
      Code: formValue.materialcode,
      Description: formValue.description,
      IsSalary: formValue.issalary ? "1" : "0"
    };

    const payload = {
      createdBy: this.userdetail.user_Id,
      mode: "Edit",
      detail: MaterialCodeAdd
    }
    console.log('PALOAD', payload);


    this.materialService.Create(payload).subscribe({
      next: (res) => {
        console.log(res);
        const errormsg = res.Data.data.Table0[0].Error_Message;

        if (errormsg.includes("Successfully")) {
          this.iseditclicked = false;
          alert("Material Code Updated Successfully");
          this.SearchClick();
        }
        else {
          alert(errormsg);
          this.form.reset({
            id:'',
            materialcode: '',
            description: '',
            issalary: false
          });
          this.isLoading = false;

        }
        error: (err) => {
          console.error("Error saving:", err);
        }
      }
    });
  }

  Cancel() {
    this.isAddclicked = false;
    this.iseditclicked = false;
  }

  downloadExcelFromBase64(base64: string, filename: string) {
    this.isLoading = false;
    const source = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${base64}`;
    const downloadLink = document.createElement('a');
    downloadLink.href = source;
    downloadLink.download = filename;
    downloadLink.click();
  }

}
