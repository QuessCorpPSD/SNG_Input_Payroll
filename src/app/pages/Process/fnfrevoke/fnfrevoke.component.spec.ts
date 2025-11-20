import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FNFRevokeComponent } from './fnfrevoke.component';

describe('FNFRevokeComponent', () => {
  let component: FNFRevokeComponent;
  let fixture: ComponentFixture<FNFRevokeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FNFRevokeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FNFRevokeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
