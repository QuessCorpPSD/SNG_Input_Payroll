import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import * as XLSX from 'xlsx';
import { Observable, finalize, map, startWith } from 'rxjs';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';
import { CompanyallComponent } from '../../../common/CompanyAll/companyall.component';
import { IPermHireServiceCharge } from '../../../Repository/customer/IPermhireServiceCharge.service';
import { PermhireservicechargetypeService } from '../../../Service/CUSTOMER/permhireservicechargetype.service';

export const Pay_Token = new InjectionToken<IPermHireServiceCharge>('Pay_Token');

@Component({
  selector: 'app-perm-hire-service-charge',
  standalone: true,
  imports: [
    CommonModule, MatIconModule, MatTooltipModule, MatTableModule,
    MatPaginatorModule, FormsModule, ReactiveFormsModule, MatCard,
    MatCardModule, MatCheckboxModule, CompanyallComponent,
    MatAutocompleteModule, MatInputModule, MatFormFieldModule
  ],
  templateUrl: './perm-hire-service-charge.component.html',
  styleUrl: './perm-hire-service-charge.component.css',
  providers: [
    {
      provide: Pay_Token, useClass: PermhireservicechargetypeService,
    }
  ]
})
export class PermHireServiceChargeComponent {
  showTable = false;
  selectedCompanyId!: number;
  selectedCompanyCode: any;
  userdetail: any;
  searchText: string = "";
  dataSource = new MatTableDataSource<any>();
  isLoading = false;
  addPermMaster!: FormGroup;
  isEditMode: boolean = false;
  isAddclicked: boolean = false;
  permHireSearch: any;
  selectedMN: any;
  mapnameUI: any;
  typeList: any[] = [];
  categoryList: any[] = [];

  // Map Name autocomplete
  mapControl = new FormControl<string | any>('');
  mapNames: any[] = [];
  filteredMapOptions$!: Observable<any[]>;
  displayMapFn = (option: any): string => option?.Map_Name ?? '';

  constructor(
    private _decrypt: EncryptionService,
    private _sessionStoreage: SessionStorageService,
    @Inject(Pay_Token) private service: IPermHireServiceCharge
  ) { }

  uploadDisplayedColumns: string[] = [
    'action',
    'slNo',
    'mapname',
    'type',
    'typeValue',
    'typeValue1',
    'category',
    'from',
    'to',
    'value',
    'capValue',
    'effectiveDate'
  ];

  uploadedData: any[] = [];
  jobCategoryList: any[] = [];
  jobSubCategoryList: any[] = [];
  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  handleCompanyEvent(company) {
    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;
  }

  handleCompanyEvent2(company: any) {
    if (!company) return;

    this.selectedCompanyId = company.companyId;
    this.selectedCompanyCode = company.companyCode;

    this.addPermMaster.patchValue({
      COMPANY_ID: company.companyId,
      companyCode: company.companyCode,
      Clientname: company.companyName
    });

    this.getType();
    this.getCategory();
    this.getMapNames();
  }

  ngOnInit(): void {
    const userdetail = this._sessionStoreage.getItem('UserProfile');
    this.userdetail = JSON.parse(this._decrypt.decrypt(userdetail!));

    this.addPermMaster = new FormGroup({
      QRSId: new FormControl(''),
      COMPANY_ID: new FormControl(''),
      companyCode: new FormControl(''),
      Clientname: new FormControl(''),

      mapId: new FormControl(0),
      mapname: new FormControl(''),

      typeId: new FormControl(''),
      type: new FormControl(''),

      typeValueId: new FormControl(''),
      typeValue: new FormControl(''),

      typeValue1Id: new FormControl(''),
      typeValue1: new FormControl(''),

      categoryId: new FormControl(''),
      category: new FormControl(''),

      from: new FormControl(''),
      to: new FormControl(''),
      value: new FormControl(''),
      capValue: new FormControl(''),
      effectiveDate: new FormControl('')
    });
    this.addPermMaster.get('typeId')?.valueChanges.subscribe((typeId: any) => {
      this.addPermMaster.patchValue({
        typeValueId: '',
        typeValue1Id: ''
      });
      this.jobCategoryList = [];
      this.jobSubCategoryList = [];
      if (typeId) {
        this.getJobCategoryList();
      }
    });
    this.addPermMaster.get('typeValueId')?.valueChanges.subscribe((jobCatId: any) => {
      this.addPermMaster.patchValue({ typeValue1Id: '' });
      this.jobSubCategoryList = [];
      if (jobCatId) {
        this.getJobSubCategoryList(jobCatId);
      }
    });
  }

  getType() {
    this.service.GetPermHireServiceChargeType().subscribe({
      next: (res) => {
        this.typeList = (res?.Data?.data?.Table0 || [])
          .filter((x: any) => x.QRS_Service_Charge_Type_Id !== 0);
      },
      error: (err) => {
       // console.error('Error loading Type', err);
      }
    });
  }

  getCategory() {
    this.service.GetPermHireServiceChargeCategory().subscribe({
      next: (res) => {
        this.categoryList = (res?.Data?.data?.Table0 || [])
          .filter((x: any) => x.QRS_Service_Charge_Category_Id !== 0);
      },
      error: (err) => {
        //console.error('Error loading Category', err);
      }
    });
  }

  getMapNames() {
    if (!this.selectedCompanyId) return;

    this.service.GetMapNameByCompany(this.selectedCompanyId).subscribe({
      next: (res) => {
        const list = res?.Data?.data?.Table0 || [];

        // ⭐ Use API fields: Map_Name + Cost_Center_Mapping_Id
        this.mapNames = [
          { Cost_Center_Mapping_Id: 0, Map_Name: 'ALL' },
          ...list
        ];

        this.filteredMapOptions$ = this.mapControl.valueChanges.pipe(
          startWith(''),
          map(value => {
            const text = typeof value === 'string'
              ? value
              : (value?.Map_Name ?? '');
            return this._filterMap(text);
          })
        );
      },
      error: (err) => {
        //console.error('Error loading Map Names', err);
      }
    });
  }
  getJobCategoryList() {
    if (!this.selectedCompanyId) return;

    const payload = {
      Type: 'JOB CATEGORY WISE',
      CompanyId: this.selectedCompanyId
    };

    this.service.GetPermHireServiceChargeJobCategory(payload).subscribe({
      next: (res) => {
        this.jobCategoryList = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        //console.error('Error loading Job Category', err);
      }
    });
  }

  getJobSubCategoryList(jobCategoryId: any) {
    if (!this.selectedCompanyId) return;

    const payload = {
      Type: 'JOB SUB CATEGORY WISE',
      CompanyId: this.selectedCompanyId,
      JobCategoryId: jobCategoryId || 0
    };

    this.service.GetPermHireServiceChargeJobSubCategory(payload).subscribe({
      next: (res) => {
        this.jobSubCategoryList = res?.Data?.data?.Table0 || [];
      },
      error: (err) => {
        //console.error('Error loading Job Sub Category', err);
      }
    });
  }

  private _filterMap(value: string): any[] {
    const filterValue = (value || '').toLowerCase();
    return this.mapNames.filter(o =>
      (o.Map_Name || '').toLowerCase().includes(filterValue)
    );
  }

  onMapSelected(option: any) {
    this.selectedMN = option.Map_Name;
    this.mapnameUI = option;

    this.addPermMaster.patchValue({
      mapId: option.Cost_Center_Mapping_Id || 0,
      mapname: option.Map_Name
    });
  }

  applyFilters() {
    const filterValue = this.searchText?.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }

  closeclick() {
    this.isAddclicked = false;
  }

  onsearch() {
    if (!this.selectedCompanyId) {
      alert('Please select company code');
      return;
    }
    this.showTable = true;
    this.isLoading = true;

    this.service.GetPermHireServiceChargeSearch(this.selectedCompanyId).pipe(
      finalize(() => {
        this.isLoading = false;
      })
    ).subscribe({
      next: (res) => {
        this.permHireSearch = res.Data?.data?.Table0;
        if (this.permHireSearch && this.permHireSearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.permHireSearch);
          this.dataSource.paginator = this.paginator;
          this.uploadDisplayedColumns = [
            'action',
            'slNo',
            'mapname',
            'type',
            'typeValue',
            'typeValue1',
            'category',
            'from',
            'to',
            'value',
            'capValue',
            'effectiveDate'
          ];
        } else {
          this.dataSource.data = [];
          alert('No data found');
        }
      },
      error: (err) => {
        //console.error('Error loading perm hire service charge data', err);
        alert('Failed to load perm hire service charge data');
      },
    });
  }

  exportToExcelsave(data: any[]) {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const workbook: XLSX.WorkBook = {
      Sheets: { 'Result': worksheet },
      SheetNames: ['Result']
    };
    XLSX.writeFile(workbook, 'PermHireServiceCharge_Result.xlsx');
  }

  onSave() {
    const formValue = this.addPermMaster.getRawValue();

    const payload = {
      CompanyId: Number(formValue.COMPANY_ID),
      CreatedBy: String(this.userdetail.user_Id),
      Flag: 'Add',

      Rows: [
        {
          QRS_Service_Charge_Id: Number(formValue.QRSId) || 0,

          Cost_Center_Mapping_Id:
            Number(formValue.mapId) || 0,

          QRS_Service_Charge_Type_Id:
            Number(formValue.typeId) || 0,

          QRS_Service_Charge_Type_Value_Id:
            String(formValue.typeValueId || 0),

          QRS_Service_Charge_Type_Value1_Id:
            String(formValue.typeValue1Id || 0),

          QRS_Service_Charge_Category_Id:
            Number(formValue.categoryId) || 0,

          From:
            Number(formValue.from) || 0,

          To:
            Number(formValue.to) || 0,

          Value:
            String(formValue.value || '0'),

          Cap_Value:
            String(formValue.capValue || '0'),

          Effective_Date:
            this.formatDateYYYYMMDD(formValue.effectiveDate)
        }
      ]
    };

    this.isLoading = true;

    this.service
      .CreateUpdateDelete_PermHireServiceCharge(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {
          const message = response?.Data?.data?.response;
          alert(message);

          if (response?.StatusCode === 200 && response?.Data?.data?.response) {
            this.isAddclicked = false;
            this.onsearch();
          }
        },

        error: (error: any) => {
          const message =
            error?.error?.Data?.data?.response ||
            error?.error?.Message ||
            error?.error?.message;

          alert(message);
        }
      });
  }


  private formatDateYYYYMMDD(value: any): string | null {

    if (!value) {
      return null;
    }

    // Already yyyy-MM-dd
    if (
      typeof value === 'string' &&
      /^\d{4}-\d{2}-\d{2}$/.test(value)
    ) {
      return value;
    }

    const date = new Date(value);

    if (isNaN(date.getTime())) {
      return null;
    }

    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }

  openAdd() {
    this.isAddclicked = true;
    this.isEditMode = false;
    this.addPermMaster.enable();
    this.addPermMaster.reset();
    this.addPermMaster.patchValue({ QRSId: 0, mapId: 0 });

    if (this.selectedCompanyId) {
      this.getType();
      this.getCategory();
      this.getMapNames();
    }
  }
  deleteRow(row: any) {

    const payload = {
      CompanyId: Number(row.Company_Id),
      CreatedBy: String(this.userdetail.user_Id),
      Flag: 'Delete',
      Rows: [
        {
          QRS_Service_Charge_Id: Number(row.QRS_Service_Charge_Id)
        }
      ]
    };

    this.isLoading = true;

    this.service.CreateUpdateDelete_PermHireServiceCharge(payload)
      .pipe(
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe({
        next: (response: any) => {

          const message = response?.Data?.data?.response;

          alert(message);

          if (
            response?.StatusCode === 200 &&
            response?.Data?.data?.response
          ) {
            this.onsearch();
          }
        },

        error: (error: any) => {

          const message =
            error?.error?.Data?.data?.response ||
            error?.error?.Message ||
            error?.error?.message;

          alert(message);
        }
      });
  }
}