import "dynamsoft-license";
import "dynamsoft-document-normalizer";
import "dynamsoft-capture-vision-router";

import { CoreModule } from "dynamsoft-core";
import { LicenseManager } from "dynamsoft-license";

/** LICENSE ALERT - README
 * To use the library, you need to first call the method initLicense() to initialize the license using a license key string.
 */
LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");

CoreModule.engineResourcePaths = {
  std: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-std@1.0.0/dist/",
  dip: "https://cdn.jsdelivr.net/npm/dynamsoft-image-processing@2.0.30/dist/",
  core: "https://cdn.jsdelivr.net/npm/dynamsoft-core@3.0.30/dist/",
  license: "https://cdn.jsdelivr.net/npm/dynamsoft-license@3.0.20/dist/",
  cvr: "https://cdn.jsdelivr.net/npm/dynamsoft-capture-vision-router@2.0.30/dist/",
  ddn: "https://cdn.jsdelivr.net/npm/dynamsoft-document-normalizer@2.0.21/dist/",
  dce: "https://cdn.jsdelivr.net/npm/dynamsoft-camera-enhancer@4.0.1/dist/"
};
/**
 * The license "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9" is a temporary license for testing good for 24 hours.
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&architecture=dcv&product=ddn&package=js to get your own trial license good for 30 days.
 * LICENSE ALERT - THE END
 */
CoreModule.loadWasm(["DDN"]).catch((ex:any) => {
  let errMsg;
  if (ex.message?.includes('network connection error')) {
    errMsg =
      'Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.';
  } else {
    errMsg = ex.message || ex;
  }
  console.error(errMsg);
  alert(errMsg);
});
;
