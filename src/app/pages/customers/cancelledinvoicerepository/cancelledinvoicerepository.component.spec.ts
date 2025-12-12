import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledinvoicerepositoryComponent } from './cancelledinvoicerepository.component';

describe('CancelledinvoicerepositoryComponent', () => {
  let component: CancelledinvoicerepositoryComponent;
  let fixture: ComponentFixture<CancelledinvoicerepositoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelledinvoicerepositoryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CancelledinvoicerepositoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
