import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralRef } from './referral-ref';

describe('ReferralRef', () => {
  let component: ReferralRef;
  let fixture: ComponentFixture<ReferralRef>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralRef]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralRef);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
