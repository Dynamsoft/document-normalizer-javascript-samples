import { Component, ViewChild } from '@angular/core';
import { type NormalizedImageResultItem } from "@dynamsoft/ddnjs";
import { CaptureVisionRouter } from "@dynamsoft/cvrjs";

@Component({
  selector: 'app-image-normalizer',
  templateUrl: './image-normalizer.component.html',
  styleUrls: ['./image-normalizer.component.css']
})
export class ImageNormalizerComponent {
  router: Promise<CaptureVisionRouter> | null = null;

  @ViewChild('elInr') elInr: any;

  ngOnInit(): void {
    this.router = CaptureVisionRouter.createInstance();
  }

  captureImg = async (e: any) => {
    try {
      this.elInr.nativeElement!.innerHTML = "";
      const normalizer = await this.router;
      const results = await normalizer!.capture(e.target.files[0], "detect-and-normalize-document");
      if (results.items.length) {
        const cvs = (results.items[0] as NormalizedImageResultItem).toCanvas();
        if (document.body.clientWidth < 600) {
          cvs.style.width = "90%";
        }
        this.elInr.nativeElement!.append(cvs);
      }
      console.log(results);
    } catch (ex: any) {
      let errMsg: string;
      if (ex.message.includes("network connection error")) {
        errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
      } else {
        errMsg = ex.message || ex;
      }
      console.error(errMsg);
      alert(errMsg);
    }
  }

  async ngOnDestroy() {
    (await this.router)!.dispose();
    console.log('ImageNormalizer Component Unmount');
  }
}
