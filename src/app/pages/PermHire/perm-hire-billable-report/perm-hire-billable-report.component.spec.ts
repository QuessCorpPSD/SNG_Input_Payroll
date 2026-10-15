import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PermHireBillableReportComponent } from './perm-hire-billable-report.component';

describe('PermHireBillableReportComponent', () => {
  let component: PermHireBillableReportComponent;
  let fixture: ComponentFixture<PermHireBillableReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PermHireBillableReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PermHireBillableReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
