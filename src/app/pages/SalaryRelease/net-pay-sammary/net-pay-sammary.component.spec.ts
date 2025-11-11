import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NetPaySammaryComponent } from './net-pay-sammary.component';

describe('NetPaySammaryComponent', () => {
  let component: NetPaySammaryComponent;
  let fixture: ComponentFixture<NetPaySammaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NetPaySammaryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NetPaySammaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
