import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryadvancemodulenavigationComponent } from './salaryadvancemodulenavigation.component';

describe('SalaryadvancemodulenavigationComponent', () => {
  let component: SalaryadvancemodulenavigationComponent;
  let fixture: ComponentFixture<SalaryadvancemodulenavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryadvancemodulenavigationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryadvancemodulenavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
