import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEpoComponent } from './add-epo.component';

describe('AddEpoComponent', () => {
  let component: AddEpoComponent;
  let fixture: ComponentFixture<AddEpoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEpoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEpoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
