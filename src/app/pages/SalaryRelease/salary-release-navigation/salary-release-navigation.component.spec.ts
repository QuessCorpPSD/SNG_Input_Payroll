import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryReleaseNavigationComponent } from './salary-release-navigation.component';

describe('SalaryReleaseNavigationComponent', () => {
  let component: SalaryReleaseNavigationComponent;
  let fixture: ComponentFixture<SalaryReleaseNavigationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryReleaseNavigationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryReleaseNavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
