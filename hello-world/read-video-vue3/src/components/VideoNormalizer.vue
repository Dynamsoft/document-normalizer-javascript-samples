<script setup lang="ts">
import { onMounted, onUnmounted, ref, type Ref } from "vue";
import { EnumCapturedResultItemType, type DSImageData } from "@dynamsoft/dynamsoft-core";
import { type NormalizedImageResultItem } from "@dynamsoft/ddnjs";
import { CameraEnhancer, CameraView, DrawingItem, ImageEditorView } from "@dynamsoft/dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter, type SimplifiedCaptureVisionSettings } from "@dynamsoft/cvrjs";

let imageEditorViewContainerRef: Ref<HTMLDivElement | null> = ref(null);
let cameraViewContainerRef: Ref<HTMLDivElement | null> = ref(null);
let normalizedImageContainer: Ref<HTMLDivElement | null> = ref(null);
let cameraEnhancer: Ref<Promise<CameraEnhancer> | null> = ref(null);
let router: Ref<Promise<CaptureVisionRouter> | null> = ref(null);
let bShowUiContainer = ref(true);
let bShowImageContainer = ref(false);
let bDisabledBtnEdit = ref(false);
let bDisabledBtnNor = ref(true);
let bShowLoading = ref(true);

let items: Array<any> = [];
let quads: Array<any> = [];
let image: DSImageData;
let confirmTheBoundary: () => void;
let normalze: () => void;

onMounted(async () => {
    try {
        const view = await CameraView.createInstance();
        const dce = await (cameraEnhancer.value = CameraEnhancer.createInstance(view));
        const imageEditorView = await ImageEditorView.createInstance(imageEditorViewContainerRef.value as HTMLDivElement);
        /* Create an image editing layer view */
        const layer = imageEditorView.createDrawingLayer();
        const normalizer = await (router.value = CaptureVisionRouter.createInstance());
        /* Set the result type to be returned, because we need to normalize the original image later, so here we set the return result type to quadrilateral and original image data */
        let newSettings = await normalizer.getSimplifiedSettings("detect-document-boundaries");
        newSettings!.capturedResultItemTypes = EnumCapturedResultItemType.CRIT_DETECTED_QUAD | EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
        await normalizer.updateSettings("detect-document-boundaries", newSettings!);
        cameraViewContainerRef.value!.append(view.getUIElement());
        normalizer.setInput(dce);

        /* Add result receiver */
        const resultReceiver = new CapturedResultReceiver();
        resultReceiver.onDetectedQuadsReceived = (result) => {
            console.log(result);
            items = result.quadsResultItems;
        }
        resultReceiver.onOriginalImageResultReceived = (result) => {
            image = result.imageData;
        }
        /* Specifiy the result receiver */
        normalizer.addResultReceiver(resultReceiver);

        confirmTheBoundary = () => {
            /* Hide video view */
            bShowUiContainer.value = false
            /* Show editor view */
            bShowImageContainer.value = true;
            /* Set the acquired image data to editor view */
            imageEditorView.setOriginalImage(image);
            quads = [];
            /* Create a graphical element of the detected quadrilateral and add it to the edit view layer */
            for (let i = 0; i < items.length; i++) {
                if (items[i].type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE) continue;
                const points = items[i].location.points;
                const quad = new DrawingItem.QuadDrawingItem({ points });
                quads.push(quad);
                layer.addDrawingItems(quads);
            }
            bDisabledBtnNor.value = false;
            bDisabledBtnEdit.value = true;
            normalizer.stopCapturing();
        }

        normalze = async () => {
            bShowImageContainer.value = false;
            normalizedImageContainer.value!.innerHTML = "";
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
                let normalizeResult = await normalizer.capture(image, "normalize-document");
                normalizedImageContainer.value!.append((normalizeResult.items[0] as NormalizedImageResultItem).toCanvas());
                layer.clearDrawingItems();
            };
            bDisabledBtnNor.value = true;
            bDisabledBtnEdit.value = false;
            /* show video view */
            bShowUiContainer.value = true
            view.getUIElement().style.display = "";
            await normalizer.startCapturing("detect-document-boundaries");
        }

        await dce.open();
        await normalizer.startCapturing("detect-document-boundaries");
        bShowLoading.value = false;
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
})

onUnmounted(async () => {
    (await router.value)!.dispose();
    (await cameraEnhancer.value)!.dispose();
    console.log('VideoNormalizer Component Unmount');
})
</script>

<template>
    <div id="div-loading" v-show="bShowLoading">Loading...</div>
    <div id="div-video-btns">
        <button id="confirm-quad-for-normalization" @click="confirmTheBoundary" :disabled="bDisabledBtnEdit">Confirm the
            Boundary</button>
        <button id="normalize-with-confirmed-quad" @click="normalze" :disabled="bDisabledBtnNor">Normalize</button>
    </div>
    <div id="div-ui-container" style="margin-top: 10px;height: 500px;" ref="cameraViewContainerRef" v-show="bShowUiContainer"></div>
    <div id="div-image-container" style="display:none; width: 100vw; height: 70vh" ref="imageEditorViewContainerRef"
        v-show="bShowImageContainer">
        <div class="dce-image-container" style="width: 100%; height: 100%"></div>
    </div>
    <div id="normalized-result" ref="normalizedImageContainer"></div>
</template>
    
<style scoped>
#div-video-btns {
    width: 75%;
    margin: 0 auto;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-around;
}</style>