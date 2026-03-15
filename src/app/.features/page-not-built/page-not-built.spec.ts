import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNotBuilt } from './page-not-built';

describe('PageNotBuilt', () => {
  let component: PageNotBuilt;
  let fixture: ComponentFixture<PageNotBuilt>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNotBuilt]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNotBuilt);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
