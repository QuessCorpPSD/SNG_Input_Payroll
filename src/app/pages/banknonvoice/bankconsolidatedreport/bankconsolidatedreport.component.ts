import { Component, Inject, InjectionToken } from '@angular/core';
import { MatIcon, MatIconModule } from "@angular/material/icon";
import { IBankNonInvoiceNEFTCulture } from '../../../Repository/banknonvoice/Ibankneftculture';
import { BankneftcultureService } from '../../../Service/banknonvoice/bankneftculture.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

const Pay_TOKEN = new InjectionToken<IBankNonInvoiceNEFTCulture>('Pay_TOKEN');

@Component({
  selector: 'app-bankconsolidatedreport',
  standalone: true,
  imports: [MatIconModule,CommonModule,FormsModule],
  templateUrl: './bankconsolidatedreport.component.html',
  styleUrl: './bankconsolidatedreport.component.css',
  providers: [
    {
      provide: Pay_TOKEN,
      useClass: BankneftcultureService,
    }
  ]
})
export class BankconsolidatedreportComponent {
  EntityList: any[] = [];
  selectedEntityIds: number[] = [];
  selectedReportType: string = '';
  searchText: string = '';

  constructor(@Inject(Pay_TOKEN) private service: IBankNonInvoiceNEFTCulture,) { }

  onEntitySelect(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      if (!this.selectedEntityIds.includes(id)) {
        this.selectedEntityIds.push(id);
      }
    } else {
      this.selectedEntityIds = this.selectedEntityIds.filter(x => x !== id);
    }
  }

  selectAll() {
    this.selectedEntityIds = this.EntityList.map(e => e.Entity_Id);
  }

  unselectAll() {
    this.selectedEntityIds = [];
  }
  ngOnInit() {
    this.getBusinessUnit();
  }
  getBusinessUnit() {
    this.service.GetBusinessUnit().subscribe({
      next: (res: any) => {
        this.EntityList = res?.Data?.data?.Table0 ?? [];
      },
      error: () => {
        alert('Failed to load Business Units');
      }
    });
  }

}
