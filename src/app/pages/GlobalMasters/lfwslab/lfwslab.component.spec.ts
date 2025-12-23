import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LFWSlabComponent } from './lfwslab.component';

describe('LFWSlabComponent', () => {
  let component: LFWSlabComponent;
  let fixture: ComponentFixture<LFWSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LFWSlabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LFWSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
