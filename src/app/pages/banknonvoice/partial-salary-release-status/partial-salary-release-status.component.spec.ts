import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialSalaryReleaseStatusComponent } from './partial-salary-release-status.component';

describe('PartialSalaryReleaseStatusComponent', () => {
  let component: PartialSalaryReleaseStatusComponent;
  let fixture: ComponentFixture<PartialSalaryReleaseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialSalaryReleaseStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialSalaryReleaseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
