import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMulticommercialComponent } from './add-multicommercial.component';

describe('AddMulticommercialComponent', () => {
  let component: AddMulticommercialComponent;
  let fixture: ComponentFixture<AddMulticommercialComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddMulticommercialComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddMulticommercialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
