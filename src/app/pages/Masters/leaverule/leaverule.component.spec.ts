import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveruleComponent } from './leaverule.component';

describe('LeaveruleComponent', () => {
  let component: LeaveruleComponent;
  let fixture: ComponentFixture<LeaveruleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveruleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveruleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
