import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotedLotComponent } from './alloted-lot.component';

describe('AllotedLotComponent', () => {
  let component: AllotedLotComponent;
  let fixture: ComponentFixture<AllotedLotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotedLotComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllotedLotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
