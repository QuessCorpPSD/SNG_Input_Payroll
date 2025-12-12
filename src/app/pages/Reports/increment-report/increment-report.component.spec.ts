import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncrementReportComponent } from './increment-report.component';

describe('IncrementReportComponent', () => {
  let component: IncrementReportComponent;
  let fixture: ComponentFixture<IncrementReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncrementReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IncrementReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
