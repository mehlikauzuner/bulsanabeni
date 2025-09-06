import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Gezilers } from './gezilers';

describe('Gezilers', () => {
  let component: Gezilers;
  let fixture: ComponentFixture<Gezilers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Gezilers]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Gezilers);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
