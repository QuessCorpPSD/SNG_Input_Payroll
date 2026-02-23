import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReleaseApproveComponent } from './salary-release-approve.component';

describe('SalaryReleaseApproveComponent', () => {
  let component: SalaryReleaseApproveComponent;
  let fixture: ComponentFixture<SalaryReleaseApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReleaseApproveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalaryReleaseApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
