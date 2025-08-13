import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Hesabim } from './hesabim';

describe('Hesabim', () => {
  let component: Hesabim;
  let fixture: ComponentFixture<Hesabim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hesabim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Hesabim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
