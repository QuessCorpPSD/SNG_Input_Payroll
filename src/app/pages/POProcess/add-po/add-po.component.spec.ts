import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPOComponent } from './add-po.component';

describe('AddPOComponent', () => {
  let component: AddPOComponent;
  let fixture: ComponentFixture<AddPOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPOComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddPOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
