import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxdeclationandactualComponent } from './taxdeclationandactual.component';

describe('TaxdeclationandactualComponent', () => {
  let component: TaxdeclationandactualComponent;
  let fixture: ComponentFixture<TaxdeclationandactualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaxdeclationandactualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TaxdeclationandactualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
