import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HelloWorldComponent } from './hello-world/hello-world.component';
import { VideoNormalizerComponent } from './video-normalizer/video-normalizer.component';
import { ImgNormalizerComponent } from './img-normalizer/img-normalizer.component';

@NgModule({
  declarations: [
    AppComponent,
    HelloWorldComponent,
    VideoNormalizerComponent,
    ImgNormalizerComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
