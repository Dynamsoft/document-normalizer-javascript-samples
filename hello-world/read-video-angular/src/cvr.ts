import { CaptureVisionRouter, LicenseManager } from "@dynamsoft/cvrjs";

CaptureVisionRouter.engineResourcePath = "https://npm.scannerproxy.com/cdn/@dynamsoft/cvrjs@0.20230815103342.0/dist/";
/** LICENSE ALERT - README
 * To use the library, you need to first specify a license key using the API "license" as shown below.
 */
LicenseManager.initLicense("DLS2eyJvcmdhbml6YXRpb25JRCI6IjIwMDAwMSJ9");
/**
 * You can visit https://www.dynamsoft.com/customer/license/trialLicense?utm_source=github&architecture=dcv&product=ddn&package=js to get your own trial license good for 30 days.
 * Note that if you downloaded this sample from Dynamsoft while logged in, the above license key may already be your own 30-day trial license.
 * For more information, see https://dynamsoft.com/document-normalizer/docs/web/programming/javascript/user-guide/?ver=2.0.10&utm_source=github#configure-the-license or contact support@dynamsoft.com.
 * LICENSE ALERT - THE END
 */
CaptureVisionRouter.preloadModule(["DDN"]);
