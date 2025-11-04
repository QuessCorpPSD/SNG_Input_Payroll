import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoactiveinactivereportComponent } from './poactiveinactivereport.component';

describe('PoactiveinactivereportComponent', () => {
  let component: PoactiveinactivereportComponent;
  let fixture: ComponentFixture<PoactiveinactivereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PoactiveinactivereportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoactiveinactivereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
