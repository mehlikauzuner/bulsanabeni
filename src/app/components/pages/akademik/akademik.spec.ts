import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Akademik } from './akademik';

describe('Akademik', () => {
  let component: Akademik;
  let fixture: ComponentFixture<Akademik>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Akademik]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Akademik);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
