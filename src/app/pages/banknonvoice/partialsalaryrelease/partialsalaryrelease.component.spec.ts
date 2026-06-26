import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartialsalaryreleaseComponent } from './partialsalaryrelease.component';

describe('PartialsalaryreleaseComponent', () => {
  let component: PartialsalaryreleaseComponent;
  let fixture: ComponentFixture<PartialsalaryreleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PartialsalaryreleaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PartialsalaryreleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
