import "@dynamsoft/dynamsoft-license";
import "@dynamsoft/dynamsoft-document-normalizer";
import "@dynamsoft/dynamsoft-capture-vision-router";

import { CoreModule } from "@dynamsoft/dynamsoft-core";
import { LicenseManager } from "@dynamsoft/dynamsoft-license";

/** LICENSE ALERT - README 
 * To use the library, you need to first call the method initLicense() to initialize the license using a license key string.
 */
LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");

CoreModule.engineResourcePaths = {
    std: "https://npm.scannerproxy.com/cdn/@dynamsoft/dynamsoft-capture-vision-std@1.0.0-dev-20231222202916/dist",
    core: "https://npm.scannerproxy.com/cdn/@dynamsoft/dynamsoft-core@3.0.20-dev-20231222202720/dist/",
    license: "https://npm.scannerproxy.com/cdn/@dynamsoft/dynamsoft-license@3.0.0-dev-20231222202756/dist/",
    dip: "https://npm.scannerproxy.com/cdn/@dynamsoft/dynamsoft-image-processing@2.0.30-dev-20231219135109/dist",
    cvr: "https://npm.scannerproxy.com/cdn/@dynamsoft/dynamsoft-capture-vision-router@2.0.20-dev-20231222153419/dist/",
    ddn: "https://npm.scannerproxy.com/cdn/@dynamsoft/dynamsoft-document-normalizer@2.0.12-dev-20231222153409/dist/",
    dce: "https://npm.scannerproxy.com/cdn/@dynamsoft/dynamsoft-camera-enhancer@4.0.1-dev-20231222174818/dist/"
};
/**
 * The license "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9" is a temporary license for testing good for 24 hours.
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&architecture=dcv&product=ddn&package=js to get your own trial license good for 30 days.
 * LICENSE ALERT - THE END
 */
CoreModule.loadWasm(["DDN"]);