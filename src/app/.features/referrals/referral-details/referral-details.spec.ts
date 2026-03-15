import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralDetails } from './referral-details';

describe('ReferralDetails', () => {
  let component: ReferralDetails;
  let fixture: ComponentFixture<ReferralDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
