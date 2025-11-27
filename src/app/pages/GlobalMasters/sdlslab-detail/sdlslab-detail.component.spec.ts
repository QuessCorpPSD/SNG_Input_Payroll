import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SDLslabDetailComponent } from './sdlslab-detail.component';

describe('SDLslabDetailComponent', () => {
  let component: SDLslabDetailComponent;
  let fixture: ComponentFixture<SDLslabDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SDLslabDetailComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SDLslabDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
