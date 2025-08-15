import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Detay } from './detay';

describe('Detay', () => {
  let component: Detay;
  let fixture: ComponentFixture<Detay>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Detay]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Detay);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
