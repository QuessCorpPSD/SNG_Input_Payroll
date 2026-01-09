import { Component } from '@angular/core';
import { BonusPayoutComponent } from '../bonus-payout/bonus-payout.component';
import { DeductionPayoutComponent } from '../deduction-payout/deduction-payout.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'Yearlypayout',
  standalone: true,
  imports: [CommonModule,BonusPayoutComponent,DeductionPayoutComponent],
  templateUrl: './yearly-payout.component.html',
  styleUrl: './yearly-payout.component.css'
})
export class YearlyPayoutComponent {

  activeMenu: 'bonus' | 'deduction' = 'bonus';

  selectMenu(menu: 'bonus' | 'deduction') {
    this.activeMenu = menu;
  }
}
