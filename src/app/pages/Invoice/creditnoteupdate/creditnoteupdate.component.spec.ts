import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditnoteupdateComponent } from './creditnoteupdate.component';

describe('CreditnoteupdateComponent', () => {
  let component: CreditnoteupdateComponent;
  let fixture: ComponentFixture<CreditnoteupdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreditnoteupdateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreditnoteupdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
