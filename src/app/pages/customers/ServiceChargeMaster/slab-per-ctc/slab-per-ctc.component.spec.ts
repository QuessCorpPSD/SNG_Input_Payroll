import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabPerCTCComponent } from './slab-per-ctc.component';

describe('SlabPerCTCComponent', () => {
  let component: SlabPerCTCComponent;
  let fixture: ComponentFixture<SlabPerCTCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlabPerCTCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlabPerCTCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
