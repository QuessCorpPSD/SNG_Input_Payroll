import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientaddressComponent } from './clientaddress.component';

describe('ClientaddressComponent', () => {
  let component: ClientaddressComponent;
  let fixture: ComponentFixture<ClientaddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientaddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientaddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
