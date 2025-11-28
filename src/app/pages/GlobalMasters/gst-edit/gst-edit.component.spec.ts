import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTEditComponent } from './gst-edit.component';

describe('GSTEditComponent', () => {
  let component: GSTEditComponent;
  let fixture: ComponentFixture<GSTEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GSTEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GSTEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
