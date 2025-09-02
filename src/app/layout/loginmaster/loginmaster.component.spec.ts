import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginmasterComponent } from './loginmaster.component';

describe('LoginmasterComponent', () => {
  let component: LoginmasterComponent;
  let fixture: ComponentFixture<LoginmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginmasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LoginmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
