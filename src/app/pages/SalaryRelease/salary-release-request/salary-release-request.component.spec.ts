import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReleaseRequestComponent } from './salary-release-request.component';

describe('SalaryReleaseRequestComponent', () => {
  let component: SalaryReleaseRequestComponent;
  let fixture: ComponentFixture<SalaryReleaseRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReleaseRequestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryReleaseRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
