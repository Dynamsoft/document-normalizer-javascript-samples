import { Component, ViewChild } from '@angular/core';
import { EnumCapturedResultItemType, type DSImageData } from "@dynamsoft/dynamsoft-core";
import { type NormalizedImageResultItem } from "@dynamsoft/ddnjs";
import { CameraEnhancer, CameraView, DrawingItem, ImageEditorView } from "@dynamsoft/dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter, type SimplifiedCaptureVisionSettings } from "@dynamsoft/cvrjs";

@Component({
  selector: 'app-video-normalizer',
  templateUrl: './video-normalizer.component.html',
  styleUrls: ['./video-normalizer.component.css']
})
export class VideoNormalizerComponent {
  cameraEnhancer: Promise<CameraEnhancer> | null = null;
  router: Promise<CaptureVisionRouter> | null = null;
  bShowUiContainer = true;
  bShowImageContainer = false;
  bDisabledBtnEdit = false;
  bDisabledBtnNor = true;
  bShowLoading = true;

  items: Array<any> = [];
  quads: Array<any> = [];
  image: DSImageData | null = null;
  confirmTheBoundary: () => void = () => { };
  normalze: () => void = () => { };

  @ViewChild('imageEditorViewContainerRef') imageEditorViewContainerRef: any;
  @ViewChild('normalizedImageContainerRef') normalizedImageContainerRef: any;
  @ViewChild('cameraViewContainerRef') cameraViewContainerRef: any;

  async ngOnInit(): Promise<void> {
    //try {
      const view = await CameraView.createInstance();
      const dce = await (this.cameraEnhancer = CameraEnhancer.createInstance(view));
      const imageEditorView = await ImageEditorView.createInstance();
      /* Create an image editing layer view */
      const layer = imageEditorView.createDrawingLayer();
      const normalizer = await (this.router = CaptureVisionRouter.createInstance());
      /* Set the result type to be returned, because we need to normalize the original image later, so here we set the return result type to quadrilateral and original image data */
      let newSettings = await normalizer.getSimplifiedSettings("detect-document-boundaries");
      newSettings!.capturedResultItemTypes = EnumCapturedResultItemType.CRIT_DETECTED_QUAD | EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
      await normalizer.updateSettings("detect-document-boundaries", newSettings!);
      this.cameraViewContainerRef.nativeElement!.append(view.getUIElement());
      this.imageEditorViewContainerRef.nativeElement!.append(imageEditorView.getUIElement());
      normalizer.setInput(dce);

      /* Add result receiver */
      const resultReceiver = new CapturedResultReceiver();
      /* onCapturedResultReceived will return all result items */
      resultReceiver.onDetectedQuadsReceived = async (pResult) => {
        console.log(pResult);
        this.items = pResult.quadsResultItems;
      }
      resultReceiver.onOriginalImageResultReceived = (pResult) => {
        this.image = pResult.imageData;
      }
      normalizer.addResultReceiver(resultReceiver);

      this.confirmTheBoundary = () => {
        /* Hide video view */
        this.bShowUiContainer = false
        /* Show editor view */
        this.bShowImageContainer = true;
        /* Set the acquired image data to editor view */
        imageEditorView.setOriginalImage(this.image!);
        this.quads = [];
        /* Create a graphical element of the detected quadrilateral and add it to the edit view layer */
        for (let i = 0; i < this.items.length; i++) {
          if (this.items[i].type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE) continue;
          const points = this.items[i].location.points;
          const quad = new DrawingItem.QuadDrawingItem({ points });
          this.quads.push(quad);
          layer.addDrawingItems(this.quads);
        }
        this.bDisabledBtnNor = false;
        this.bDisabledBtnEdit = true;
        normalizer.stopCapturing();
      }

      this.normalze = async () => {
        this.bShowImageContainer = false;
        this.normalizedImageContainerRef.nativeElement!.innerHTML = "";
        /* Get the selected quadrilateral */
        let seletedItems = imageEditorView.getSelectedDrawingItems();
        if (seletedItems.length) {
          let quad = seletedItems[0].getQuad();
          /* Set roi */
          let ss = await normalizer.getSimplifiedSettings("normalize-document") as SimplifiedCaptureVisionSettings;
          ss.roiMeasuredInPercentage = false;
          ss.roi.points = quad.points;
          await normalizer.updateSettings("normalize-document", ss);
          /* Capture executes the normalize task */
          let norRes = await normalizer.capture(this.image!, "normalize-document");
          this.normalizedImageContainerRef.nativeElement!.append((norRes.items[0] as NormalizedImageResultItem).toCanvas());
          layer.clearDrawingItems();
        };
        this.bDisabledBtnNor = true;
        this.bDisabledBtnEdit = false;
        /* show video view */
        this.bShowUiContainer = true
        view.getUIElement().style.display = "";
        await normalizer.startCapturing("detect-document-boundaries");
      }

      await dce.open();
      await normalizer.startCapturing("detect-document-boundaries");
      this.bShowLoading = false;
    // } catch (ex: any) {
    //   let errMsg: string;
    //   if (ex.message.includes("network connection error")) {
    //     errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
    //   } else {
    //     errMsg = ex.message || ex;
    //   }
    //   console.error(errMsg);
    //   alert(errMsg);
    // }
  }

  async ngOnDestroy() {
    (await this.router)!.dispose();
    (await this.cameraEnhancer)!.dispose();
    console.log('VideoNormalizer Component Unmount');
  }
}
