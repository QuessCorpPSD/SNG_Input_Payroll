import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OtherincomeAddComponent } from './otherincome-add.component';

describe('OtherincomeAddComponent', () => {
  let component: OtherincomeAddComponent;
  let fixture: ComponentFixture<OtherincomeAddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OtherincomeAddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OtherincomeAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
