import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientaddressEditComponent } from './clientaddress-edit.component';

describe('ClientaddressEditComponent', () => {
  let component: ClientaddressEditComponent;
  let fixture: ComponentFixture<ClientaddressEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientaddressEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientaddressEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
