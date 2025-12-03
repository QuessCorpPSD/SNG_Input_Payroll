import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { AlertpopupComponent } from '../../../common/alertpopup/alertpopup.component';

@Component({
  selector: 'app-peclientmapping',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    AlertpopupComponent
  ],
  templateUrl: './peclientmapping.component.html',
  styleUrl: './peclientmapping.component.css'
})
export class PEclientmappingComponent {

  clentmapping!: FormGroup;

  mockData = [
    {
      userId: "2001427194",
      email: "benazir.ku@quesscorp.com",
      mappedCompanies: ["PSL000001", "PSL000002", "PSL000005"]
    },
    {
      userId: "2001987654",
      email: "priya.sharma@quesscorp.com",
      mappedCompanies: ["PSL000010", "PSL000011"]
    },
    {
      userId: "2001256789",
      email: "john.mathew@quesscorp.com",
      mappedCompanies: ["PSL000020"]
    },
    {
      userId: "2001675432",
      email: "rahul.nair@quesscorp.com",
      mappedCompanies: ["PSL000015", "PSL000016", "PSL000018"]
    }
  ];

  ngOnInit(): void {
    this.clentmapping = new FormGroup({
      peUser: new FormControl(""),
      emailId: new FormControl(""),
      MappedCompanyCode: new FormControl("")

    });
  }

  onUserChange(event: any) {
    const selectedId = event.target.value;
    const user = this.mockData.find(x => x.userId === selectedId);

    if (user) {
      this.clentmapping.patchValue({
        emailId: user.email,
        MappedCompanyCode: user.mappedCompanies.join(',')
      });
    }
  }

  onCompanyCodeInput() {
    let value = this.clentmapping.value.mappedCompanyCode;

    // Remove spaces like “PSL0001, PSL0002”
    value = value.replace(/,\s+/g, ',');

    // Keep only comma-separated format
    const valid = /^[A-Za-z0-9,]*$/.test(value);

    if (!valid) {
      // Remove invalid characters
      value = value.replace(/[^A-Za-z0-9,]/g, '');
    }

    this.clentmapping.patchValue({ mappedCompanyCode: value }, { emitEvent: false });
  }


}
