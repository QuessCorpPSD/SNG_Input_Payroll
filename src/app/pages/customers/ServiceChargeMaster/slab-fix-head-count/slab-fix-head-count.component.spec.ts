import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabFixHeadCountComponent } from './slab-fix-head-count.component';

describe('SlabFixHeadCountComponent', () => {
  let component: SlabFixHeadCountComponent;
  let fixture: ComponentFixture<SlabFixHeadCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlabFixHeadCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlabFixHeadCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
