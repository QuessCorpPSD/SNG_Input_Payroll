import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ESIslabComponent } from './esislab.component';

describe('ESIslabComponent', () => {
  let component: ESIslabComponent;
  let fixture: ComponentFixture<ESIslabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ESIslabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ESIslabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
