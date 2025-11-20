import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddOneTimeReplacementComponent } from './add-one-time-replacement.component';

describe('AddOneTimeReplacementComponent', () => {
  let component: AddOneTimeReplacementComponent;
  let fixture: ComponentFixture<AddOneTimeReplacementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddOneTimeReplacementComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddOneTimeReplacementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
