import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryadvancereportComponent } from './salaryadvancereport.component';

describe('SalaryadvancereportComponent', () => {
  let component: SalaryadvancereportComponent;
  let fixture: ComponentFixture<SalaryadvancereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryadvancereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryadvancereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
