import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OnetimeinputComponent } from './onetimeinput.component';

describe('OnetimeinputComponent', () => {
  let component: OnetimeinputComponent;
  let fixture: ComponentFixture<OnetimeinputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnetimeinputComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OnetimeinputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
