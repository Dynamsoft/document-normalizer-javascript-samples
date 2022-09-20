import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImgNormalizerComponent } from './img-normalizer.component';

describe('HelloWorldComponent', () => {
  let component: ImgNormalizerComponent;
  let fixture: ComponentFixture<ImgNormalizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImgNormalizerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImgNormalizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
