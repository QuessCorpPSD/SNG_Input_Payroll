import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITAdjustmentAddComponent } from './itadjustment-add.component';

describe('ITAdjustmentAddComponent', () => {
  let component: ITAdjustmentAddComponent;
  let fixture: ComponentFixture<ITAdjustmentAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITAdjustmentAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ITAdjustmentAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
