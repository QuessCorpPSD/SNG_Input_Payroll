import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherincomeentitywisereportComponent } from './otherincomeentitywisereport.component';

describe('OtherincomeentitywisereportComponent', () => {
  let component: OtherincomeentitywisereportComponent;
  let fixture: ComponentFixture<OtherincomeentitywisereportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherincomeentitywisereportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherincomeentitywisereportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
