import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MulticommercialComponent } from './multicommercial.component';

describe('MulticommercialComponent', () => {
  let component: MulticommercialComponent;
  let fixture: ComponentFixture<MulticommercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MulticommercialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MulticommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
