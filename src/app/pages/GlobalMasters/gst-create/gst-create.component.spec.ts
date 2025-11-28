import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GSTCreateComponent } from './gst-create.component';

describe('GSTCreateComponent', () => {
  let component: GSTCreateComponent;
  let fixture: ComponentFixture<GSTCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GSTCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GSTCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
