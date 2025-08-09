import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Resim } from './resim';

describe('Resim', () => {
  let component: Resim;
  let fixture: ComponentFixture<Resim>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Resim]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Resim);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
