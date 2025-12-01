import { CommonModule } from '@angular/common';
import { Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AddFormulasComponent } from '../add-formulas/add-formulas.component';
import { PaycodeComponent } from "../../../common/paycode/paycode.component";
import { IFormulaRepository } from '../../../Repository/GlobalMasters/IFormulaRepository';
import { FormualService } from '../../../Service/GlobalMasters/formula.service';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Formula_TOKEN = new InjectionToken<IFormulaRepository>('Formula_TOKEN');

@Component({
  selector: 'app-formula',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginator, PaycodeComponent],
  templateUrl: './formula.component.html',
  styleUrl: './formula.component.css',
  providers: [{
    provide: Formula_TOKEN,
    useClass: FormualService,
  }
  ]
})
export class FormulaComponent {
  uploadedData: any[] = [];
  showTable: boolean = false;
  constructor(private dialog: MatDialog,
    @Inject(Formula_TOKEN) private formula: IFormulaRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }
  isLoading = false;
  paycodeUI: any;
  userdetail: any;


  uploadDisplayedColumns: string[] = [
    'Action',
    'SI No',
    'Company Code',
    'Pay Category',
    'Formula Name',
    'Formula'
  ];

  filterDisplayedColumns: string[] = [
    'filter_Action',
    'filter_SI No',
    'filter_Company Code',
    'filter_Pay Category',
    'filter_Formula Name',
    'filter_Formula'
  ];

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngOnInit(): void {
    const json = this._sessionStoreage.getItem('UserProfile');
    if (json) {
      this.userdetail = JSON.parse(this.decry.decrypt(json));
    }
    else {
      console.warn('UserProfile not found in the session Storage');
    }
    this.paycodeUI = {
      "paycode_Id": 0,
      "paycode_Code": "",
      "description": ""
    }

  }

  handlePaycodeEvent(paycode: any) {
    this.paycodeUI = paycode;
    console.log(this.paycodeUI);
  }


  onSearchClick() {
    this.showTable = true;
    this.isLoading = true;
    this.BindDashBoard(this.paycodeUI.paycode_Id);
  }

  BindDashBoard(paycode_Id: number) {
    this.formula.GetFormulaSearch(paycode_Id).subscribe({
      next: res => {
        if (!res.Data || res.Data.length === 0) {
          alert("No data available to display.");
          this.isLoading = false;
          return;
        }
        console.log(res.Data.data.Table0);
        this.uploadedDataSource = new MatTableDataSource<any>(res.Data.data.Table0);
        this.uploadedDataSource.paginator = this.paginator;
        this.uploadedDataSource.sort = this.sort;
        this.isLoading = false;
      },
      error: err => {
        console.error('Error fetching data:', err.message);
        this.isLoading = false;
      }
    });
  }

  AddPOOpen() {
    this.dialog.open(AddFormulasComponent, {
      width: '50%',
      height: '68vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
  view(row: any) {
    console.log('View clicked for:', row);
  }

  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.uploadedDataSource.filterPredicate = (data: any, filter: string) => {
      return data[column]?.toString().toLowerCase().includes(filter);
    };

    this.uploadedDataSource.filter = filterValue;
  }
}


