import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LOPAdjustmentsAddComponent } from './lopadjustments-add.component';

describe('LOPAdjustmentsAddComponent', () => {
  let component: LOPAdjustmentsAddComponent;
  let fixture: ComponentFixture<LOPAdjustmentsAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LOPAdjustmentsAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LOPAdjustmentsAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
