import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IRFormReportComponent } from './ir-form-report.component';

describe('IRFormReportComponent', () => {
  let component: IRFormReportComponent;
  let fixture: ComponentFixture<IRFormReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IRFormReportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IRFormReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
