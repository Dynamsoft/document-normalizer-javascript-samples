import { useEffect, useRef, MutableRefObject, useState } from 'react';
import "./VideoNormalizer.css";
import { EnumCapturedResultItemType, type DSImageData } from "@dynamsoft/dynamsoft-core";
import { type NormalizedImageResultItem } from "@dynamsoft/ddnjs";
import { CameraEnhancer, CameraView, DrawingItem, ImageEditorView } from "@dynamsoft/dynamsoft-camera-enhancer";
import { CapturedResultReceiver, CaptureVisionRouter, type SimplifiedCaptureVisionSettings } from "@dynamsoft/cvrjs";
import DrawingLayer from '@dynamsoft/dynamsoft-camera-enhancer/dist/types/class/drawinglayer';

function VideoRecognizer() {
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
                /* Create an image editing layer view */
                layer.current = imageEditorView.current.createDrawingLayer();
                normalizer.current = await (router.current = CaptureVisionRouter.createInstance());
                /* Set the result type to be returned, because we need to normalize the original image later, so here we set the return result type to quadrilateral and original image data */
                let newSettings = await normalizer.current .getSimplifiedSettings("detect-document-boundaries");
                newSettings!.capturedResultItemTypes = EnumCapturedResultItemType.CRIT_DETECTED_QUAD | EnumCapturedResultItemType.CRIT_ORIGINAL_IMAGE;
                await normalizer.current .updateSettings("detect-document-boundaries", newSettings!);
                cameraViewContainerRef.current!.append(view.current.getUIElement());
                normalizer.current.setInput(dce.current);

                /* Add result receiver */
                const resultReceiver = new CapturedResultReceiver();
                /* onCapturedResultReceived will return all result items */
                resultReceiver.onDetectedQuadsReceived = async (result) => {
                    console.log(result);
                    items.current = result.quadsResultItems;
                }
                resultReceiver.onOriginalImageResultReceived = (result) => {
                    image.current = result.imageData;
                }
                /* Specifiy the result receiver */
                normalizer.current.addResultReceiver(resultReceiver);

                await dce.current.open();
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
        /* Hide video view */
        setShowUiContainer(false);
        /* Show editor view */
        setShowImageContainer(true);
        /* Set the acquired image data to editor view */
        imageEditorView.current!.setOriginalImage(image.current!);
        quads = [];
        /* Create a graphical element of the detected quadrilateral and add it to the edit view layer */
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
        setShowImageContainer(false);
        normalizedImageContainer.current!.innerHTML = "";
        /* Get the selected quadrilateral */
        let seletedItems = imageEditorView.current!.getSelectedDrawingItems();
        if (seletedItems.length) {
            let quad = seletedItems[0].getQuad();
            /* Set roi */
            let ss = await normalizer.current!.getSimplifiedSettings("normalize-document") as SimplifiedCaptureVisionSettings;
            ss.roiMeasuredInPercentage = false;
            ss.roi.points = quad.points;
            await normalizer.current!.updateSettings("normalize-document", ss);
            /* Capture executes the normalize task */
            let norRes = await normalizer.current!.capture(image.current!, "normalize-document");
            normalizedImageContainer.current!.append((norRes.items[0] as NormalizedImageResultItem).toCanvas());
        };
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

export default VideoRecognizer;
