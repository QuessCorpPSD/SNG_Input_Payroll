import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOPAdjustmentsComponent } from './lopadjustments.component';

describe('LOPAdjustmentsComponent', () => {
  let component: LOPAdjustmentsComponent;
  let fixture: ComponentFixture<LOPAdjustmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LOPAdjustmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LOPAdjustmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
