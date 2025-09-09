import { ComponentFixture, TestBed } from '@angular/core/testing';

import { POStatusComponent } from './postatus.component';

describe('POStatusComponent', () => {
  let component: POStatusComponent;
  let fixture: ComponentFixture<POStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [POStatusComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(POStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
