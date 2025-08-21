import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kullanici } from './kullanici';

describe('Kullanici', () => {
  let component: Kullanici;
  let fixture: ComponentFixture<Kullanici>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kullanici]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kullanici);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
