import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabFixedCTCComponent } from './slab-fixed-ctc.component';

describe('SlabFixedCTCComponent', () => {
  let component: SlabFixedCTCComponent;
  let fixture: ComponentFixture<SlabFixedCTCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlabFixedCTCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlabFixedCTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
