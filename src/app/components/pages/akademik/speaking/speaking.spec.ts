import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Speaking } from './speaking';

describe('Speaking', () => {
  let component: Speaking;
  let fixture: ComponentFixture<Speaking>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Speaking]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Speaking);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
