import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSslabComponent } from './tdsslab.component';

describe('TDSslabComponent', () => {
  let component: TDSslabComponent;
  let fixture: ComponentFixture<TDSslabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TDSslabComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TDSslabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
