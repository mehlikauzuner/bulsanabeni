import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Seyehat } from './seyehat';

describe('Seyehat', () => {
  let component: Seyehat;
  let fixture: ComponentFixture<Seyehat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Seyehat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Seyehat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
