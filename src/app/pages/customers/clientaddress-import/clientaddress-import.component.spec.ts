import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientaddressImportComponent } from './clientaddress-import.component';

describe('ClientaddressImportComponent', () => {
  let component: ClientaddressImportComponent;
  let fixture: ComponentFixture<ClientaddressImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientaddressImportComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientaddressImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
