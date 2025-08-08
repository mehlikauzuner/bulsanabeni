import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kamp } from './kamp';

describe('Kamp', () => {
  let component: Kamp;
  let fixture: ComponentFixture<Kamp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kamp]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kamp);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
