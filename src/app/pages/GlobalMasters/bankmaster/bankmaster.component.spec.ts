import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankmasterComponent } from './bankmaster.component';

describe('BankmasterComponent', () => {
  let component: BankmasterComponent;
  let fixture: ComponentFixture<BankmasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankmasterComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
