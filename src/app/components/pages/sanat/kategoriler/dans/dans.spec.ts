import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Dans } from './dans';

describe('Dans', () => {
  let component: Dans;
  let fixture: ComponentFixture<Dans>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dans]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Dans);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
