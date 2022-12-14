import { Component, OnInit } from '@angular/core';
import "../dce"; // import side effects. engineResourcePath, so on.
import '../ddn'; // import side effects. The license, engineResourcePath, so on.
import { DocumentNormalizer } from 'dynamsoft-document-normalizer';

@Component({
  selector: 'app-hello-world',
  templateUrl: './hello-world.component.html',
  styleUrls: ['./hello-world.component.css']
})
export class HelloWorldComponent implements OnInit {
  bShowVideoNormalizer = true;
  async ngOnInit(): Promise<void> {
    // Load the library on page load to speed things up.
    try {
      DocumentNormalizer.loadWasm();
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
  swtchVideoOrImgNormalizer(): void {
    this.bShowVideoNormalizer = !this.bShowVideoNormalizer;
  }
}
