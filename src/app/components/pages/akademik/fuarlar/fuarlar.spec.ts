import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Fuarlar } from './fuarlar';

describe('Fuarlar', () => {
  let component: Fuarlar;
  let fixture: ComponentFixture<Fuarlar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Fuarlar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Fuarlar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
