import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryreleaseprocessComponent } from './salaryreleaseprocess.component';

describe('SalaryreleaseprocessComponent', () => {
  let component: SalaryreleaseprocessComponent;
  let fixture: ComponentFixture<SalaryreleaseprocessComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SalaryreleaseprocessComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryreleaseprocessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
