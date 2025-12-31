import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReissueComponent } from './salary-reissue.component';

describe('SalaryReissueComponent', () => {
  let component: SalaryReissueComponent;
  let fixture: ComponentFixture<SalaryReissueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReissueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryReissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
