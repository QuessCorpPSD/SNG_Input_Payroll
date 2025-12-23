import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, ViewChild, viewChild, InjectionToken } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { data } from 'jquery';
import { PaycodeaddComponent } from '../paycodeadd/paycodeadd.component';
import { MatDialog } from '@angular/material/dialog';
import { A11yModule } from "@angular/cdk/a11y";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { PaycodeserviceService } from '../../../Service/GlobalMasters/paycodeservice.service';
import { MatSort } from '@angular/material/sort';
import * as XLSX from 'xlsx';
import { IPAycodeService } from '../../../Repository/GlobalMasters/Ipaycode.service';
import { MatCardTitle } from "@angular/material/card";
import { AlertpopupComponent } from "../../../common/alertpopup/alertpopup.component";

export const Paycode_TOKEN = new InjectionToken<IPAycodeService>('Paycode_TOKEN');
@Component({
  selector: 'app-paycodes',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginator, FormsModule, ReactiveFormsModule, MatCardTitle, AlertpopupComponent],
  templateUrl: './paycodes.component.html',
  styleUrl: './paycodes.component.css',
  providers: [{
    provide: Paycode_TOKEN,
    useClass: PaycodeserviceService
  }]
})
export class PaycodesComponent implements AfterViewInit {
  paytype: any;
  Paycodeform!: FormGroup;
  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = [];
  dynamicColumns: string[] = [];
  tableHeaders: string[] = [];
  @ViewChild(MatSort) sort!: MatSort;
  paySearch: any;
  pagetype: any;
  paycode: any;
  PayType: any;
  Taxable: any;

  isLoading: boolean = false;
  showPopup: boolean = false;
  popupMessage: string = '';
  popupSubMessage: string = '';

  constructor(@Inject(Paycode_TOKEN) private payCode: PaycodeserviceService, private dialog: MatDialog) { }

  showTable = false;

  uploadDisplayedColumns: string[] = ['slNo', 'payCode', 'description', 'printAs', 'payType', 'taxable', 'projectTax', 'marginalTax', 'payCodeType', 'lopApplicable', 'pfApplicable', 'esiApplicable', 'ptApplicable', 'pageType', 'accountNumber', 'postingKey'];

  uploadFilteredColumns: string[] = ['slNoFilter', 'payCodeFilter', 'descriptionFilter', 'printAsFilter', 'payTypeFilter', 'taxableFilter', 'projectTaxFilter', 'marginalTaxFilter', 'payCodeTypeFilter', 'lopApplicableFilter', 'pfApplicableFilter', 'esiApplicableFilter', 'ptApplicableFilter', 'pageTypeFilter', 'accountNumberFilter', 'postingKeyFilter'];

  uploadedData: any[] = [];

  uploadedDataSource = new MatTableDataSource<any>(this.uploadedData);

  filterValues: any = {
    slNo: '', payCode: '', description: '', payType: '', taxable: '', accountNumber: ''
  };

  @ViewChild('paginator') paginator!: MatPaginator;

  ngOnInit(): void {
    this.BindPayType();

    this.Paycodeform = new FormGroup({
      payCode: new FormControl('', Validators.required),
      payType: new FormControl(''),
      taxable: new FormControl(''),
    });
  }


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
  BindPayType() {
    this.payCode.GetPayType().subscribe({
      next: res => { this.paytype = res.Data }
    });
  }

  ngAfterViewInit() {
   // this.uploadedDataSource.paginator = this.paginator;
    this.setUpCustomFilter();
  }

  setUpCustomFilter() {
    this.dataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.payCode?.toLowerCase().includes(search.payCode) &&
        data.description?.toLowerCase().includes(search.description) &&
        data.payType?.toLowerCase().includes(search.payType) &&
        data.taxable?.toLowerCase().includes(search.taxable) &&
        data.accountNumber?.toLowerCase().includes(search.accountNumber)
      );
    };
  }

  applyFilter() {
    this.dataSource.filter = JSON.stringify({
      payCode: this.filterValues.payCode.trim().toLowerCase(),
      description: this.filterValues.description.trim().toLowerCase(),
      payType: this.filterValues.payType.trim().toLowerCase(),
      taxable: this.filterValues.taxable.trim().toLowerCase(),
      accountNumber: this.filterValues.accountNumber.trim().toLowerCase(),
    });

    // if (this.uploadedDataSource.paginator) {
    //   this.uploadedDataSource.paginator.firstPage();
    // }
  }

  PayCodeSearch() {
    this.showTable = true;
    const payload = {
      "paycode_Code": '',
      "PayTypeId": 0,
      "IsTaxable": 0,
      "PayId": 0

    }
    this.isLoading = true;


    this.payCode.SearchPayCode(payload).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.paySearch = res.Data.data.Table0;
        if (this.paySearch && this.paySearch.length > 0) {
          this.dataSource = new MatTableDataSource(this.paySearch);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.displayedColumns = ['Action', 'slNo', 'payCode', 'description', 'printAs', 'payType', 'taxable', 'projectTax', 'marginalTax', 'payCodeType', 'lopApplicable', 'pfApplicable', 'esiApplicable', 'ptApplicable', 'pageType', 'accountNumber', 'postingKey'];
        } else {
          this.isLoading = false;
          this.dataSource.data = [];
          alert('No data found for the selected criteria');
        }
      },
      error: (err) => {
        console.error('Error loading salary release data', err);
        this.isLoading = false;
        alert('Failed to load salary release data');
      },
    });
  }
  
  showAlertPopup(arg0: string, arg1: string) {
    throw new Error('Method not implemented.');
  }

  exportToExcel(): void {
    this.isLoading = true;
    const payload = {
      "paycode_Code": '',
      "PayTypeId": 0,
      "IsTaxable": 0,
      "PayId": 0

    }


    this.payCode.SearchPayCode(payload).subscribe({
      next: (res) => {
        this.isLoading=false;
        try {
          const jsonData = res?.Data?.data?.Table0;
          if (!Array.isArray(jsonData) || jsonData.length === 0) {
            alert('No data available');
            return;
          }

          const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
          const wb: XLSX.WorkBook = XLSX.utils.book_new();

          XLSX.utils.book_append_sheet(wb, ws, 'paycodeData');

          const timestamp = new Date().toISOString().split('T')[0];
          const fileName = `PayCode_${timestamp}.xlsx`;

          XLSX.writeFile(wb, fileName);
        } catch (err) {
          console.error('Error exporting to Excel:', err);
          alert('An error occurred while exporting data.');
        }
      },
      error: (err) => {
        console.error('Error loading data for export', err);
        this.isLoading = false;
        alert('Failed to load data from server.');
      },
    });
  }


  AddPOOpen() {
    this.dialog.open(PaycodeaddComponent, {
      width: '90%',
      height: '84vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
}
