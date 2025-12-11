import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankmasteraddComponent } from './bankmasteradd.component';

describe('BankmasteraddComponent', () => {
  let component: BankmasteraddComponent;
  let fixture: ComponentFixture<BankmasteraddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BankmasteraddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BankmasteraddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
