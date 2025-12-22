import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidentfundaddComponent } from './providentfundadd.component';

describe('ProvidentfundaddComponent', () => {
  let component: ProvidentfundaddComponent;
  let fixture: ComponentFixture<ProvidentfundaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvidentfundaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProvidentfundaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
