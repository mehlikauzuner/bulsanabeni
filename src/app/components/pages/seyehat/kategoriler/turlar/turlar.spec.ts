import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Turlar } from './turlar';

describe('Turlar', () => {
  let component: Turlar;
  let fixture: ComponentFixture<Turlar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Turlar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Turlar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
