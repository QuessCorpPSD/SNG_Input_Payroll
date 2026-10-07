import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicRemoveComponent } from './dynamic-remove.component';

describe('DynamicRemoveComponent', () => {
  let component: DynamicRemoveComponent;
  let fixture: ComponentFixture<DynamicRemoveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicRemoveComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DynamicRemoveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
