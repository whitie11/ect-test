import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewReferral } from './new-referral';

describe('NewReferral', () => {
  let component: NewReferral;
  let fixture: ComponentFixture<NewReferral>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NewReferral]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewReferral);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
