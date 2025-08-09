import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Kulturgezileri } from './kulturgezileri';

describe('Kulturgezileri', () => {
  let component: Kulturgezileri;
  let fixture: ComponentFixture<Kulturgezileri>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kulturgezileri]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Kulturgezileri);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
