import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryreleasestatusComponent } from './salaryreleasestatus.component';

describe('SalaryreleasestatusComponent', () => {
  let component: SalaryreleasestatusComponent;
  let fixture: ComponentFixture<SalaryreleasestatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryreleasestatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryreleasestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
