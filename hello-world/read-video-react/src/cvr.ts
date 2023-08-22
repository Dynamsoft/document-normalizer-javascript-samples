import { CaptureVisionRouter, LicenseManager } from "@dynamsoft/cvrjs";

CaptureVisionRouter.engineResourcePath = "https://npm.scannerproxy.com/cdn/@dynamsoft/cvrjs@0.20230815103342.0/dist/";
/** LICENSE ALERT - README 
 * To use the library, you need to first call the method initLicense() to initialize the license using a license key string.
 */
LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");
/**
 * The license "DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9" is a temporary license for testing good for 24 hours.
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&architecture=dcv&product=ddn&package=js to get your own trial license good for 30 days.
 * LICENSE ALERT - THE END
 */
CaptureVisionRouter.preloadModule(["DDN"]);