import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddESIslabComponent } from './add-esislab.component';

describe('AddESIslabComponent', () => {
  let component: AddESIslabComponent;
  let fixture: ComponentFixture<AddESIslabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddESIslabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddESIslabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
