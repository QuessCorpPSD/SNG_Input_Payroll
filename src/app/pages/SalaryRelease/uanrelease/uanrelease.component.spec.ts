import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UANReleaseComponent } from './uanrelease.component';

describe('UANReleaseComponent', () => {
  let component: UANReleaseComponent;
  let fixture: ComponentFixture<UANReleaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UANReleaseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UANReleaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
