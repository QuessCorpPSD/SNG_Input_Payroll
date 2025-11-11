import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HoldEmployeSalaryComponent } from './hold-employe-salary.component';

describe('HoldEmployeSalaryComponent', () => {
  let component: HoldEmployeSalaryComponent;
  let fixture: ComponentFixture<HoldEmployeSalaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HoldEmployeSalaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HoldEmployeSalaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
