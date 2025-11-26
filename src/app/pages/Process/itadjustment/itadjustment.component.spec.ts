import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITAdjustmentComponent } from './itadjustment.component';

describe('ITAdjustmentComponent', () => {
  let component: ITAdjustmentComponent;
  let fixture: ComponentFixture<ITAdjustmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITAdjustmentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ITAdjustmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
