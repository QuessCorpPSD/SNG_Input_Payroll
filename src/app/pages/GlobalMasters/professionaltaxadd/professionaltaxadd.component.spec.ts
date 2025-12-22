import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfessionaltaxaddComponent } from './professionaltaxadd.component';

describe('ProfessionaltaxaddComponent', () => {
  let component: ProfessionaltaxaddComponent;
  let fixture: ComponentFixture<ProfessionaltaxaddComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfessionaltaxaddComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProfessionaltaxaddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
