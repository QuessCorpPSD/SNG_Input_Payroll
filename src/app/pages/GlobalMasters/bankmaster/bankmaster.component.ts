import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Inject, InjectionToken, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BankmasteraddComponent } from '../bankmasteradd/bankmasteradd.component';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { BankService } from '../../../Service/GlobalMasters/Bank.service';
import { IBankRepository } from '../../../Repository/GlobalMasters/IBankrepository';
import { EncryptionService } from '../../../Shared/encryption.service';
import { SessionStorageService } from '../../../Shared/SessionStorageService';

export const Bank_TOKEN = new InjectionToken<IBankRepository>('Bank_TOKEN');

@Component({
  selector: 'app-bankmaster',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatTooltipModule, MatTableModule, MatPaginatorModule, FormsModule],
  templateUrl: './bankmaster.component.html',
  styleUrl: './bankmaster.component.css',
  providers: [
    {
      provide: Bank_TOKEN,
      useClass: BankService,
    }
  ]
})
export class BankmasterComponent implements AfterViewInit {

  constructor(private dialog: MatDialog, @Inject(Bank_TOKEN) private bankService: IBankRepository,
    private decry: EncryptionService,
    private _sessionStoreage: SessionStorageService) { }

  showTable = false;
  uploadedData: any;
  // 🔹 Table columns
  uploadDisplayedColumns: string[] = [
    'Action',
    'slNo',
    'bankname',
    'digitlengthcondition',
    'bankacdigit',
    'ifsctreatment'
  ];

  // 🔹 Filter row columns
  filteredDisplayedColumns: string[] = [
    'Actionfilter',
    'slNoFilter',
    'banknameFilter',
    'digitlengthconditionFilter',
    'bankacdigitFilter',
    'ifsctreatmentFilter'
  ];

  // 🔹 DataSource (initially empty, ready for API)
  uploadedDataSource = new MatTableDataSource<any>([]);

  // 🔹 Filter model
  filterValues = {
    Serial_No: '',
    Bank_Name: '',
    Digit_Length_Condition: '',
    Bank_Account_Number_Digits: '',
    IFSC_Treatment: ''
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngAfterViewInit() {
    this.uploadedDataSource.paginator = this.paginator;
    this.setupFilterPredicate();
  }

  /**  Custom Filter Logic */
  setupFilterPredicate() {
    this.uploadedDataSource.filterPredicate = (data, filter: string): boolean => {
      const search = JSON.parse(filter);
      return (
        data.Serial_No?.toString().toLowerCase().includes(search.Serial_No) &&
        data.Bank_Name?.toLowerCase().includes(search.Bank_Name) &&
        data.Digit_Length_Condition?.toLowerCase().includes(search.Digit_Length_Condition) &&
        data.Bank_Account_Number_Digits?.toLowerCase().includes(search.Bank_Account_Number_Digits) &&
        data.IFSC_Treatment?.toLowerCase().includes(search.IFSC_Treatment)
      );
    };
  }
  applyFilter(event: Event, column: string) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();

    this.uploadedDataSource.filterPredicate = (data: any, filter: string) => {
      return data[column]?.toString().toLowerCase().includes(filter);
    };

    this.uploadedDataSource.filter = filterValue;
  }

  /**  On Search (show table and fetch data) */
  onsearch() {
    this.showTable = true;
    this.bankService.Search().subscribe({
      next: (res: any) => {

        if (res) {
          console.log(res);
          const data = res?.Data?.data?.Table0;
          console.log(data);

          if (Array.isArray(data) && data.length > 0) {
            this.uploadedData = data;
            this.uploadedDataSource.data = this.uploadedData;
          } else if (res?.Data?.errors) {
            const validationErrors = res.Data.errors;
            const messages: string[] = [];
            Object.keys(validationErrors).forEach(key => {
              messages.push(`${key}: ${validationErrors[key].join(', ')}`);
            });
            alert('Validation Errors:\n' + messages.join('\n'));
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
          } else {
            this.uploadedData = [];
            this.uploadedDataSource.data = [];
            alert('No data found.');
          }
        } else {
          alert('Unexpected API response. Check console.');
          console.warn('Unexpected:', res);
        }
      },
      error: (err) => {
        console.error('Error fetching GST slab data:', err);
      }
    });
  }

  AddBankOpen() {
    this.dialog.open(BankmasteraddComponent, {
      width: '50%',
      height: '60vh',
      disableClose: true,
      data: { example: 'Hello from parent!' }
    });
  }
}
