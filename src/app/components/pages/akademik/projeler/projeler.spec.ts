import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Projeler } from './projeler';

describe('Projeler', () => {
  let component: Projeler;
  let fixture: ComponentFixture<Projeler>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Projeler]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Projeler);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
