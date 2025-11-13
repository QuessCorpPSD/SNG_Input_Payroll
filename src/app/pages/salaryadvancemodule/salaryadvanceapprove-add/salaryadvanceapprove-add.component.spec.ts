import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryadvanceapproveAddComponent } from './salaryadvanceapprove-add.component';

describe('SalaryadvanceapproveAddComponent', () => {
  let component: SalaryadvanceapproveAddComponent;
  let fixture: ComponentFixture<SalaryadvanceapproveAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryadvanceapproveAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryadvanceapproveAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
