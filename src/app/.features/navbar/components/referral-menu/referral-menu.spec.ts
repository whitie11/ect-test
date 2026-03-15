import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralMenu } from './referral-menu';

describe('ReferralMenu', () => {
  let component: ReferralMenu;
  let fixture: ComponentFixture<ReferralMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferralMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
