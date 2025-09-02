import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FromtodateComponent } from './fromtodate.component';

describe('FromtodateComponent', () => {
  let component: FromtodateComponent;
  let fixture: ComponentFixture<FromtodateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FromtodateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FromtodateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
