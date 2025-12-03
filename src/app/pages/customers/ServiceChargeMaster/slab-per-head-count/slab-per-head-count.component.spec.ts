import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlabPerHeadCountComponent } from './slab-per-head-count.component';

describe('SlabPerHeadCountComponent', () => {
  let component: SlabPerHeadCountComponent;
  let fixture: ComponentFixture<SlabPerHeadCountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SlabPerHeadCountComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SlabPerHeadCountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
