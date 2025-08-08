import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Muzik } from './muzik';

describe('Muzik', () => {
  let component: Muzik;
  let fixture: ComponentFixture<Muzik>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Muzik]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Muzik);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
