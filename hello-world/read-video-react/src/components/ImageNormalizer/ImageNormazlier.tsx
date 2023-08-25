import { useEffect, useRef, MutableRefObject, ChangeEvent } from "react";
import { type NormalizedImageResultItem } from "dynamsoft-document-normalizer";
import { CaptureVisionRouter } from "dynamsoft-capture-vision-router";
import "./ImageNormalizer.css";

function ImageNormalizer() {
    const iptRef: MutableRefObject<HTMLInputElement | null> = useRef(null);
    const elInr: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const router: MutableRefObject<Promise<CaptureVisionRouter> | null> = useRef(null);

    useEffect((): any => {
        router.current = CaptureVisionRouter.createInstance();

        return async () => {
            (await router.current)!.dispose();
            console.log('ImageNormalizer Component Unmount');
        }
    }, []);

    const captureImg = async (e: ChangeEvent<HTMLInputElement>) => {
        try {
            elInr.current!.innerHTML = "";
            const normalizer = await router.current;
            const results = await normalizer!.capture(e.target.files![0], "detect-and-normalize-document");
            if (results.items.length) {
                const cvs = (results.items[0] as NormalizedImageResultItem).toCanvas();
                if (document.body.clientWidth < 600) {
                    cvs.style.width = "90%";
                }
                elInr.current!.append(cvs);
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

    return (
        <div className="recognize-img">
            <div className="img-ipt"><input type="file" ref={iptRef} onChange={captureImg} /></div>
            <div className="result-area" ref={elInr}></div>
        </div>
    )
}

export default ImageNormalizer;