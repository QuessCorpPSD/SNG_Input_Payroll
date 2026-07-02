import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonussalaryreleaseComponent } from './bonussalaryrelease.component';

describe('BonussalaryreleaseComponent', () => {
  let component: BonussalaryreleaseComponent;
  let fixture: ComponentFixture<BonussalaryreleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonussalaryreleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BonussalaryreleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
