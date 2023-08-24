import { useEffect, useRef, MutableRefObject, useState } from 'react';
import "./VideoNormalizer.css";
import { EnumCapturedResultItemType, type DSImageData, ImageSourceAdapter } from "dynamsoft-core";
import { type NormalizedImageResultItem } from "dynamsoft-document-normalizer";
import { CameraEnhancer, CameraView, DrawingItem, ImageEditorView } from "dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter, type SimplifiedCaptureVisionSettings } from "dynamsoft-capture-vision-router";
import DrawingLayer from 'dynamsoft-camera-enhancer/dist/types/class/drawinglayer';

function VideoNormalizer() {
    let imageEditorViewContainerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    let cameraViewContainerRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    let normalizedImageContainer: MutableRefObject<HTMLDivElement | null> = useRef(null);
    let cameraEnhancer: MutableRefObject<Promise<CameraEnhancer> | null> = useRef(null);
    let router: MutableRefObject<Promise<CaptureVisionRouter> | null> = useRef(null);
    let [bShowUiContainer, setShowUiContainer] = useState(true);
    let [bShowImageContainer, setShowImageContainer] = useState(false);
    let [bDisabledBtnEdit, setDisabledBtnEdit] = useState(false);
    let [bDisabledBtnNor, setDisabledBtnNor] = useState(true);
    let [bShowLoading, setShowLoading] = useState(true);

    let normalizer: MutableRefObject<CaptureVisionRouter | null> = useRef(null);
    let dce: MutableRefObject<CameraEnhancer | null> = useRef(null);
    let imageEditorView: MutableRefObject<ImageEditorView | null> = useRef(null);
    let layer: MutableRefObject<DrawingLayer | null> = useRef(null);
    let view: MutableRefObject<CameraView | null> = useRef(null);
    let items: MutableRefObject<Array<any>> = useRef([]);
    let image: MutableRefObject<DSImageData | null> = useRef(null);
    let quads: Array<any> = [];

    useEffect((): any => {
        const init = async () => {
            try {
                view.current = await CameraView.createInstance();
                dce.current = await (cameraEnhancer.current = CameraEnhancer.createInstance(view.current));
                imageEditorView.current = await ImageEditorView.createInstance(imageEditorViewContainerRef.current as HTMLDivElement);
                /* Creates an image editing layer for drawing found document boundaries. */
                layer.current = imageEditorView.current.createDrawingLayer();

                /**
                 * Creates a CaptureVisionRouter instance and configure the task to detect document boundaries.
                 * Also, make sure the original image is returned after it has been processed.
                 */
                normalizer.current = await (router.current = CaptureVisionRouter.createInstance());
                normalizer.current.setInput(dce.current as any as ImageSourceAdapter);
                /**
                 * Sets the result types to be returned.
                 * Because we need to normalize the original image later, here we set the return result type to
                 * include both the quadrilateral and original image data.
                 */
                let newSettings = await normalizer.current.getSimplifiedSettings("detect-document-boundaries");
                newSettings!.capturedResultItemTypes = EnumCapturedResultItemType.CRIT_DETECTED_QUAD | EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
                await normalizer.current.updateSettings("detect-document-boundaries", newSettings!);
                cameraViewContainerRef.current!.append(view.current.getUIElement());

                /* Defines the result receiver for the task.*/
                const resultReceiver = new CapturedResultReceiver();
                resultReceiver.onDetectedQuadsReceived = async (result) => {
                    /* Do something with the result */
                    items.current = result.quadsResultItems;
                }
                resultReceiver.onOriginalImageResultReceived = (result) => {
                    image.current = result.imageData;
                }
                normalizer.current.addResultReceiver(resultReceiver);

                await dce.current.open();
                /* Uses the built-in template "detect-document-boundaries" to start a continuous boundary detection task. */
                await normalizer.current.startCapturing("detect-document-boundaries");
                setShowLoading(false);
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
        init();

        return async () => {
            (await router.current)!.dispose();
            (await cameraEnhancer.current)!.dispose();
            console.log('VideoNormalizer Component Unmount');
        }
    }, []);

    const confirmTheBoundary = () => {
        if(!dce.current!.isOpen() || !items.current.length) return;
        /* Hides the cameraView and shows the imageEditorView. */
        setShowUiContainer(false);
        setShowImageContainer(true);
        /* Draws the image on the imageEditorView first. */
        imageEditorView.current!.setOriginalImage(image.current!);
        quads = [];
        /* Draws the document boundary (quad) over the image. */
        for (let i = 0; i < items.current.length; i++) {
            if (items.current[i].type === EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE) continue;
            const points = items.current[i].location.points;
            const quad = new DrawingItem.QuadDrawingItem({ points });
            quads.push(quad);
            layer.current!.addDrawingItems(quads);
        }
        setDisabledBtnEdit(true);
        setDisabledBtnNor(false);
        normalizer.current!.stopCapturing();
    }

    const normalze = async () => {
        /* Hides the imageEditorView. */
        setShowImageContainer(false);
        /* Removes the old normalized image if any. */
        normalizedImageContainer.current!.innerHTML = "";
        /* Get the selected quadrilateral */
        let seletedItems = imageEditorView.current!.getSelectedDrawingItems();
        let quad;
        if (seletedItems.length) {
            quad = seletedItems[0].getQuad();
        } else {
            quad = items.current[0].location;
        }
        /**
         * Sets the coordinates of the ROI (region of interest)
         * in the built-in template "normalize-document".
         */
        let ss = await normalizer.current!.getSimplifiedSettings("normalize-document") as SimplifiedCaptureVisionSettings;
        ss.roiMeasuredInPercentage = false;
        ss.roi.points = quad.points;
        await normalizer.current!.updateSettings("normalize-document", ss);
        /* Executes the normalization and shows the result on the page */
        let norRes = await normalizer.current!.capture(image.current!, "normalize-document");
        normalizedImageContainer.current!.append((norRes.items[0] as NormalizedImageResultItem).toCanvas());
        layer.current!.clearDrawingItems();
        setDisabledBtnEdit(false);
        setDisabledBtnNor(true);
        /* show video view */
        setShowUiContainer(true);
        view.current!.getUIElement().style.display = "";
        await normalizer.current!.startCapturing("detect-document-boundaries");
    }

    return (
        <div className="container">
            <div id="div-loading" style={{ display: bShowLoading ? "block" : "none" }}>Loading...</div>
            <div id="div-video-btns">
                <button id="confirm-quad-for-normalization" onClick={confirmTheBoundary} disabled={bDisabledBtnEdit}>Confirm the Boundary</button>
                <button id="normalize-with-confirmed-quad" onClick={normalze} disabled={bDisabledBtnNor}>Normalize</button>
            </div >
            <div id="div-ui-container" style={{ display: bShowUiContainer ? "block" : "none", marginTop: "10px", height: "500px" }} ref={cameraViewContainerRef}></div>
            <div id="div-image-container" style={{ display: bShowImageContainer ? "block" : "none", width: "100vw", height: "70vh" }} ref={imageEditorViewContainerRef}>
                <div className="dce-image-container" style={{ width: "100%", height: "100%" }}></div>
            </div>
            <div id="normalized-result" ref={normalizedImageContainer}></div>
        </div >
    );
}

export default VideoNormalizer;
