import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bisiklet } from './bisiklet';

describe('Bisiklet', () => {
  let component: Bisiklet;
  let fixture: ComponentFixture<Bisiklet>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bisiklet]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Bisiklet);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
