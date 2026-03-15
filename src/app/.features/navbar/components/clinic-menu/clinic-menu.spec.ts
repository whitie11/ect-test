import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicMenu } from './clinic-menu';

describe('ClinicMenu', () => {
  let component: ClinicMenu;
  let fixture: ComponentFixture<ClinicMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClinicMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClinicMenu);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
