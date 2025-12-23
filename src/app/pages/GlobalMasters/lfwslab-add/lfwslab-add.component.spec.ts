import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LFWSlabAddComponent } from './lfwslab-add.component';

describe('LFWSlabAddComponent', () => {
  let component: LFWSlabAddComponent;
  let fixture: ComponentFixture<LFWSlabAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LFWSlabAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LFWSlabAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
