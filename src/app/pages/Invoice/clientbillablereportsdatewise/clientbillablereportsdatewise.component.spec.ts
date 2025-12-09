import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientbillablereportsdatewiseComponent } from './clientbillablereportsdatewise.component';

describe('ClientbillablereportsdatewiseComponent', () => {
  let component: ClientbillablereportsdatewiseComponent;
  let fixture: ComponentFixture<ClientbillablereportsdatewiseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientbillablereportsdatewiseComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ClientbillablereportsdatewiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
