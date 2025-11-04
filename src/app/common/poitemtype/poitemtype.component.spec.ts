import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POItemtypeComponent } from './poitemtype.component';

describe('POItemtypeComponent', () => {
  let component: POItemtypeComponent;
  let fixture: ComponentFixture<POItemtypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POItemtypeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POItemtypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
