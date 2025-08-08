import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Yuzme } from './yuzme';

describe('Yuzme', () => {
  let component: Yuzme;
  let fixture: ComponentFixture<Yuzme>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Yuzme]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Yuzme);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
