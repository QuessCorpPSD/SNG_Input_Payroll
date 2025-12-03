import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddServicefeeComponent } from './add-servicefee.component';

describe('AddServicefeeComponent', () => {
  let component: AddServicefeeComponent;
  let fixture: ComponentFixture<AddServicefeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddServicefeeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddServicefeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
