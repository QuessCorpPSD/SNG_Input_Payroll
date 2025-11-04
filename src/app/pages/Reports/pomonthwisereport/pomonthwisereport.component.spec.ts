import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PomonthwisereportComponent } from './pomonthwisereport.component';

describe('PomonthwisereportComponent', () => {
  let component: PomonthwisereportComponent;
  let fixture: ComponentFixture<PomonthwisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PomonthwisereportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PomonthwisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
