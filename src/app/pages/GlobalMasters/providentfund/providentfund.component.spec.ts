import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvidentfundComponent } from './providentfund.component';

describe('ProvidentfundComponent', () => {
  let component: ProvidentfundComponent;
  let fixture: ComponentFixture<ProvidentfundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProvidentfundComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProvidentfundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
