import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientaddressNewComponent } from './clientaddress-new.component';

describe('ClientaddressNewComponent', () => {
  let component: ClientaddressNewComponent;
  let fixture: ComponentFixture<ClientaddressNewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientaddressNewComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientaddressNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
