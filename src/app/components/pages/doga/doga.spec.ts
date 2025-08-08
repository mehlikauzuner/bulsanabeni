import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Doga } from './doga';

describe('Doga', () => {
  let component: Doga;
  let fixture: ComponentFixture<Doga>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Doga]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Doga);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
