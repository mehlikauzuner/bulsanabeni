import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarHesabim } from './navbar-hesabim';

describe('NavbarHesabim', () => {
  let component: NavbarHesabim;
  let fixture: ComponentFixture<NavbarHesabim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NavbarHesabim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavbarHesabim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
