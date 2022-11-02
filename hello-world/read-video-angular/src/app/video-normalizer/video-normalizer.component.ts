import { Component, OnInit } from '@angular/core';
import { CameraEnhancer, DrawingItem, DCEFrame } from "dynamsoft-camera-enhancer";
import { DocumentNormalizer, DetectedQuadResult } from '@scannerproxy/ddnjs';
@Component({
  selector: 'app-video-normalizer',
  templateUrl: './video-normalizer.component.html',
  styleUrls: ['./video-normalizer.component.css']
})
export class VideoNormalizerComponent implements OnInit {
  pCameraEnhancer = null;
  pNormalizer = null;

  async ngOnInit(): Promise<void> {
    try {
      this.pCameraEnhancer = this.pCameraEnhancer || await CameraEnhancer.createInstance();
      this.pNormalizer = this.pNormalizer || await DocumentNormalizer.createInstance();
      await this.pNormalizer.setImageSource(this.pCameraEnhancer, {resultsHighlightBaseShapes: DrawingItem});
      await this.pCameraEnhancer.setUIElement((document.querySelector('.component-video-normalizer') as any));
      this.pNormalizer.onQuadDetected = async (results: DetectedQuadResult[], sourceImage: DCEFrame) => {
        console.log(results);
      };
      await this.pNormalizer.startScanning(true);
    } catch (ex) {
      let errMsg: string;
      if (ex.message.includes("network connection error")) {
        errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
      } else {
        errMsg = ex.message||ex;
      }
      console.error(errMsg);
      alert(errMsg);
    }
  }
  confirmQuadForNormalization(): void {
    this.pNormalizer.confirmQuadForNormalization();
  }
  async normalizeWithConfirmedQuad(): Promise<void> {
    try {
      const res = await this.pNormalizer.normalizeWithConfirmedQuad();
      if(res) {
        const cvs = res.image.toCanvas();
        if(document.body.clientWidth < 600) {
          cvs.style.width = "100%";
        }
        document.querySelector(".video-normalized-result").appendChild(cvs);
      console.log(res);
      }
    } catch(ex) {
      alert(ex.message || ex);
    }
  }
  async ngOnDestroy() {
    if (this.pNormalizer) {
      (await this.pNormalizer).dispose();
      (await this.pCameraEnhancer).dispose();
      this.pCameraEnhancer = null;
      this.pNormalizer = null;
      console.log('VideoNormalizer Component Unmount');
    }
  }
}
