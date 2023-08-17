import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoNormalizerComponent } from './video-normalizer.component';

describe('VideoRecognizerComponent', () => {
  let component: VideoNormalizerComponent;
  let fixture: ComponentFixture<VideoNormalizerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoNormalizerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VideoNormalizerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
