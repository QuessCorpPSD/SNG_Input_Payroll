import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoemployeereportComponent } from './poemployeereport.component';

describe('PoemployeereportComponent', () => {
  let component: PoemployeereportComponent;
  let fixture: ComponentFixture<PoemployeereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoemployeereportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoemployeereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
