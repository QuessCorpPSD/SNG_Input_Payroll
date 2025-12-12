import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherincomereportComponent } from './otherincomereport.component';

describe('OtherincomereportComponent', () => {
  let component: OtherincomereportComponent;
  let fixture: ComponentFixture<OtherincomereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherincomereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherincomereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
