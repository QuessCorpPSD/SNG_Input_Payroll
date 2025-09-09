import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnseizeComponent } from './unseize.component';

describe('UnseizeComponent', () => {
  let component: UnseizeComponent;
  let fixture: ComponentFixture<UnseizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnseizeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UnseizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
