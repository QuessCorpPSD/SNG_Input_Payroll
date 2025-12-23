import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TDSslabAddComponent } from './tdsslab-add.component';

describe('TDSslabAddComponent', () => {
  let component: TDSslabAddComponent;
  let fixture: ComponentFixture<TDSslabAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TDSslabAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TDSslabAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
