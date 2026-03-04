import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddservicechargemasterComponent } from './addservicechargemaster.component';

describe('AddservicechargemasterComponent', () => {
  let component: AddservicechargemasterComponent;
  let fixture: ComponentFixture<AddservicechargemasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddservicechargemasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddservicechargemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
