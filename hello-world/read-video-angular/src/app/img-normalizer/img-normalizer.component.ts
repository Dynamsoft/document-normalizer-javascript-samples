import { Component, OnInit } from '@angular/core';
import { DocumentNormalizer } from 'dynamsoft-document-normalizer';

@Component({
  selector: 'app-img-normalizer',
  templateUrl: './img-normalizer.component.html',
  styleUrls: ['./img-normalizer.component.css']
})
export class ImgNormalizerComponent implements OnInit {
  pNormalizer = null;

  async ngOnInit(): Promise<void> {}

  normalizeImg = async (e: any) => {
    try {
      const normalizer = await (this.pNormalizer = this.pNormalizer || DocumentNormalizer.createInstance());
      const results = await normalizer.detectQuad(e.target.files[0]);
      document.querySelector(".img-normalized-result").innerHTML = "";
      for(let item of results) {
        const norRes = await normalizer.normalize(e.target.files[0], {quad: item.location});
        const cvs = norRes.image.toCanvas();
        if(document.body.clientWidth < 600) {
          cvs.style.width = "100%";
        }
        document.querySelector(".img-normalized-result").appendChild(cvs);
      }
      console.log(results);
    } catch (ex: any) {
      let errMsg: string;
      if (ex.message.includes("network connection error")) {
        errMsg = "Failed to connect to Dynamsoft License Server: network connection error. Check your Internet connection or contact Dynamsoft Support (support@dynamsoft.com) to acquire an offline license.";
      } else {
        errMsg = ex.message||ex;
      }
      console.error(errMsg);
      alert(errMsg);
    }
    e.target.value = '';
  }

  async ngOnDestroy() {
    if (this.pNormalizer) {
      (await this.pNormalizer).dispose();
      this.pNormalizer = null;
      console.log('ImgNormalizer Component Unmount');
    }
  }
}
